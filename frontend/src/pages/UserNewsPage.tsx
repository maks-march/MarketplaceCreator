import React, { useEffect, useMemo, useState } from 'react';
import PageLayout from '../components/PageLayout';
import { newsApi } from '../services/api/news/news.api';
import '../styles/NewsPage.css';

type NewsItem = {
  id: number;
  title: string;
  text: string;
  date?: string;
  images?: string[];
};

const pickList = (payload: any): any[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.news)) return payload.news;
  if (Array.isArray(payload.items)) return payload.items;
  return [];
};

const normalizeImages = (imgs: any): string[] => {
  if (!Array.isArray(imgs)) return [];
  return imgs
    .filter((x) => typeof x === 'string')
    .map((s) => s.trim())
    .filter(Boolean);
};

const UserNewsPage: React.FC = () => {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadedOk, setLoadedOk] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError('');
      setLoadedOk(false);

      try {
        const res: any = await newsApi.getAll();
        if (!mounted) return;

        if (!res) {
          setError('Пустой ответ от API');
          return;
        }

        if (res.success) {
          const payload = res.response ?? res.data ?? null;
          const list = pickList(payload);

          setItems(
            list.map((n: any) => ({
              id: Number(n.id),
              title: String(n.title ?? ''),
              text: String(n.text ?? n.description ?? ''),
              date: String(n.createdAt ?? n.created ?? '') || undefined,
              images: normalizeImages(n.images ?? n.photos ?? n.pictures),
            }))
          );
          setLoadedOk(true);
        } else {
          setError((res?.errors && res.errors[0]) || 'Ошибка получения новостей');
        }
      } catch (e) {
        if (mounted) setError('Ошибка сети при загрузке новостей');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  const empty = loadedOk && !loading && !error && items.length === 0;

  return (
    <PageLayout>
      <div className="news-page">
        <h2>Новости</h2>

        {loading && <div>Загрузка...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {empty && <div>Новостей пока нет</div>}

        {!error && items.length > 0 && (
          <div className="news-list">
            {items.map((n) => (
              <div key={n.id} className="news-item">
                <h3>{n.title}</h3>
                <small>{n.date ? new Date(n.date).toLocaleDateString() : '—'}</small>
                <p>{n.text}</p>

                {n.images && n.images.length > 0 && (
                  <div style={{ display: 'flex', gap: 10, overflowX: 'auto', marginTop: 10 }}>
                    {n.images.slice(0, 6).map((src) => (
                      <img
                        key={src}
                        src={src}
                        alt=""
                        style={{ width: 160, height: 90, objectFit: 'cover', borderRadius: 8 }}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default UserNewsPage;