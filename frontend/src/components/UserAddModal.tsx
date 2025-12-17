import React from 'react';
import UserEditModal from './UserEditModal';

type UserRow = {
  id: number;
  login: string;
  role: string;
  email: string;
  date: string;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (user: UserRow) => void;
};

/*
  Простая обёртка над UserEditModal для создания нового пользователя.
  Если потребуется, можно вместо обёртки вставить полную копию UserEditModal.
*/
const UserAddModal: React.FC<Props> = ({ isOpen, onClose, onAdd }) => {
  const emptyUser: UserRow = {
    id: Date.now(),
    login: '',
    role: '',
    email: '',
    date: new Date().toLocaleDateString(),
  };

  const handleSave = (u: UserRow) => {
    // Если UserEditModal генерирует новый id, можно переназначить здесь
    if (!u.id) u.id = Date.now();
    onAdd(u);
    onClose();
  };

  return (
    <UserEditModal
      isOpen={isOpen}
      onClose={onClose}
      user={emptyUser}
      onSave={handleSave}
      initialEditMode={true}
      allowEdit={true}
      title="Добавление пользователя"
    />
  );
};

export default UserAddModal;