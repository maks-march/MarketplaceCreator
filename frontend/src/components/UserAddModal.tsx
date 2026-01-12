import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import '../styles/UsersPage.css';

type UserRow = {
  id: number;
  login: string;
  role: string; // 'admin' | 'user' (сохраняем строкой как у тебя)
  email: string;
  date: string;
  fio?: string;
};

type NewUserPayload = Omit<UserRow, 'id' | 'date'>;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (user: NewUserPayload) => void;
};

const ROLES = ['admin', 'user'] as const;

const isValidEmail = (s: string) => s.includes('@');

const UserAddModal: React.FC<Props> = ({ isOpen, onClose, onAdd }) => {
  const [login, setLogin] = useState('');
  const [fio, setFio] = useState('');
  const [role, setRole] = useState<(typeof ROLES)[number] | ''>('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  // оставим, чтобы использовать как дефолт/плейсхолдер UI, но в данные date не пишем
  useMemo(() => new Date().toLocaleDateString('ru-RU'), []);

  useEffect(() => {
    if (!isOpen) return;
    setLogin('');
    setFio('');
    setRole('');
    setEmail('');
    setError('');
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const submit = () => {
    const l = login.trim();
    const f = fio.trim();
    const e = email.trim();

    if (!l) return setError('Введите логин');
    if (!f) return setError('Введите ФИО');
    if (!role) return setError('Выберите роль');

    if (!e) return setError('Введите email');
    if (!isValidEmail(e)) return setError('Email должен содержать символ @');

    setError('');

    onAdd({
      login: l,
      fio: f,
      role,
      email: e,
    });

    onClose();
  };

  return ReactDOM.createPortal(
    <div className="users-modal__backdrop" onClick={onClose}>
      <div className="users-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="users-modal__header-row">
          <h2 className="users-modal__title">Добавление пользователя</h2>
          <button className="users-modal__close-btn" onClick={onClose} aria-label="Закрыть">✕</button>
        </div>

        <div className="users-modal__content-area">
          {error && (
            <div className="users-modal__error">
              {error}
            </div>
          )}

          <div className="users-modal__edit-mode">
            <div>
              <label className="users-modal__label">Логин</label>
              <input
                className="users-modal__input"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder="login"
              />
            </div>

            <div>
              <label className="users-modal__label">ФИО</label>
              <input
                className="users-modal__input"
                value={fio}
                onChange={(e) => setFio(e.target.value)}
                placeholder="Фамилия Имя Отчество"
              />
            </div>

            <div>
              <label className="users-modal__label">Роль</label>
              <select
                className="users-modal__input"
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
              >
                <option value="">Выберите роль</option>
                <option value="admin">admin</option>
                <option value="user">user</option>
              </select>
            </div>

            <div>
              <label className="users-modal__label">Email</label>
              <input
                className="users-modal__input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.ru"
              />
            </div>
          </div>

          <div className="users-modal__actions">
            <button type="button" className="users-modal__btn-cancel" onClick={onClose}>
              Отмена
            </button>
            <button type="button" className="users-modal__btn-save" onClick={submit}>
              Создать
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default UserAddModal;