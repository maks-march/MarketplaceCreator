import React, { useState } from 'react';
import PageLayout from '../components/PageLayout';
import NewsCreateModal from '../components/NewsCreateModal'; // Импорт модалки
import newsIcon from '../assets/News.svg';
import bookmarkIcon from '../assets/Bookmark - empty.svg';
import bookmarkFilledIcon from '../assets/Bookmark - filled.svg'; // Импорт заполненной иконки
import '../styles/NewsPage.css';

type NewsRow = {
  id: number;
  title: string;
  isBookmarked: boolean;
  images?: (string | number)[]; // Поле для картинок
};

// Добавим тестовые данные [1, 2, 3], чтобы сразу видеть "Img 1"
const initialNews: NewsRow[] = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  title: 'Очень интересно',
  isBookmarked: false,
  images: [1, 2, 3, 4], // Имитация данных как в модальном окне
}));

const NewsPage: React.FC = () => {
  const [news, setNews] = useState<NewsRow[]>(initialNews);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddNewsClick = () => {
    // Пока пусто
  };

  const handleTitleClick = () => {
    setIsModalOpen(true);
  };

  // Обновим handleSaveNews, чтобы добавлять новость в список
  const handleSaveNews = (data: { title: string; date: string; text: string; images: (number | string)[] }) => {
    const newId = Math.max(...news.map(n => n.id), 0) + 1;
    const newNewsItem: NewsRow = {
      id: newId,
      title: data.title,
      isBookmarked: false,
      images: data.images,
    };
    setNews(prev => [newNewsItem, ...prev]);
    setIsModalOpen(false);
  };

  const toggleBookmark = (id: number) => {
    setNews(prev => prev.map(item => 
      item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item
    ));
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
            <button 
              className="news-table__add-btn" 
              type="button"
              onClick={handleAddNewsClick}
              style={{ cursor: 'not-allowed', opacity: 0.7 }}
            >
              Добавить
            </button>
          </div>

          <div className="news-table__body">
            {news.map((item, i) => {
              const index = i + 1;
              const isOdd = index % 2 !== 0;

              return (
                <div
                  key={item.id}
                  className={`news-table__row ${
                    isOdd ? 'news-table__row--odd' : 'news-table__row--even'
                  }`}
                >
                  {/* 1. Номер */}
                  <div className="news-table__cell news-table__cell--index">
                    {index}
                  </div>

                  {/* 2. IMG (Миниатюра) */}
                  <div className="news-table__cell news-table__cell--img">
                    {item.images && item.images.length > 0 ? (
                      (() => {
                        const firstImg = item.images[0];
                        // Проверяем, является ли это URL картинки (включая blob:)
                        const isUrl = typeof firstImg === 'string' && (
                          firstImg.startsWith('http') || 
                          firstImg.startsWith('data:') || 
                          firstImg.startsWith('blob:')
                        );
                        
                        if (isUrl) {
                          return (
                            <img 
                              src={firstImg as string} 
                              alt="thumb" 
                              style={{ 
                                width: '60px', 
                                height: '40px', 
                                objectFit: 'cover', 
                                borderRadius: '6px' 
                              }} 
                            />
                          );
                        } else {
                          // Если это номер или текст (как "Img 1" в модалке)
                          return (
                            <div style={{ 
                              width: '60px', 
                              height: '40px', 
                              background: '#fff', 
                              border: '1px solid #ddd',
                              borderRadius: '6px', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center',
                              fontSize: '12px', 
                              color: '#333',
                              fontWeight: 600,
                              whiteSpace: 'nowrap',
                              overflow: 'hidden'
                            }}>
                              {typeof firstImg === 'number' ? `Img ${firstImg}` : firstImg}
                            </div>
                          );
                        }
                      })()
                    ) : (
                      // Заглушка, если картинок нет
                      <div style={{ 
                        width: '60px', height: '40px', background: '#eee', 
                        borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '12px', color: '#999'
                      }}>
                        IMG
                      </div>
                    )}
                  </div>

                  {/* 3. Название */}
                  <div 
                    className="news-table__cell news-table__cell--title"
                    onClick={handleTitleClick}
                    style={{ cursor: 'pointer' }}
                  >
                    {item.title}
                  </div>

                  {/* 4. Bookmark */}
                  <div className="news-table__cell news-table__cell--actions">
                    <button 
                      className="news-table__action-btn" 
                      type="button"
                      onClick={() => toggleBookmark(item.id)}
                    >
                      <img 
                        src={item.isBookmarked ? bookmarkFilledIcon : bookmarkIcon} 
                        alt="Bookmark" 
                        className="news-table__action-icon" 
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <NewsCreateModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNews}
      />
    </PageLayout>
  );
};

export default NewsPage;