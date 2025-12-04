import React, { useState } from 'react';
import '../styles/CategoryMenu.css';

// Импорт иконок из папки assets
import percentIcon from '../assets/Percent.svg';
import treeIcon from '../assets/Tree.svg';
import clothesIcon from '../assets/Clothes.svg';
import shoeIcon from '../assets/Shoe.svg';
import womanIcon from '../assets/Woman.svg';
import manIcon from '../assets/Man.svg';
import childIcon from '../assets/Child.svg';
import electronicsIcon from '../assets/Electronics.svg';
import healthIcon from '../assets/Health.svg';
import hobbyIcon from '../assets/Hobby.svg';

const categories = [
  { id: 1, name: 'Акции', icon: percentIcon, sub: [] },
  { id: 2, name: 'Новый год', icon: treeIcon, sub: ['Ёлки', 'Игрушки', 'Гирлянды', 'Украшения', 'Упаковки', 'Подарки', 'Фейерверки', 'Открытки', 'Костюмы', 'Символ года'] },
  { id: 3, name: 'Одежда', icon: clothesIcon, sub: ['Мужская', 'Женская', 'Детская'] },
  { id: 4, name: 'Обувь', icon: shoeIcon, sub: ['Кроссовки', 'Ботинки', 'Туфли'] },
  { id: 5, name: 'Женщинам', icon: womanIcon, sub: [] },
  { id: 6, name: 'Мужчинам', icon: manIcon, sub: [] },
  { id: 7, name: 'Детям', icon: childIcon, sub: [] },
  { id: 8, name: 'Электроника', icon: electronicsIcon, sub: [] },
  { id: 9, name: 'Здоровье', icon: healthIcon, sub: [] },
  { id: 10, name: 'Хобби', icon: hobbyIcon, sub: [] },
];

type CategoryMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CategoryMenu: React.FC<CategoryMenuProps> = ({ isOpen, onClose }) => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  if (!isOpen) return null;

  return (
    <>
      {/* Оверлей для закрытия при клике вне меню */}
      <div className="menu-overlay" onClick={onClose} />

      {/* Основное меню */}
      <div className="category-dropdown">
        {categories.map((cat) => (
          <div 
            key={cat.id}
            className={`category-item ${hoveredId === cat.id ? 'active' : ''}`}
            onMouseEnter={() => setHoveredId(cat.id)}
          >
            {/* Иконка через img */}
            <img src={cat.icon} alt={cat.name} className="category-icon" />
            
            <span>{cat.name}</span>

            {/* Подменю (показываем, если навели и есть подкатегории) */}
            {hoveredId === cat.id && cat.sub.length > 0 && (
              <div className="subcategory-menu">
                {cat.sub.map((subName) => (
                  <div key={subName} className="subcategory-item">
                    {subName}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default CategoryMenu;