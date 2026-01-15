import React, { useEffect, useState } from 'react';
import PageLayout from '../components/PageLayout';
import { brandsApi } from '../services/api/brands/brands.api';
import '../styles/AdminTables.css';

type BrandRow = {
  id: number;
  name: string;
  description: string;
  created?: string;
};

const pickBrands = (payload: any): any[] => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.brands)) return payload.brands;
  if (Array.isArray(payload.items)) return payload.items;
  if (Array.isArray(payload.users)) return payload.users; // из-за BrandsResponse.users бага
  return [];
};

const AdminBrandsPage: React.FC = () => {
  const [items, setItems] = useState<BrandRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const [view, setView] = useState<BrandRow | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [edit, setEdit] = useState<BrandRow | null>(null);

  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');

  const resetForm = () => {
    setFormName('');
    setFormDesc('');
  };

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const res: any = await brandsApi.getAll(1, 1000);
      if (!res?.success) throw new Error(res?.errors?.[0] || 'Не удалось загрузить бренды');

      const payload = res.response ?? res.data ?? null;
      const list = pickBrands(payload);

      setItems(
        list.map((b: any) => ({
          id: Number(b.id),
          name: String(b.name ?? ''),
          description: String(b.description ?? ''),
          created: String(b.сreated ?? b.created ?? b.createdAt ?? ''),
        }))
      );
    } catch (e: any) {
      setError(e?.message || 'Ошибка загрузки брендов');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const openCreate = () => {
    resetForm();
    setCreateOpen(true);
  };

  const openEdit = (b: BrandRow) => {
    setEdit(b);
    setFormName(b.name);
    setFormDesc(b.description);
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
      const res = await brandsApi.create({ name: formName.trim(), description: formDesc.trim() });
      if (!res.success) throw new Error(res.errors?.[0] || 'Не удалось создать бренд');
      closeModals();
      await load();
    } catch (e: any) {
      setError(e?.message || 'Ошибка создания бренда');
    }
  };

  const onUpdate = async () => {
    if (!edit) return;
    setError('');
    try {
      const res = await brandsApi.update(String(edit.id), {
        name: formName.trim(),
        description: formDesc.trim(),
      });
      if (!res.success) throw new Error(res.errors?.[0] || 'Не удалось обновить бренд');
      closeModals();
      await load();
    } catch (e: any) {
      setError(e?.message || 'Ошибка обновления бренда');
    }
  };

  const onDelete = async (id: number) => {
    if (!confirm('Удалить бренд?')) return;
    setError('');
    const res = await brandsApi.delete(String(id));
    if (!res.success) {
      setError(res.errors?.[0] || 'Не удалось удалить бренд');
      return;
    }
    // закрыть view/edit если удалили открытый элемент
    setView((v) => (v?.id === id ? null : v));
    setEdit((v) => (v?.id === id ? null : v));
    await load();
  };

  return (
    <PageLayout>
      <div className="admin-page">
        <h1 className="admin-page__title">Бренды</h1>

        <div className="admin-page__toolbar">
          <button className="admin-btn admin-btn--primary" onClick={openCreate}>
            + Добавить бренд
          </button>
        </div>

        {loading && <p>Загрузка...</p>}
        {!!error && <div className="admin-error">{error}</div>}

        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 70 }}>ID</th>
              <th>Название</th>
              <th>Описание</th>
              <th style={{ width: 140 }}>Создан</th>
              <th style={{ width: 220, textAlign: 'right' }}>Действия</th>
            </tr>
          </thead>
          <tbody>
            {items.map((b) => (
              <tr
                key={b.id}
                onClick={() => setView(b)}
                role="button"
                tabIndex={0}
              >
                <td>{b.id}</td>
                <td>{b.name}</td>
                <td>{b.description}</td>
                <td>{b.created ? new Date(b.created).toLocaleDateString() : '—'}</td>
                <td onClick={(e) => e.stopPropagation()}>
                  <div className="admin-table__actions">
                    <button className="admin-btn admin-btn--outline" onClick={() => openEdit(b)}>
                      Редактировать
                    </button>
                    <button className="admin-btn admin-btn--danger" onClick={() => onDelete(b.id)}>
                      Удалить
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && items.length === 0 && (
              <tr>
                <td colSpan={5}>Нет брендов</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* View modal */}
        {!!view && (
          <div className="admin-modal__overlay" onClick={closeModals}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
              <h2 className="admin-modal__title">Просмотр бренда</h2>
              <div className="admin-form">
                <div className="admin-field">
                  <label>ID</label>
                  <div>{view.id}</div>
                </div>
                <div className="admin-field">
                  <label>Название</label>
                  <div>{view.name || '—'}</div>
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
                <button className="admin-btn admin-btn--outline" onClick={() => openEdit(view)}>
                  Редактировать
                </button>
                <button className="admin-btn admin-btn--link" onClick={closeModals}>
                  Закрыть
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create / Edit modal */}
        {(createOpen || !!edit) && (
          <div className="admin-modal__overlay" onClick={closeModals}>
            <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
              <h2 className="admin-modal__title">{edit ? 'Редактировать бренд' : 'Добавить бренд'}</h2>

              <div className="admin-form">
                <div className="admin-field">
                  <label>Название</label>
                  <input className="admin-input" value={formName} onChange={(e) => setFormName(e.target.value)} />
                </div>

                <div className="admin-field">
                  <label>Описание</label>
                  <textarea className="admin-textarea" value={formDesc} onChange={(e) => setFormDesc(e.target.value)} />
                </div>
              </div>

              <div className="admin-modal__footer">
                <button className="admin-btn admin-btn--link" onClick={closeModals}>
                  Отмена
                </button>
                <button className="admin-btn admin-btn--primary" onClick={edit ? onUpdate : onCreate} disabled={!formName.trim()}>
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

export default AdminBrandsPage;