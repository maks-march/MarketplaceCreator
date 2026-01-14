import React, { useEffect, useState } from 'react';
import PageLayout from '../components/PageLayout';
import { newsApi } from '../services/api/news/news.api';
import '../styles/NewsPage.css';

type NewsItem = {
  id: number;
  title: string;
  description: string;
  date: string;
};

const pickList = (payload: any): any[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.news)) return payload.news;
  if (Array.isArray(payload.items)) return payload.items;
  return [];
};

const NewsPage: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
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
          const items = pickList(payload);

          setNews(
            items.map((n: any) => ({
              id: Number(n.id),
              title: String(n.title ?? ''),
              description: String(n.description ?? n.text ?? ''),
              date: String(n.created ?? n.createdAt ?? ''),
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

  const showEmpty = loadedOk && !loading && !error && news.length === 0;

  return (
    <PageLayout>
      <div className="news-page">
        <h2>Новости</h2>

        {loading && <div>Загрузка...</div>}
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {showEmpty && <div>Новости не найдены</div>}

        {!error && news.length > 0 && (
          <div className="news-list">
            {news.map((n) => (
              <div key={n.id} className="news-item">
                <h3>{n.title}</h3>
                <small>{n.date ? new Date(n.date).toLocaleDateString() : '—'}</small>
                <p>{n.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default NewsPage;