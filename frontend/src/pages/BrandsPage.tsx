import React, { useEffect, useState } from 'react';
import PageLayout from '../components/PageLayout';
import { brandsApi } from '../services/api/brands/brands.api';
import '../styles/BrandsPage.css';

type BrandRow = {
  id: number;
  name: string;
  description: string;
  logoUrl?: string;
};

const pickList = (payload: any): any[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.brands)) return payload.brands;
  if (Array.isArray(payload.items)) return payload.items;
  return [];
};

const pickLogo = (b: any): string => {
  // поддержка разных форматов API
  const arr = b?.images ?? b?.logos ?? b?.pictures ?? b?.photos;
  if (Array.isArray(arr)) {
    const s = arr.find((x: any) => typeof x === 'string' && x.trim().length > 0);
    if (s) return String(s);
  }
  const direct = b?.logoUrl ?? b?.logo ?? b?.image ?? b?.imageUrl;
  if (typeof direct === 'string' && direct.trim().length > 0) return direct.trim();
  return '';
};

const BrandsPage: React.FC = () => {
  const [brands, setBrands] = useState<BrandRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [loadedOk, setLoadedOk] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      setError('');
      setLoadedOk(false);

      try {
        const res: any = await brandsApi.getAll();
        if (!mounted) return;

        if (!res) {
          setError('Пустой ответ от API');
          return;
        }

        if (res.success) {
          const payload = res.response ?? res.data ?? null;
          const items = pickList(payload);

          setBrands(
            items.map((b: any) => ({
              id: Number(b.id),
              name: String(b.name ?? ''),
              description: String(b.description ?? ''),
              logoUrl: pickLogo(b) || undefined,
            }))
          );
          setLoadedOk(true);
        } else {
          setError((res?.errors && res.errors[0]) || 'Ошибка получения брендов');
        }
      } catch (e) {
        if (mounted) setError('Ошибка сети при загрузке брендов');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  const showEmpty = loadedOk && !loading && !error && brands.length === 0;

  return (
    <PageLayout>
      <div className="brands-page">
        <h2>Наши бренды</h2>

        {loading && <div>Загрузка...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {showEmpty && <p>Бренды не найдены</p>}

        {!error && brands.length > 0 && (
          <div className="brands-grid">
            {brands.map((b) => (
              <div key={b.id} className="brand-card">
                <div className="brands-table__img-placeholder" style={{ marginBottom: 10 }}>
                  {b.logoUrl ? (
                    <img src={b.logoUrl} alt="" className="brands-table__thumb" />
                  ) : (
                    'IMG'
                  )}
                </div>

                <h3>{b.name}</h3>
                <p>{b.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default BrandsPage;