/// <reference lib="webworker" />

import { cleanupOutdatedCaches, precacheAndRoute } from "workbox-precaching"
import type { PrecacheEntry } from "workbox-precaching"

declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: PrecacheEntry[]
}

type PushPayload = {
  title?: string
  body?: string
  url?: string
  data?: Record<string, unknown>
  tag?: string
  beach_location?: string
  beach?: string
}

type HistoryItem = {
  id?: string
  alertId?: string
  reportId?: string
  serverTimestamp?: number
  decision?: {
    shouldDistribute?: boolean
    is_high_risk?: boolean
    is_multisign?: boolean
  }
  ml?: {
    is_high_risk?: boolean
  }
  beach_location?: string
  input?: {
    beach_location?: string
  }
}

const DB_NAME = "samudra-push"
const STORE_NAME = "preferences"
const BEACH_KEY = "selectedBeach"
const LAST_SEEN_PREFIX = "lastSeen:"
const HISTORY_URL = "https://backend.fruz.cloud/api/history?distribute=true&limit=10"

const openDb = () =>
  new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })

const setPreference = async (key: string, value: string) => {
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite")
    tx.objectStore(STORE_NAME).put(value, key)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

const getPreference = async (key: string) => {
  const db = await openDb()
  return new Promise<string | null>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly")
    const request = tx.objectStore(STORE_NAME).get(key)
    request.onsuccess = () => resolve((request.result as string | undefined) ?? null)
    request.onerror = () => reject(request.error)
  })
}

const normalizeTimestamp = (timestamp?: number) => {
  if (!timestamp) return 0
  return timestamp < 1e12 ? timestamp * 1000 : timestamp
}

const getLastSeen = async (beach: string) => {
  const raw = await getPreference(`${LAST_SEEN_PREFIX}${beach}`)
  return raw ? Number(raw) || 0 : 0
}

const setLastSeen = async (beach: string, timestamp: number) => {
  await setPreference(`${LAST_SEEN_PREFIX}${beach}`, String(timestamp))
}

const formatBeachLabel = (value: string) =>
  value
    .split("_")
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join(" ")

const resolveBeachValue = (item: HistoryItem) =>
  item.beach_location ?? item.input?.beach_location

const fetchLatestDistributed = async (selectedBeach: string) => {
  const response = await fetch(HISTORY_URL, { cache: "no-store" })
  if (!response.ok) return null

  const data = (await response.json()) as { items?: HistoryItem[] } | HistoryItem[]
  const items = Array.isArray(data) ? data : data.items ?? []
  const filtered = items.filter((item) =>
    item.decision?.shouldDistribute && resolveBeachValue(item) === selectedBeach
  )

  if (filtered.length === 0) return null

  return filtered.reduce((latest, current) =>
    normalizeTimestamp(current.serverTimestamp) > normalizeTimestamp(latest.serverTimestamp)
      ? current
      : latest
  )
}

cleanupOutdatedCaches()
precacheAndRoute(self.__WB_MANIFEST)

// ==========================================
// PWA Runtime Caching Strategies
// ==========================================

import { registerRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// Cache BMKG APIs (Forecast and RSS) - StaleWhileRevalidate
registerRoute(
  ({ url }) => url.href.includes('api.bmkg.go.id') || url.href.includes('data.bmkg.go.id') || url.pathname.startsWith('/bmkg'),
  new StaleWhileRevalidate({
    cacheName: 'bmkg-api-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 6 * 60 * 60, // 6 hours
      }),
    ],
  })
);

// Cache Backend API (History, Alerts) - NetworkFirst
registerRoute(
  ({ url }) => url.href.includes('backend.fruz.cloud/api'),
  new NetworkFirst({
    cacheName: 'backend-api-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      }),
    ],
  })
);

self.addEventListener("message", (event) => {
  const data = event.data as { type?: string; value?: string } | null
  if (!data || data.type !== "SET_BEACH_PREFERENCE" || !data.value) return
  event.waitUntil(setPreference(BEACH_KEY, data.value))
})

self.addEventListener("push", (event) => {
  event.waitUntil(
    (async () => {
      let payload: PushPayload | undefined
      try {
        payload = event.data?.json() as PushPayload
      } catch {
        payload = undefined
      }

      const payloadData = payload?.data as { beach_location?: string; beach?: string } | undefined
      const payloadBeach = payload?.beach_location ?? payload?.beach ?? payloadData?.beach_location ?? payloadData?.beach

      let selectedBeach: string | null = null
      try {
        selectedBeach = await getPreference(BEACH_KEY)
      } catch {
        selectedBeach = null
      }

      if (selectedBeach) {
        if (payloadBeach && payloadBeach !== selectedBeach) {
          return
        }

        if (!payloadBeach) {
          try {
            const latest = await fetchLatestDistributed(selectedBeach)
            if (!latest) return

            const latestTimestamp = normalizeTimestamp(latest.serverTimestamp)
            const lastSeen = await getLastSeen(selectedBeach)
            if (latestTimestamp <= lastSeen) return

            const isHighRisk = latest.decision?.is_high_risk || latest.ml?.is_high_risk
            const riskLabel = isHighRisk ? "Risiko Tinggi" : "Risiko Rendah"
            const beachLabel = formatBeachLabel(selectedBeach)

            await self.registration.showNotification("Peringatan Tanda Alam Baru", {
              body: `${beachLabel} - ${riskLabel}`,
              data: {
                url: "/",
                reportId: latest.reportId ?? latest.id,
                alertId: latest.alertId,
                beach: selectedBeach,
              },
              tag: latest.reportId ? `history-${latest.reportId}` : undefined,
            })

            await setLastSeen(selectedBeach, latestTimestamp)
            return
          } catch {
            return
          }
        }
      }

      const title = payload?.title ?? "Peringatan Tanda Alam"
      const options: NotificationOptions = {
        body: payload?.body ?? "Ada laporan baru yang perlu diperhatikan.",
        data: {
          url: payload?.url ?? "/",
          ...(payload?.data ?? {}),
        },
        tag: payload?.tag,
      }

      await self.registration.showNotification(title, options)
    })()
  )
})

self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  const targetUrl = (event.notification.data as { url?: string } | undefined)?.url ?? "/"

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(targetUrl) && "focus" in client) {
          return client.focus()
        }
      }

      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl)
      }

      return undefined
    })
  )
})
