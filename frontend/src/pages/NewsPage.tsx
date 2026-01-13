import React, { useEffect, useMemo, useState } from 'react';
import PageLayout from '../components/PageLayout';
import { newsApi } from '../services/api/news/news.api';
import type { News, CreateNewsRequest, UpdateNewsRequest } from '../services/api/news/news.types';
import NewsCreateCreateModal, { type NewsPayload } from '../components/NewsCreateCreateModal';
import NewsCreateModal, { type NewsModalData } from '../components/NewsCreateModal';
import '../styles/NewsPage.css';

type NewsRow = {
  id: number;
  title: string;
  date?: string;
  text?: string;
  images?: (string | number)[];
};

const mapApiNewsToRow = (n: News): NewsRow => ({
  id: Number(n.id),
  title: n.title ?? '',
  date: n.created ?? '',
  text: n.description ?? '',
  images: (n.imageLinks ?? []).filter((x): x is string => typeof x === 'string'),
});

const NewsPage: React.FC = () => {
  const [news, setNews] = useState<NewsRow[]>([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [selectedNewsId, setSelectedNewsId] = useState<number | null>(null);

  const selectedNews = useMemo(
    () => (selectedNewsId == null ? null : news.find((n) => n.id === selectedNewsId) ?? null),
    [news, selectedNewsId]
  );

  const load = async () => {
    setLoading(true);
    try {
      const res = await newsApi.getAll(1, 50, '');
      if (!res.success) return;

      const payload = res.response as any;
      const list: News[] = (payload?.news ?? payload ?? []) as News[];
      setNews(list.map(mapApiNewsToRow));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load().catch(() => {});
  }, []);

  const handleAddNewsClick = () => setIsCreateOpen(true);

  const handleCreateNews = async (data: NewsPayload) => {
    const req: CreateNewsRequest = {
      title: data.title?.trim() || 'Без названия',
      description: data.text?.trim() || undefined,
      brandId: 1, // TODO: добавить выбор бренда в модалке
      imageFiles: [], // TODO: добавить реальную загрузку File'ов
    };

    const res = await newsApi.create(req);
    if (!res.success) return;

    setIsCreateOpen(false);
    await load();
  };

  const handleTitleClick = (id: number) => {
    setSelectedNewsId(id);
    setIsModalOpen(true);
  };

  const handleSaveNews = async (data: NewsModalData) => {
    if (selectedNewsId == null) return;

    const req: UpdateNewsRequest = {
      title: data.title?.trim() || undefined,
      description: data.text?.trim() || undefined,
    };

    const res = await newsApi.update(String(selectedNewsId), req);
    if (!res.success) return;

    setIsModalOpen(false);
    setSelectedNewsId(null);
    await load();
  };

  const handleDeleteNews = async (id: number) => {
    const ok = window.confirm('Удалить новость?');
    if (!ok) return;
    const res = await newsApi.delete(String(id));
    if (!res.success) return;
    await load();
  };

  return (
    <PageLayout>
      <div className="news-page">
        <div className="news-page__inner">
          <div className="news-page__header">
            <h1 className="news-page__title">Новости</h1>
            <button className="news-table__add-btn" onClick={handleAddNewsClick}>
              Добавить
            </button>
          </div>

          {loading ? (
            <div>Загрузка...</div>
          ) : (
            <div className="news-table">
              <div className="news-table__header">
                <div className="news-table__cell news-table__cell--index">№</div>
                <div className="news-table__cell news-table__cell--img">IMG</div>
                <div className="news-table__cell news-table__cell--title">Название</div>
                <div className="news-table__cell news-table__cell--actions">Действия</div>
              </div>
              <div className="news-table__body">
                {news.map((n, i) => (
                  <div key={n.id} className={`news-table__row ${i % 2 === 0 ? 'news-table__row--odd' : 'news-table__row--even'}`}>
                    <div className="news-table__cell news-table__cell--index">{i + 1}</div>
                    <div className="news-table__cell news-table__cell--img">IMG</div>
                    <div className="news-table__cell news-table__cell--title">
                      <button onClick={() => handleTitleClick(n.id)}>{n.title}</button>
                    </div>
                    <div className="news-table__cell news-table__cell--actions">
                      <button onClick={() => handleTitleClick(n.id)}>✎</button>
                      <button onClick={() => handleDeleteNews(n.id)}>🗑</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <NewsCreateModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedNewsId(null);
            }}
            onSave={handleSaveNews}
            initialData={
              selectedNews
                ? {
                    title: selectedNews.title,
                    date: selectedNews.date ?? '',
                    text: selectedNews.text ?? '',
                    images: selectedNews.images ?? [],
                  }
                : null
            }
          />

          <NewsCreateCreateModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onCreate={handleCreateNews} />
        </div>
      </div>
    </PageLayout>
  );
};

export default NewsPage;