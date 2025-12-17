import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import '../styles/ProfilePage.css';

const sampleProducts = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  description: 'Description',
  price: 0
}));

const Carousel: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const scroll = (dir: number) => {
    if (!ref.current) return;
    const step = ref.current.clientWidth * 0.8; // прокрутка ~80% видимой ширины
    ref.current.scrollBy({ left: dir * step, behavior: 'smooth' });
  };
  return (
    <div className="cards-carousel">
      <button className="cards-nav prev" aria-label="Prev" onClick={() => scroll(-1)}>‹</button>
      <div className="cards-row" ref={ref}>
        {children}
      </div>
      <button className="cards-nav next" aria-label="Next" onClick={() => scroll(1)}>›</button>
    </div>
  );
};

// безопасный noop‑cart, если хук useCart отсутствует
const createNoopCart = () => ({
  add: (_id: number) => {},
  remove: (_id: number) => {},
  has: (_id: number) => false
});

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();

  // безопасный fallback: если в проекте есть реальный useCart — импортируйте и замените эту строку
  const { add, remove, has } = createNoopCart();

  const handleEdit = () => navigate('/user/profile/edit');

  const user = {
    avatar: '/assets/vite.svg',
    name: 'ФИО',
    email: 'Email@email.com',
    role: 'Роль'
  };

  return (
    <PageLayout>
      <main className="profile-page">
        {/* ---- НОВАЯ ШАПКА: единый контейнер для аватара, инфо и кнопки --- */}
        <div className="profile-top">
          <div className="profile-avatar-wrap">
            <img className="profile-avatar" src={user.avatar} alt="Аватар" />

            <div className="profile-info">
              <h1 className="profile-name">{user.name}</h1>
              <div className="profile-email">{user.email}</div>
              <div className="profile-role">{user.role}</div>
            </div>

            <div className="profile-actions">
              <button className="btn btn-edit" onClick={handleEdit}>✎ Редактировать</button>
            </div>
          </div>
        </div>
        {/* ---- конец шапки --- */}

        <section className="profile-section">
          <h2>Ваши покупки</h2>
          <Carousel>
            {sampleProducts.map(p => (
              <div key={p.id} className="small-card">
                <div className="small-card-img" onClick={() => navigate(`/user/product/${p.id}`, { state: { product: p } })} />
                <div className="small-card-body">
                  <div className="small-card-title">{p.name}</div>
                  <div className="small-card-desc">{p.description}</div>
                  <div className="small-card-bottom">
                    <div className="small-card-price">0.00 Руб</div>
                    <button
                      className="small-card-add"
                      onClick={() => (has(p.id) ? remove(p.id) : add(p.id))}
                    >
                      {has(p.id) ? 'В корзине' : 'В корзину'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </section>

        <section className="profile-section">
          <h2>Избранное</h2>
          <Carousel>
            {sampleProducts.map(p => (
              <div key={`fav-${p.id}`} className="small-card">
                <div className="small-card-img" />
                <div className="small-card-body">
                  <div className="small-card-title">{p.name}</div>
                  <div className="small-card-desc">{p.description}</div>
                  <div className="small-card-bottom">
                    <div className="small-card-price">0.00 Руб</div>
                    <button className="small-card-add">В корзину</button>
                  </div>
                </div>
              </div>
            ))}
          </Carousel>
        </section>
      </main>
    </PageLayout>
  );
};

export default ProfilePage;