import React, { useState, useEffect } from 'react';
import xIcon from '../assets/X.svg';
import pencilIcon from '../assets/pencil.svg';
import '../styles/UsersPage.css';

type UserData = {
  id: number;
  login: string;
  role: string;
  email: string;
  date: string;
  fio?: string;
};

type UserEditModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: UserData | null;
  onSave: (updatedUser: UserData) => void;
  initialEditMode?: boolean; // Сразу открыть в режиме редактирования?
  allowEdit?: boolean;       // Разрешить переключение в режим редактирования?
  title?: string; // <-- добавлено: опциональный заголовок модалки
};

const isValidEmail = (s: string) => s.includes('@');

const UserEditModal: React.FC<UserEditModalProps> = ({ 
  isOpen, 
  onClose, 
  user, 
  onSave, 
  initialEditMode = false,
  allowEdit = true,
  title,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserData | null>(null);
  const [error, setError] = useState(''); // ✅ добавили

  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        ...user,
        fio: user.fio || 'Фамилия Имя Отчество'
      });
      setIsEditing(initialEditMode);
      setError(''); // ✅ сброс ошибки при открытии
    }
  }, [isOpen, user, initialEditMode]);

  if (!isOpen || !formData) return null;

  const handleChange = (field: keyof UserData, value: string) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const validate = () => {
    const login = (formData.login ?? '').trim();
    const fio = (formData.fio ?? '').trim();
    const role = (formData.role ?? '').trim();
    const email = (formData.email ?? '').trim();

    if (!login) return 'Введите логин';
    if (!fio) return 'Введите ФИО';
    if (!role) return 'Выберите роль';
    if (!email) return 'Введите email';
    if (!isValidEmail(email)) return 'Email должен содержать символ @';

    return '';
  };

  const handleSave = () => {
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    onSave(formData);
    setIsEditing(false);
    onClose();
  };

  return (
    <div className="users-modal__backdrop" onClick={onClose}>
      <div className="users-modal" onClick={(e) => e.stopPropagation()}>
        
        <div className="users-modal__header-row">
          <h2 className="users-modal__title">
            {title ?? (isEditing ? 'Редактирование пользователя' : 'Просмотр пользователя')}
          </h2>
          <button className="users-modal__close-btn" onClick={onClose}>
            <img src={xIcon} alt="Close" />
          </button>
        </div>

        <div className="users-modal__content-area">
          
          {/* ✅ показываем ошибку */}
          {error && <div className="users-modal__error">{error}</div>}

          {!isEditing && (
            <div className="users-modal__view-mode">
              <p className="users-modal__view-row"><strong>Логин:</strong>&nbsp;{formData.login}</p>
              <p className="users-modal__view-row"><strong>id:</strong>&nbsp;{formData.id}</p>
              <p className="users-modal__view-row"><strong>ФИО:</strong>&nbsp;{formData.fio ?? '—'}</p>
              <p className="users-modal__view-row"><strong>Email:</strong>&nbsp;{formData.email}</p>
              <p className="users-modal__view-row"><strong>Дата создания:</strong>&nbsp;{formData.date}</p>
              <p className="users-modal__view-row"><strong>Роль:</strong>&nbsp;{formData.role}</p>
            </div>
          )}

          {isEditing && (
            <div className="users-modal__edit-mode">
              <div>
                <label className="users-modal__label">Логин</label>
                <input 
                  className="users-modal__input"
                  value={formData.login}
                  onChange={(e) => handleChange('login', e.target.value)}
                />
              </div>
              <div>
                <label className="users-modal__label">ФИО</label>
                <input 
                  className="users-modal__input"
                  value={formData.fio ?? ''}
                  onChange={(e) => handleChange('fio', e.target.value)}
                />
              </div>
              <div>
                <label className="users-modal__label">Email</label>
                <input 
                  className="users-modal__input"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                />
              </div>
              <div>
                <label className="users-modal__label">Роль</label>
                <select 
                  className="users-modal__input"
                  value={formData.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                >
                  <option value="admin">admin</option>
                  <option value="user">user</option>
                </select>
              </div>
            </div>
          )}

          <div className="users-modal__actions">
            {!isEditing ? (
              <>
                {/* Кнопка "Изменить" показывается только если allowEdit=true */}
                {allowEdit && (
                  <button 
                    className="users-modal__btn-edit" 
                    onClick={() => { if (allowEdit) { setIsEditing(true); setError(''); } }}
                    style={{ marginRight: 'auto' }}
                  >
                    <img src={pencilIcon} alt="" style={{ width: 14, height: 14, marginRight: 8 }} />
                    Изменить
                  </button>
                )}
                <button 
                  className="users-modal__btn-save" 
                  onClick={onClose}
                >
                  Готово
                </button>
              </>
            ) : (
              <>
                <button 
                  className="users-modal__btn-cancel"
                  onClick={() => {
                    // Если открыли сразу в режиме редактирования, то "Отмена" закрывает окно
                    // Если перешли из просмотра, то возвращает в просмотр
                    if (initialEditMode) onClose();
                    else setIsEditing(false);
                  }}
                >
                  Отмена
                </button>
                <button 
                  className="users-modal__btn-save"
                  onClick={handleSave}
                >
                  Сохранить
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserEditModal;