import React, { useMemo, useState } from 'react';
import PageLayout from '../components/PageLayout';
import '../styles/AdminListsPage.css';
import { useCategories } from '../contexts/CategoriesContext';
import {
  CreateCategoryModal,
  EditCategoryModal,
  CreateSubcategoryModal,
  EditSubcategoryModal,
} from '../components/CategoryModals';
import listIcon from '../assets/List.svg';
import pencilIcon from '../assets/Pencil.svg';

const TrashIcon: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M9 3h6l1 2h4v2H4V5h4l1-2zm1 6h2v9h-2V9zm4 0h2v9h-2V9zM7 9h2v9H7V9z"
      fill="currentColor"
    />
  </svg>
);

const LISTS_TITLE_ICON =
  "data:image/svg+xml,%3csvg%20width='30'%20height='30'%20viewBox='0%200%2030%2030'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M8.75%2011.25V8.75H26.25V11.25H8.75ZM8.75%2016.25V13.75H26.25V16.25H8.75ZM8.75%2021.25V18.75H26.25V21.25H8.75ZM5%2011.25C4.64583%2011.25%204.34896%2011.1302%204.10938%2010.8906C3.86979%2010.651%203.75%2010.3542%203.75%2010C3.75%209.64583%203.86979%209.34896%204.10938%209.10938C4.34896%208.86979%204.64583%208.75%205%208.75C5.35417%208.75%205.65104%208.86979%205.89062%209.10938C6.13021%209.34896%206.25%209.64583%206.25%2010C6.25%2010.3542%206.13021%2010.651%205.89062%2010.8906C5.65104%2011.1302%205.35417%2011.25%205%2011.25ZM5%2016.25C4.64583%2016.25%204.34896%2016.1302%204.10938%2015.8906C3.86979%2015.651%203.75%2015.3542%203.75%2015C3.75%2014.6458%203.86979%2014.349%204.10938%2014.1094C4.34896%2013.8698%204.64583%2013.75%205%2013.75C5.35417%2013.75%205.65104%2013.8698%205.89062%2014.1094C6.13021%2014.349%206.25%2014.6458%206.25%2015C6.25%2015.3542%206.13021%2015.651%205.89062%2015.8906C5.65104%2016.1302%205.35417%2016.25%205%2016.25ZM5%2021.25C4.64583%2021.25%204.34896%2021.1302%204.10938%2020.8906C3.86979%2020.651%203.75%2020.3542%203.75%2020C3.75%2019.6458%203.86979%2019.349%204.10938%2019.1094C4.34896%2018.8698%204.64583%2018.75%205%2018.75C5.35417%2018.75%205.65104%2018.8698%205.89062%2019.1094C6.13021%2019.349%206.25%2019.6458%206.25%2020C6.25%2020.3542%206.13021%2020.651%205.89062%2020.8906C5.65104%2021.1302%205.35417%2021.25%205%2021.25Z'%20fill='%231D1B20'/%3e%3c/svg%3e";

