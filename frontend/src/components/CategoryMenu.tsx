import React, { useMemo, useState } from 'react';
import '../styles/CategoryMenu.css';
import { useCategories } from '../contexts/CategoriesContext';

// Импорт иконок из assets (оставляем как было)
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

const iconsById: Record<number, string> = {
  1: percentIcon,
  2: treeIcon,
  3: clothesIcon,
  4: shoeIcon,
  5: womanIcon,
  6: manIcon,
  7: childIcon,
  8: electronicsIcon,
  9: healthIcon,
  10: hobbyIcon,
};

type CategoryMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CategoryMenu: React.FC<CategoryMenuProps> = ({ isOpen, onClose }) => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const { categories, subcategories } = useCategories();

  const menuCategories = useMemo(() => {
    return categories.map(c => ({
      id: c.id,
      name: c.name,
      icon: iconsById[c.id],
      sub: subcategories.filter(s => s.categoryId === c.id).map(s => s.name),
    }));
  }, [categories, subcategories]);

  if (!isOpen) return null;

  return (
    <>
      <div className="menu-overlay" onClick={onClose} />

      <div className="category-dropdown">
        {menuCategories.map((cat) => (
          <div
            key={cat.id}
            className={`category-item ${hoveredId === cat.id ? 'active' : ''}`}
            onMouseEnter={() => setHoveredId(cat.id)}
          >
            <img src={cat.icon} alt={cat.name} className="category-icon" />
            <span>{cat.name}</span>

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