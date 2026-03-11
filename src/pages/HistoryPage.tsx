import { MainLayout } from '../components/layout/MainLayout';
import { Card } from '../components/ui/Card';
import { useHistory } from '../hooks/useHistory';
import { OBSERVATION_OPTIONS } from '../constants/reportConstants';

const HistoryPage = () => {
  const { history, isLoading, error, refetch } = useHistory({ limit: 50, mine: true });

  const getObservationLabel = (code: string) => {
    const option = OBSERVATION_OPTIONS.find(opt => opt.value === code);
    return option?.label || code;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <MainLayout>
        <h1 className="text-xl font-semibold mb-4">Riwayat Laporan</h1>
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Memuat riwayat...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <h1 className="text-xl font-semibold mb-4">Riwayat Laporan</h1>
        <Card>
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Coba Lagi
            </button>
          </div>
        </Card>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Riwayat Laporan</h1>
        <button
          onClick={() => refetch()}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Refresh
        </button>
      </div>

      {history.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-500">Belum ada laporan</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {history.map((item) => (
            <Card key={item.alertId}>
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">
                      {formatDate(item.serverTimestamp)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      ID: {item.reportId.slice(0, 8)}...
                    </p>
                  </div>
                  <div className="text-right">
                    {item.decision.is_high_risk && (
                      <span className="inline-block px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                        Risiko Tinggi
                      </span>
                    )}
                    {item.decision.is_multisign && (
                      <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded ml-1">
                        Multi-Tanda
                      </span>
                    )}
                    {item.decision.shouldDistribute && (
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded ml-1">
                        Didistribusikan
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Objek Pengamatan:
                  </p>
                  <ul className="space-y-1">
                    {item.input.lik_codes.map((code) => (
                      <li key={code} className="text-sm text-gray-600 flex items-start">
                        <span className="mr-2">•</span>
                        <span>{getObservationLabel(code)}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {item.ml && (
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Prediksi ML: {item.ml.is_high_risk ? 'Risiko Tinggi' : 'Risiko Rendah'} 
                      {item.ml.confidence && ` (${(item.ml.confidence * 100).toFixed(1)}%)`}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </MainLayout>
  );
};

export default HistoryPage;
