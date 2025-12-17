import React, { useState, useRef } from 'react';
import PageLayout from '../components/PageLayout';

type NewsItem = {
  id: number;
  title: string;
  excerpt: string;
  content?: string;
};

// добавил мапу изображений для каждой новости (можно заменить на реальные пути)
const demoImages: Record<number, string[]> = {
  1: ['img1-1','img1-2','img1-3','img1-4','img1-5','img1-6','img1-7','img1-8','img1-9','img1-10','img1-11','img1-12','img1-13','img1-14'],
  2: ['img2-1','img2-2','img2-3','img2-4','img2-5','img2-6','img2-7','img2-8','img2-9','img2-10','img2-11','img2-12','img2-13','img2-14'],
  3: ['img3-1','img3-2','img3-3','img3-4','img3-5','img3-6','img3-7','img3-8','img3-9','img3-10','img3-11','img3-12','img3-13','img3-14'],
  4: ['img4-1','img4-2','img4-3','img4-4','img4-5','img4-6','img4-7','img4-8','img4-9','img4-10','img4-11','img4-12','img4-13','img4-14'],
  5: ['img5-1','img5-2','img5-3','img5-4','img5-5','img5-6','img5-7','img5-8','img5-9','img5-10','img5-11','img5-12','img5-13','img5-14'],
  6: ['img6-1','img6-2','img6-3','img6-4','img6-5','img6-6','img6-7','img6-8','img6-9','img6-10','img6-11','img6-12','img6-13','img6-14'],
  7: ['img7-1','img7-2','img7-3','img7-4','img7-5','img7-6','img7-7','img7-8','img7-9','img7-10','img7-11','img7-12','img7-13','img7-14'],
  8: ['img8-1','img8-2','img8-3','img8-4','img8-5','img8-6','img8-7','img8-8','img8-9','img8-10','img8-11','img8-12','img8-13','img8-14'],
};

// генерируем demoNews динамически, чтобы не поддерживать дублирующиеся данные
const demoNews: NewsItem[] = Object.keys(demoImages).map((k) => {
  const id = Number(k);
  // содержимое новости — заглушка на ~100 слов
  const content = `Это демонстрационный текст новости, служащий заглушкой для визуальной проверки оформления карточки. Здесь кратко описывается суть публикации, приводятся ключевые детали и контекст, чтобы пользователь видел, как будет выглядеть реальный контент. Текст написан нейтрально и информативно, без явного стилевого окраса. Он помогает оценить переносы строк, отступы и ограничение по числу строк. В дальнейшем сюда подставится реальное содержание с изображениями и ссылками. Для теста важно, чтобы текст занимал несколько предложений и выглядел естественно на странице. Дополнительно здесь можно увидеть, как ведёт себя обрезка текста и появление многоточий при достижении лимита строк. Заглушка также проверяет взаимодействие с миниатюрами и изображением на разных устройствах плавно.`;
  return {
    id,
    title: `Заголовок новости ${id}`,
    excerpt: `Краткое описание новости ${id}...`,
    content,
  };
});

