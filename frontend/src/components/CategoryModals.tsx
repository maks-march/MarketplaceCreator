import React, { useEffect, useMemo, useState } from 'react';
import AdminListModalShell from './AdminListModalShell';

type Category = { id: number; name: string };
type Subcategory = { id: number; categoryId: number; name: string };

export const CreateCategoryModal: React.FC<{
  open: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}> = ({ open, onClose, onCreate }) => {
  const [name, setName] = useState('');

  useEffect(() => { if (open) setName(''); }, [open]);

  return (
    <AdminListModalShell open={open} onClose={onClose} title="Создание категории">
      <div className="almb-row">
        <div className="almb-label">Название категории:</div>
        <input
          className="almb-input"
          placeholder="Введите название..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="almb-actions">
        <button className="almb-btn" onClick={onClose}>Отмена</button>
        <button className="almb-btn almb-btn-primary" onClick={() => onCreate(name)}>Создать</button>
      </div>
    </AdminListModalShell>
  );
};

export const EditCategoryModal: React.FC<{
  open: boolean;
  onClose: () => void;
  categoryName?: string;
  onSave: (name: string) => void;
}> = ({ open, onClose, categoryName, onSave }) => {
  const [name, setName] = useState(categoryName ?? '');

  useEffect(() => { if (open) setName(categoryName ?? ''); }, [open, categoryName]);

  return (
    <AdminListModalShell open={open} onClose={onClose} title="Редактирование категории">
      <div className="almb-row">
        <div className="almb-label">Название категории:</div>
        <input
          className="almb-input"
          placeholder="Введите название..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="almb-actions">
        <button className="almb-btn" onClick={onClose}>Отмена</button>
        <button className="almb-btn almb-btn-primary" onClick={() => onSave(name)}>Сохранить</button>
      </div>
    </AdminListModalShell>
  );
};

export const CreateSubcategoryModal: React.FC<{
  open: boolean;
  onClose: () => void;
  categories: Category[];
  initialCategoryId?: number | null;
  onCreate: (categoryId: number, name: string) => void;
}> = ({ open, onClose, categories, initialCategoryId, onCreate }) => {
  const [parentId, setParentId] = useState<number | ''>('');
  const [name, setName] = useState('');

  useEffect(() => {
    if (!open) return;
    setParentId(initialCategoryId ?? '');
    setName('');
  }, [open, initialCategoryId]);

  const submit = () => {
    const cid = typeof parentId === 'number' ? parentId : Number(parentId);
    if (!Number.isFinite(cid) || !cid) return;
    onCreate(cid, name);
  };

  return (
    <AdminListModalShell open={open} onClose={onClose} title="Создание подкатегории">
      <div className="almb-row">
        <div className="almb-label">Родительская категория:</div>
        <select className="almb-select" value={parentId} onChange={(e) => setParentId(e.target.value ? Number(e.target.value) : '')}>
          <option value="">Выберите...</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div className="almb-row">
        <div className="almb-label">Название подкатегории:</div>
        <input className="almb-input" placeholder="Введите название..." value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="almb-actions">
        <button className="almb-btn" onClick={onClose}>Отмена</button>
        <button className="almb-btn almb-btn-primary" onClick={submit}>Создать</button>
      </div>
    </AdminListModalShell>
  );
};

export const EditSubcategoryModal: React.FC<{
  open: boolean;
  onClose: () => void;
  categories: Category[];
  initial?: Partial<Subcategory>;
}> = ({ open, onClose, categories, initial }) => {
  const [parentId, setParentId] = useState<number | ''>(initial?.categoryId ?? '');
  const [name, setName] = useState(initial?.name ?? '');

  useEffect(() => {
    if (!open) return;
    setParentId(initial?.categoryId ?? '');
    setName(initial?.name ?? '');
  }, [open, initial?.categoryId, initial?.name]);

  return (
    <AdminListModalShell open={open} onClose={onClose} title="Редактирование подкатегории">
      <div className="almb-row">
        <div className="almb-label">Родительская категория:</div>
        <select className="almb-select" value={parentId} onChange={(e) => setParentId(e.target.value ? Number(e.target.value) : '')}>
          <option value="">Выберите...</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div className="almb-row">
        <div className="almb-label">Название подкатегории:</div>
        <input className="almb-input" placeholder="Введите название..." value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="almb-actions">
        <button className="almb-btn" onClick={onClose}>Отмена</button>
        <button className="almb-btn almb-btn-primary" onClick={onClose}>Сохранить</button>
      </div>
    </AdminListModalShell>
  );
};