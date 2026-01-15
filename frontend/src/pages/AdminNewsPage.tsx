import React, { useEffect, useState } from 'react';
import PageLayout from '../components/PageLayout';
import { newsApi } from '../services/api/news/news.api';
import { brandsApi } from '../services/api/brands/brands.api';
import '../styles/AdminTables.css';

type NewsRow = {
  id: number;
  title: string;
  description: string;
  created?: string;
  brandId?: number;
  brandName?: string;
};

type BrandPick = { id: number; name: string };

const pickNews = (payload: any): any[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.news)) return payload.news;
  if (Array.isArray(payload.items)) return payload.items;
  return [];
};

const pickBrands = (payload: any): any[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.brands)) return payload.brands;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.users)) return payload.users; // из-за BrandsResponse.users бага
  return [];
};

const AdminNewsPage: React.FC = () => {
  const [items, setItems] = useState<NewsRow[]>([]);
  const [brands, setBrands] = useState<BrandPick[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [view, setView] = useState<NewsRow | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [edit, setEdit] = useState<NewsRow | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formBrandId, setFormBrandId] = useState<number | ''>('');
  const [formFiles, setFormFiles] = useState<File[]>([]);

  const resetForm = () => {
    setFormTitle('');
    setFormDesc('');
    setFormBrandId('');
    setFormFiles([]);
  };

  const loadBrands = async () => {
    const res: any = await brandsApi.getAll(1, 1000);
    if (!res?.success) return;
    const payload = res.response ?? res.data ?? null;
    const list = pickBrands(payload);
    setBrands(list.map((b: any) => ({ id: Number(b.id), name: String(b.name ?? '') })));
  };

  const loadNews = async () => {
    setLoading(true);
    setError('');
    try {
      const res: any = await newsApi.getAll(1, 1000, '');
      if (!res?.success) throw new Error(res?.errors?.[0] || 'Не удалось загрузить новости');

      const payload = res.response ?? res.data ?? null;
      const list = pickNews(payload);

      setItems(
        list.map((n: any) => ({
          id: Number(n.id),
          title: String(n.title ?? ''),
          description: String(n.description ?? ''),
          brandId: n.brandId != null ? Number(n.brandId) : (n.brand?.id != null ? Number(n.brand.id) : undefined),
          brandName: String(n.brand?.name ?? ''),
          created: String(n.created ?? n.createdAt ?? n.сreated ?? ''),
        }))
      );
    } catch (e: any) {
      setError(e?.message || 'Ошибка загрузки новостей');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBrands();
    void loadNews();
  }, []);

  const openCreate = () => {
    resetForm();
    setCreateOpen(true);
  };

  const openEdit = (n: NewsRow) => {
    setEdit(n);
    setFormTitle(n.title);
    setFormDesc(n.description);
    setFormBrandId(n.brandId ?? '');
    setFormFiles([]);
  };

  const closeModals = () => {
    setCreateOpen(false);
    setEdit(null);
    setView(null);
    resetForm();
  };

  const onCreate = async () => {
    setError('');
    try {
      if (!formBrandId) throw new Error('Выберите бренд');

      // ✅ фото НЕ обязательно: передаём пустой массив или undefined
      const res = await newsApi.create({
        title: formTitle.trim(),
        description: formDesc.trim() || undefined,
        brandId: Number(formBrandId),
        imageFiles: formFiles.length ? formFiles : undefined,
      });

      if (!res.success) throw new Error(res.errors?.[0] || 'Не удалось создать новость');
      closeModals();
      await loadNews();
    } catch (e: any) {
      setError(e?.message || 'Ошибка создания новости');
    }
  };

  const onUpdate = async () => {
    if (!edit) return;
    setError('');
    try {
      const res = await newsApi.update(String(edit.id), {
        title: formTitle.trim(),
        description: formDesc.trim() || undefined,
      });
      if (!res.success) throw new Error(res.errors?.[0] || 'Не удалось обновить новость');
      closeModals();
      await loadNews();
    } catch (e: any) {
      setError(e?.message || 'Ошибка обновления новости');
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm('Удалить новость?')) return;
    setError('');
    const res = await newsApi.delete(String(id));
    if (!res.success) {
      setError(res.errors?.[0] || 'Не удалось удалить новость');
      return;
    }
    setView((v) => (v?.id === id ? null : v));
    setEdit((v) => (v?.id === id ? null : v));
    await loadNews();
  };

  return (
    <PageLayout>
      <div className="admin-page">
        <h1 className="admin-page__title">Новости</h1>

        <div className="admin-page__toolbar">
          <button className="admin-btn admin-btn--primary" onClick={openCreate}>
            + Добавить новость
          </button>
        </div>

        {loading && <p>Загрузка...</p>}
        {!!error && <div className="admin-error">{error}</div>}

        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 70 }}>ID</th>
              <th>Заголовок</th>
              <th style={{ width: 220 }}>Бренд</th>
              <th style={{ width: 140 }}>Создана</th>
              <th style={{ width: 220, textAlign: 'right' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {items.map((n) => (
              <tr key={n.id} onClick={() => setView(n)} role="button" tabIndex={0}>
                <td>{n.id}</td>
                <td>{n.title}</td>
                <td>{n.brandName || (n.brandId ? `#${n.brandId}` : '—')}</td>
                <td>{n.created ? new Date(n.created).toLocaleDateString() : '—'}</td>
                <td onClick={(e) => e.stopPropagation()}>
                  <div className="admin-table__actions">
                    <button className="admin-btn admin-btn--outline" onClick={() => openEdit(n)}>
                      Редактировать
                    </button>
                    <button className="admin-btn admin-btn--danger" onClick={() => onDelete(n.id)}>
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={5}>Нет новостей</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* View */}
        {!!view && (
          <div className="admin-modal__overlay" onClick={closeModals}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
              <h2 className="admin-modal__title">Просмотр новости</h2>

              <div className="admin-form">
                <div className="admin-field">
                  <label>ID</label>
                  <div>{view.id}</div>
                </div>
                <div className="admin-field">
                  <label>Заголовок</label>
                  <div>{view.title || '—'}</div>
                </div>
                <div className="admin-field">
                  <label>Бренд</label>
                  <div>{view.brandName || (view.brandId ? `#${view.brandId}` : '—')}</div>
                </div>
                <div className="admin-field">
                  <label>Описание</label>
                  <div>{view.description || '—'}</div>
                </div>
              </div>

              <div className="admin-modal__footer">
                <button className="admin-btn admin-btn--danger" onClick={() => onDelete(view.id)}>
                  Удалить
                </button>
                <button class="admin-btn admin-btn--outline" onClick={() => openEdit(view)}>
                  Редактировать
                </button>
                <button className="admin-btn admin-btn--link" onClick={closeModals}>
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create/Edit */}
        {(createOpen || !!edit) && (
          <div className="admin-modal__overlay" onClick={closeModals}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
              <h2 className="admin-modal__title">{edit ? 'Редактировать новость' : 'Добавить новость'}</h2>

              <div className="admin-form">
                <div className="admin-field">
                  <label>Заголовок</label>
                  <input className="admin-input" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
                </div>

                {!edit && (
                  <div className="admin-field">
                    <label>Бренд</label>
                    <select
                      className="admin-select"
                      value={formBrandId}
                      onChange={(e) => setFormBrandId(e.target.value ? Number(e.target.value) : '')}
                    >
                      <option value="">— выберите —</option>
                      {brands.map((b) => (
                        <option key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="admin-field">
                  <label>Описание</label>
                  <textarea className="admin-textarea" value={formDesc} onChange={(e) => setFormDesc(e.target.value)} />
                </div>

                {!edit && (
                  <div className="admin-field">
                    <label>Фото (необязательно)</label>
                    <input type="file" multiple accept="image/*" onChange={(e) => setFormFiles(Array.from(e.target.files ?? []))} />
                  </div>
                )}
              </div>

              <div className="admin-modal__footer">
                <button className="admin-btn admin-btn--link" onClick={closeModals}>
                  Отмена
                </button>
                <button className="admin-btn admin-btn--primary" onClick={edit ? onUpdate : onCreate} disabled={!formTitle.trim()}>
                  Сохранить
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default AdminNewsPage;