// вспомогательная карточка новости с собственной галереей
const NewsCard: React.FC<{ news: NewsItem; idx: number }> = ({ news, idx }) => {
  const [photoIndex, setPhotoIndex] = useState(0);
  const thumbsRefLocal = useRef<HTMLDivElement | null>(null);
  const imgs = demoImages[news.id] || [];

  React.useEffect(() => {
    // при смене новости внутри этой карточки сбрасываем фото
    setPhotoIndex(0);
    if (thumbsRefLocal.current) thumbsRefLocal.current.scrollLeft = 0;
  }, [news.id]);

  return (
    <div className="news-card" style={{ width: '100%', background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 8px 24px rgba(0,0,0,0.08)', boxSizing: 'border-box', marginBottom: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gridTemplateRows: 'auto auto', columnGap: 12, width: '100%', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: 32, lineHeight: '1.05', gridColumn: '1 / 2', gridRow: '1 / 2', textAlign: 'left' }}>{news.title}</h1>

        <div style={{ gridColumn: '2 / 3', gridRow: '1 / 2', display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'flex-start' }}>
          <div style={{ width: 73, height: 73, background: '#eee', borderRadius: 12 }} aria-hidden />
          <div style={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
            <a href="#" style={{ color: '#333', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', maxWidth: '160px' }}>
              Название бренда
            </a>
          </div>
        </div>

        <p style={{ gridColumn: '1 / 3', gridRow: '2 / 3', marginTop: 12, marginBottom: 18, color: '#555', fontSize: 15, lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', textAlign: 'left' }}>
          {news.content ?? news.excerpt}
        </p>
        <div style={{ gridColumn: '2 / 3', gridRow: '2 / 3' }} />
      </div>

      {/* Большая область изображения — под заголовком */}
      <div style={{ marginTop: 18, height: 420, background: '#fafafa', borderRadius: 12, boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ width: '100%', height: '100%', background: '#f3f3f3', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 20 }}>
          {`Изображение новости ${idx + 1} — фото ${photoIndex + 1}`}
        </div>
      </div>

      {/* Галерея миниатюр под основной картинкой с кнопками и подсветкой */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 18 }}>
        <button
          onClick={() => {
            setPhotoIndex((p) => Math.max(0, p - 1));
            thumbsRefLocal.current?.scrollBy({ left: -160, behavior: 'smooth' });
          }}
          aria-label="Влево"
          style={{ width: 40, height: 40, borderRadius: 8, background: '#111', color: '#fff', border: 'none', cursor: 'pointer' }}
        >‹</button>

        <div ref={thumbsRefLocal} style={{ display: 'flex', gap: 12, overflowX: 'auto', padding: '8px 4px', flex: 1, scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch', alignItems: 'center' }}>
          {imgs.map((img, i) => (
            <button
              key={i}
              onClick={() => setPhotoIndex(i)}
              style={{
                flex: '0 0 96px',
                width: 96,
                height: 96,
                padding: 0,
                border: i === photoIndex ? '3px solid #7AC142' : '1px solid #eee',
                borderRadius: 8,
                background: '#eaeaea',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              aria-pressed={i === photoIndex}
            >
              <div style={{ width: '92%', height: '92%', background: '#e6e6e6', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                {i + 1}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={() => {
            setPhotoIndex((p) => Math.min(imgs.length - 1, p + 1));
            thumbsRefLocal.current?.scrollBy({ left: 160, behavior: 'smooth' });
          }}
          aria-label="Вправо"
          style={{ width: 40, height: 40, borderRadius: 8, background: '#111', color: '#fff', border: 'none', cursor: 'pointer' }}
        >›</button>
      </div>
    </div>
  );
};

const UserNewsPage: React.FC = () => {
  const [index, setIndex] = useState(0);

  // текущая фотография в галерее (не путать с index новости)
  const [photoIndex, setPhotoIndex] = useState(0);

  // состояние для правой панели рекомендаций (collapsed / expanded)
  const [recExpanded, setRecExpanded] = useState(false);

  // ref для прокрутки миниатюр
  const thumbsRef = useRef<HTMLDivElement | null>(null);

  const prev = () => setIndex((i) => (i - 1 + demoNews.length) % demoNews.length);
  const next = () => setIndex((i) => (i + 1) % demoNews.length);

  // при смене новости сбрасываем текущую фотографию
  React.useEffect(() => {
    setPhotoIndex(0);
    // опционально прокинуть скрол контейнера миниатюр в начало
    if (thumbsRef.current) thumbsRef.current.scrollLeft = 0;
  }, [index]);

  return (
    <PageLayout>
      <style>{`
        /* Стили для вертикального скроллбара основной колонки */
        .user-news-page main {
          /* Firefox */
          scrollbar-width: thin;
          scrollbar-color: #818181 #D9D9D9;
        }

        /* WebKit (Chrome, Edge, Safari) */
        .user-news-page main::-webkit-scrollbar {
          width: 12px;
        }
        .user-news-page main::-webkit-scrollbar-track {
          background: #D9D9D9;
          border-radius: 6px;
        }
        .user-news-page main::-webkit-scrollbar-thumb {
          background: #818181;
          border-radius: 6px;
          border: 3px solid #D9D9D9; /* чтобы thumb выглядел отделённым от трека */
        }
      `}</style>
      {/* layout: лента новостей (скролл) + фиксированный блок рекомендаций справа */}
      <div
        className="user-news-page"
        style={{
          display: 'flex',
          gap: 24,
          alignItems: 'flex-start',
          height: 'calc(100vh - 84px)', // оставляем высоту под заголовок
          boxSizing: 'border-box',
          padding: '24px 0',
          overflow: 'hidden'
        }}
      >
        {/* основная колонка — прокручиваемая лента */}
        <main style={{ flex: 1, overflowY: 'auto', maxHeight: '100%', paddingRight: 12 }}>
          {/* внутренний контейнер для центрирования/ширины ленты */}
          <div className="news-column" style={{ maxWidth: 980, margin: '0 auto', padding: '0 16px' }}>
            {demoNews.map((news, idx) => (
              <NewsCard key={news.id} news={news} idx={idx} />
            ))}
          </div>
        </main>

        {/* правая колонка: фиксированная (не прокручивается вместе с лентой) */}
        <aside style={{ width: 300, flex: '0 0 300px', marginLeft: 12 }}>
          <div style={{ position: 'sticky', top: 24 }}>
            <div style={{
              background: '#fff',
              borderRadius: 12,
              padding: 16,
              boxShadow: '0 8px 24px rgba(0,0,0,0.04)'
            }}>
              {/* заголовок выровнен влево */}
              <h3 style={{ marginTop: 0, marginBottom: 12, textAlign: 'left' }}>Рекомендации</h3>

              {/* список рекомендаций — 3 или 10 элементов в зависимости от состояния */}
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                { (recExpanded ? Array.from({ length: 10 }, (_, i) => i + 1) : [1,2,3]).map((n) => (
                  <li key={n} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <div style={{
                      width: 44,
                      height: 44,
                      background: '#eee',
                      borderRadius: 8,
                      display: 'block'
                    }} aria-hidden />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {`Название бренда ${n}`}
                      </div>
                      {/* убираем слово "Кратко" по запросу — оставляем пустое место */}
                    </div>
                  </li>
                )) }
              </ul>

              {/* ссылки "Ещё" / "Назад" */}
              <div style={{ marginTop: 12, textAlign: 'left' }}>
                {!recExpanded ? (
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); setRecExpanded(true); }}
                    style={{ color: '#7AC142', display: 'inline-block', cursor: 'pointer' }}
                  >
                    Ещё ▾
                  </a>
                ) : (
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); setRecExpanded(false); }}
                    style={{ color: '#7AC142', display: 'inline-block', cursor: 'pointer' }}
                  >
                    Назад ◂
                  </a>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </PageLayout>
  );
};

export default UserNewsPage;