const AdminListsPage: React.FC = () => {
  const {
    categories,
    subcategories,
    updateCategoryName,
    createCategory,
    createSubcategory,
    deleteCategory,
    deleteSubcategory,
  } = useCategories();

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(2);

  // модалки
  const [openCreateCat, setOpenCreateCat] = useState(false);
  const [openEditCat, setOpenEditCat] = useState(false);
  const [openCreateSub, setOpenCreateSub] = useState(false);
  const [openEditSub, setOpenEditSub] = useState(false);

  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState<string>('');

  const [editingSub, setEditingSub] = useState<{ id: number; categoryId: number; name: string } | null>(null);

  const selectedCategory = useMemo(
    () => (selectedCategoryId == null ? null : categories.find(c => c.id === selectedCategoryId) ?? null),
    [categories, selectedCategoryId]
  );

  const visibleSubs = useMemo(
    () => (selectedCategoryId == null ? [] : subcategories.filter(s => s.categoryId === selectedCategoryId)),
    [subcategories, selectedCategoryId]
  );

  const confirmDeleteCategory = (id: number, name: string) => {
    const ok = window.confirm(`Удалить категорию "${name}"? Подкатегории также будут удалены.`);
    if (!ok) return;
    deleteCategory(id);
    // если удалили выбранную — сбросить выбор
    setSelectedCategoryId(prev => (prev === id ? null : prev));
  };

  const confirmDeleteSubcategory = (id: number, name: string) => {
    const ok = window.confirm(`Удалить подкатегорию "${name}"?`);
    if (!ok) return;
    deleteSubcategory(id);
  };

  return (
    <PageLayout>
      <div className="al-page">
        <h1 className="al-title">
          <img className="al-title__icon" src={LISTS_TITLE_ICON} alt="" aria-hidden="true" />
          ДЕРЕВО КАТЕГОРИЙ
        </h1>

        <div className="al-grid">
          <section className="al-col al-col--left" aria-label="Категории">
            <div className="lists-card">
              <div className="lists-card__header">
                <div className="lists-card__header-title">Категории</div>
                <button type="button" className="lists-card__btn-add" onClick={() => setOpenCreateCat(true)}>
                  + Добавить
                </button>
              </div>

              <div className="lists-card__body">
                {categories.map(c => (
                  <div key={c.id} className={`lists-row ${selectedCategoryId === c.id ? 'is-active' : ''}`}>
                    <button
                      type="button"
                      className="lists-row__edit"
                      aria-label="Редактировать"
                      onClick={() => {
                        setEditingCategoryId(c.id);
                        setEditingCategoryName(c.name);
                        setOpenEditCat(true);
                      }}
                    >
                      <img src={pencilIcon} alt="" width={24} height={24} />
                    </button>

                    <button
                      type="button"
                      className="lists-row__delete"
                      aria-label="Удалить"
                      onClick={() => confirmDeleteCategory(c.id, c.name)}
                    >
                      <TrashIcon size={22} />
                    </button>

                    <button type="button" className="lists-row__item" onClick={() => setSelectedCategoryId(c.id)}>
                      {c.name}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="al-arrow" aria-hidden="true">
            ➜
          </div>

          <section className="al-col al-col--right" aria-label="Подкатегории">
            <div className="lists-card">
              <div className="lists-card__header">
                <div className="lists-card__header-title">Подкатегории</div>
                <button
                  type="button"
                  className="lists-card__btn-add"
                  disabled={selectedCategoryId == null}
                  onClick={() => setOpenCreateSub(true)}
                >
                  + Добавить
                </button>
              </div>

              <div className="lists-card__body">
                {selectedCategory == null ? (
                  <div className="lists-empty">Выберите категорию</div>
                ) : (
                  visibleSubs.map(s => (
                    <div key={s.id} className="lists-row">
                      <button
                        type="button"
                        className="lists-row__edit"
                        aria-label="Редактировать"
                        onClick={() => {
                          setEditingSub(s);
                          setOpenEditSub(true);
                        }}
                      >
                        <img src={pencilIcon} alt="" width={24} height={24} />
                      </button>

                      <button
                        type="button"
                        className="lists-row__delete"
                        aria-label="Удалить"
                        onClick={() => confirmDeleteSubcategory(s.id, s.name)}
                      >
                        <TrashIcon size={22} />
                      </button>

                      <div className="lists-row__item lists-row__item--static">{s.name}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      <CreateCategoryModal
        open={openCreateCat}
        onClose={() => setOpenCreateCat(false)}
        onCreate={(name) => { createCategory(name); setOpenCreateCat(false); }}
      />

      <EditCategoryModal
        open={openEditCat}
        onClose={() => setOpenEditCat(false)}
        categoryName={editingCategoryName}
        onSave={(name) => {
          if (editingCategoryId != null) updateCategoryName(editingCategoryId, name);
          setOpenEditCat(false);
        }}
      />

      <CreateSubcategoryModal
        open={openCreateSub}
        onClose={() => setOpenCreateSub(false)}
        categories={categories}
        initialCategoryId={selectedCategoryId}
        onCreate={(categoryId, name) => {
          createSubcategory(categoryId, name);
          setOpenCreateSub(false);
        }}
      />
      <EditSubcategoryModal
        open={openEditSub}
        onClose={() => setOpenEditSub(false)}
        categories={categories}
        initial={editingSub ?? undefined}
      />
    </PageLayout>
  );
};

export default AdminListsPage;