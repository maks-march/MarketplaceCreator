import React from 'react';
import HomeSvg from '../assets/Home.svg';
import NewsSvg from '../assets/News.svg';
import OrdersSvg from '../assets/Orders.svg';
import TagSvg from '../assets/Tag.svg';
import GroupsSvg from '../assets/Groups.svg';  // Новый импорт
import ListSvg from '../assets/List.svg';      // Новый импорт

export type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
};

const cc = (n?: string) => ['icon', n].filter(Boolean).join(' ');

export const SearchIcon: React.FC<IconProps> = ({ size = 18, color = '#8a8a8a', strokeWidth = 2, className }) => (
  <svg className={cc(className)} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

// Обновлённая иконка фильтра: поддержка заливки для активного состояния
type FilterIconProps = IconProps & { filled?: boolean };

export const FilterIcon: React.FC<FilterIconProps> = ({
  size = 18,
  color = '#111',
  strokeWidth = 2,
  className,
  filled = false,
}) => (
  <svg
    className={cc(className)}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? color : 'none'}
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {/* Воронка фильтра */}
    <path d="M3 5h18l-7.5 8.5V19l-4 2v-7.5L3 5z" />
  </svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({ size = 14, color = '#888', strokeWidth = 2, className }) => (
  <svg className={cc(className)} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

export const ArrowLeftIcon: React.FC<IconProps> = ({ size = 18, color = '#111', strokeWidth = 2, className }) => (
  <svg className={cc(className)} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

export const HeartIcon: React.FC<IconProps> = ({ size = 20, color = '#111', strokeWidth = 2, className }) => (
  <svg className={cc(className)} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

export const HeartFilledIcon: React.FC<IconProps> = ({ size = 20, color = '#6BBF21', className }) => (
  <svg className={cc(className)} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" fill={color}></path>
  </svg>
);

export const HomeIcon: React.FC<IconProps> = ({ size = 24 }) => (
  <img src={HomeSvg} alt="Home" width={size} height={size} />
);

export const BoxIcon: React.FC<IconProps> = ({ size = 18, color = '#111', strokeWidth = 2, className }) => (
  <svg className={cc(className)} viewBox="0 0 24 24" width={size} height={size} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 16V8a2 2 0 0 0-1-1.73L13 2.27a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <path d="M3.3 7L12 12l8.7-5"></path>
    <path d="M12 22V12"></path>
  </svg>
);

export const BuildingIcon: React.FC<IconProps> = ({ size = 18, color = '#111', strokeWidth = 2, className }) => (
  <svg className={cc(className)} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="7" height="18"></rect>
    <rect x="14" y="7" width="7" height="14"></rect>
    <path d="M3 9h7M14 13h7"></path>
  </svg>
);

export const UsersIcon: React.FC<IconProps> = ({ size = 18, color = '#111', strokeWidth = 2, className }) => (
  <svg className={cc(className)} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

export const NewsIcon: React.FC<IconProps> = ({ size = 24 }) => (
  <img src={NewsSvg} alt="News" width={size} height={size} />
);

export const TagIcon: React.FC<IconProps> = ({ size = 24 }) => (
  <img src={TagSvg} alt="Tag" width={size} height={size} />
);

export const SortIcon: React.FC<IconProps> = ({ size = 18, color = '#111', strokeWidth = 2, className }) => (
  <svg className={cc(className)} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="4 6 9 6 9 18"></polyline>
    <line x1="7" y1="6" x2="7" y2="18"></line>
    <polyline points="20 18 15 18 15 6"></polyline>
    <line x1="17" y1="6" x2="17" y2="18"></line>
  </svg>
);

// Новый: три полоски (меню) из макета
export const MenuIcon: React.FC<IconProps> = ({ size = 18, color = '#111', strokeWidth = 2, className }) => (
  <svg className={cc(className)} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="4" y1="6" x2="20" y2="6"></line>
    <line x1="4" y1="12" x2="20" y2="12"></line>
    <line x1="4" y1="18" x2="16" y2="18"></line>
  </svg>
);

// Унифицированные SVG для сайдбара (viewBox 0 0 24 24)
export const NavListIcon: React.FC<IconProps> = ({ size = 22, color = '#111', strokeWidth = 2, className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="6" cy="6" r="1.6" fill={color} stroke="none" />
    <line x1="10" y1="6" x2="20" y2="6" />
    <circle cx="6" cy="12" r="1.6" fill={color} stroke="none" />
    <line x1="10" y1="12" x2="20" y2="12" />
    <circle cx="6" cy="18" r="1.6" fill={color} stroke="none" />
    <line x1="10" y1="18" x2="16" y2="18" />
  </svg>
);

export const NavUsersIcon: React.FC<IconProps> = ({ size = 22, color = '#111', strokeWidth = 2, className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="3" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const NavTagIcon: React.FC<IconProps> = ({ size = 22, color = '#111', strokeWidth = 2, className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.59 13.41 12 22l-9-9 8.59-8.59A2 2 0 0 1 13 4h6v6a2 2 0 0 1-.41 1.41Z" />
    <circle cx="7.5" cy="12.5" r="1.5" fill="none" />
  </svg>
);

export const NavCubeIcon: React.FC<IconProps> = ({ size = 22, color = '#111', strokeWidth = 2, className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 16V8l-9-5-9 5v8l9 5 9-5Z" />
    <path d="M3.27 7.96 12 13l8.73-5.04" />
    <path d="M12 22V13" />
  </svg>
);

export const NavDocIcon: React.FC<IconProps> = ({ size = 22, color = '#111', strokeWidth = 2, className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
    <path d="M14 2v6h6" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="14" y2="17" />
  </svg>
);

export const NavMenuIcon: React.FC<IconProps> = ({ size = 22, color = '#111', strokeWidth = 2, className }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="4" y1="6" x2="20" y2="6" />
    <line x1="4" y1="12" x2="20" y2="12" />
    <line x1="4" y1="18" x2="16" y2="18" />
  </svg>
);

export const ListIcon: React.FC<IconProps> = ({ size = 24 }) => (
  <img src={ListSvg} alt="List" width={size} height={size} />
);

export const OrdersIcon: React.FC<IconProps> = ({ size = 24 }) => (
  <img src={OrdersSvg} alt="Orders" width={size} height={size} />
);

export const GroupsIcon: React.FC<IconProps> = ({ size = 24 }) => (
  <img src={GroupsSvg} alt="Groups" width={size} height={size} />
);