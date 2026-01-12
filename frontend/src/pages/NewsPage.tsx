import React, { useMemo, useState } from 'react';
import PageLayout from '../components/PageLayout';
import NewsCreateModal, { type NewsModalData } from '../components/NewsCreateModal';
import NewsCreateCreateModal, { type NewsPayload } from '../components/NewsCreateCreateModal';
import newsIcon from '../assets/News.svg';
import '../styles/NewsPage.css';

type NewsRow = {
  id: number;
  title: string;
  date?: string;
  text?: string;
  images?: (string | number)[];
};

const initialNews: NewsRow[] = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  title: 'Очень интересно',
  date: '01.01.2001 11:00',
  text: 'Текст новости',
  images: [1, 2, 3, 4],
}));

const NewsPage: React.FC = () => {
  const [news, setNews] = useState<NewsRow[]>(initialNews);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [selectedNewsId, setSelectedNewsId] = useState<number | null>(null);

  const selectedNews = useMemo(
    () => (selectedNewsId == null ? null : news.find(n => n.id === selectedNewsId) ?? null),
    [news, selectedNewsId]
  );

  const handleAddNewsClick = () => setIsCreateOpen(true);

  const handleCreateNews = (data: NewsPayload) => {
    const newId = Math.max(0, ...news.map(n => n.id)) + 1;

    const newNewsItem: NewsRow = {
      id: newId,
      title: data.title?.trim() || 'Без названия',
      date: (data.date ?? '01.01.2001 11:00'),
      text: (data.text ?? ''),
      images: data.images ?? [],
    };

    setNews(prev => [newNewsItem, ...prev]);
    setIsCreateOpen(false);
  };

  const handleTitleClick = (id: number) => {
    setSelectedNewsId(id);
    setIsModalOpen(true);
  };

  const handleSaveNews = (data: NewsModalData) => {
    if (selectedNewsId == null) {
      setIsModalOpen(false);
      return;
    }

    setNews(prev =>
      prev.map(n =>
        n.id === selectedNewsId
          ? {
              ...n,
              title: data.title?.trim() || 'Без названия',
              date: data.date,
              text: data.text,
              images: data.images ?? [],
            }
          : n
      )
    );

    setIsModalOpen(false);
    setSelectedNewsId(null);
  };

  const getThumbSrc = (img: string | number | undefined) => {
    if (!img) return null;
    if (typeof img === 'string') return img; // objectURL / http URL
    return null; // number-заглушки не рисуем как img
  };

  return (
    <PageLayout>
      <div className="news-page">
        <div className="news-page__header">
          <img src={newsIcon} alt="" className="news-page__icon" />
          <h1 className="news-page__title">Новости</h1>
        </div>

        <div className="news-table">
          <div className="news-table__header">
            <div className="news-table__cell news-table__cell--index">№</div>
            <div className="news-table__header-title">Все записи</div>

            <button className="news-table__add-btn" type="button" onClick={handleAddNewsClick}>
              Добавить
            </button>
          </div>

          <div className="news-table__body">
            {news.map((item, i) => {
              const index = i + 1;
              const isOdd = index % 2 !== 0;

              const thumb = getThumbSrc(item.images?.[0]);

              return (
                <div
                  key={item.id}
                  className={`news-table__row ${isOdd ? 'news-table__row--odd' : 'news-table__row--even'}`}
                >
                  <div className="news-table__cell news-table__cell--index">{index}</div>

                  <div className="news-table__cell news-table__cell--img">
                    <div className="news-table__img-placeholder">
                      {thumb ? <img src={thumb} alt="" className="news-table__thumb" /> : 'IMG'}
                    </div>
                  </div>

                  <div
                    className="news-table__cell news-table__cell--title"
                    onClick={() => handleTitleClick(item.id)}
                    role="button"
                    tabIndex={0}
                  >
                    {item.title}
                  </div>

                  <div className="news-table__cell news-table__cell--actions" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

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
                date: selectedNews.date ?? '01.01.2001 11:00',
                text: selectedNews.text ?? '',
                images: selectedNews.images ?? [],
              }
            : null
        }
      />

      <NewsCreateCreateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={handleCreateNews}
        title="Создание новости"
      />
    </PageLayout>
  );
};

export default NewsPage;