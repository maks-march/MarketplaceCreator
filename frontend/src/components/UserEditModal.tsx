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
};

const UserEditModal: React.FC<UserEditModalProps> = ({ 
  isOpen, 
  onClose, 
  user, 
  onSave, 
  initialEditMode = false,
  allowEdit = true 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserData | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        ...user,
        fio: user.fio || 'Фамилия Имя Отчество'
      });
      setIsEditing(initialEditMode);
    }
  }, [isOpen, user, initialEditMode]);

  if (!isOpen || !formData) return null;

  const handleChange = (field: keyof UserData, value: string) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleSave = () => {
    if (formData) {
      onSave(formData);
      setIsEditing(false);
      onClose(); // Закрываем после сохранения
    }
  };

  return (
    <div className="users-modal__backdrop" onClick={onClose}>
      <div className="users-modal" onClick={(e) => e.stopPropagation()}>
        
        <div className="users-modal__header-row">
          <h2 className="users-modal__title">
            {isEditing ? 'Редактирование пользователя' : 'Просмотр пользователя'}
          </h2>
          <button className="users-modal__close-btn" onClick={onClose}>
            <img src={xIcon} alt="Close" />
          </button>
        </div>

        <div className="users-modal__content-area">
          
          {!isEditing && (
            <div className="users-modal__view-mode">
              <p className="users-modal__view-row"><strong>Логин:</strong> {formData.login}</p>
              <p className="users-modal__view-row"><strong>id:</strong> {formData.id}</p>
              <p className="users-modal__view-row"><strong>ФИО:</strong> {formData.fio}</p>
              <p className="users-modal__view-row"><strong>Email:</strong> {formData.email}</p>
              <p className="users-modal__view-row"><strong>Дата создания:</strong> {formData.date}</p>
              <p className="users-modal__view-row"><strong>Роль:</strong> {formData.role}</p>
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
                  value={formData.fio}
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
                <input 
                  className="users-modal__input"
                  value={formData.role}
                  onChange={(e) => handleChange('role', e.target.value)}
                />
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
                    onClick={() => setIsEditing(true)}
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