import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { useAuth } from '../context/useAuth';
import '../styles/ProfileEditPage.css';

type Props = { mode: 'admin' | 'user' };

const isValidEmail = (s: string) => s.includes('@');

const ProfileEditPage: React.FC<Props> = ({ mode }) => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();

  const [login, setLogin] = useState('');
  const [fio, setFio] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [error, setError] = useState('');

  const backToProfilePath = useMemo(
    () => (mode === 'admin' ? '/admin/profile' : '/user/profile'),
    [mode]
  );

  const currentEmail = user?.email ?? '';

  useEffect(() => {
    if (!user) return;

    const nextLogin = user.login ?? '';
    const nextFio = user.name ?? '';
    const nextEmail = user.email ?? '';

    setLogin((prev) => (prev === nextLogin ? prev : nextLogin));
    setFio((prev) => (prev === nextFio ? prev : nextFio));
    setEmail((prev) => (prev === nextEmail ? prev : nextEmail));
    setPassword('');
  }, [user]);

  const pickAvatar = () => fileRef.current?.click();

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setAvatarUrl(url);

    if (fileRef.current) fileRef.current.value = '';
  };

  const validate = () => {
    if (!login.trim()) return 'Введите логин';
    if (!fio.trim()) return 'Введите ФИО';
    if (!email.trim()) return 'Введите email';
    if (!isValidEmail(email.trim())) return 'Email должен содержать символ @';
    return '';
  };

  const onSave = async () => {
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    const isBlob = avatarUrl.startsWith('blob:');

    try {
      setError('');

      await updateProfile({
        login: login.trim(),
        name: fio.trim(),
        email: email.trim(),
        ...(password.trim() ? ({ password: password.trim() } as any) : {}),
        ...(avatarUrl && !isBlob ? { avatarUrl } : {}),
      });

      if (avatarUrl && isBlob) {
        console.warn(
          'Avatar выбран как локальный файл (blob:). Нужен endpoint загрузки файла, чтобы сохранить в БД.'
        );
      }

      navigate(backToProfilePath, { replace: true });
    } catch (e: any) {
      const apiMsg =
        e?.response?.data?.message ||
        (Array.isArray(e?.response?.data?.errors) ? e.response.data.errors[0] : null);

      setError(apiMsg || e?.message || 'Не удалось сохранить профиль');
    }
  };

  const onCancel = () => navigate(backToProfilePath);

  return (
    <PageLayout>
      <div className="pe-page">
        <div className="pe-shell pe-shell--stack">
          <div className="pe-left pe-left--top">
            <div
              className="pe-avatar pe-avatar--click"
              role="button"
              tabIndex={0}
              aria-label="Изменить фото профиля"
              onClick={pickAvatar}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') pickAvatar();
              }}
            >
              {avatarUrl ? (
                <img className="pe-avatar-img" src={avatarUrl} alt="avatar" />
              ) : (
                <div className="pe-avatar-empty" />
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={onAvatarChange}
            />
          </div>

          <div className="pe-right pe-right--below">
            {error && (
              <div className="pe-error" style={{ background: '#ffd6d6', color: '#b00020', padding: 10, borderRadius: 8 }}>
                {error}
              </div>
            )}

            <div className="pe-row">
              <div className="pe-label">Логин</div>

              <div className="pe-rowline">
                <input
                  className="pe-input"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  placeholder="login"
                />
                <div className="pe-current pe-current--side">Текущий: {user?.login ?? '—'}</div>
              </div>
            </div>

            <div className="pe-row">
              <div className="pe-label">ФИО</div>

              <div className="pe-rowline">
                <input
                  className="pe-input"
                  value={fio}
                  onChange={(e) => setFio(e.target.value)}
                  placeholder="Фамилия Имя Отчество"
                />
                <div className="pe-current pe-current--side">Текущее: {user?.name ?? '—'}</div>
              </div>
            </div>

            <div className="pe-row">
              <div className="pe-label">Email</div>

              <div className="pe-rowline">
                <input
                  className="pe-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@mail.ru"
                />
                <div className="pe-current pe-current--side">Текущий: {currentEmail || '—'}</div>
              </div>
            </div>

            <div className="pe-footerbar">
              <button
                type="button"
                className="pe-btn pe-btn-outline"
                onClick={() => {
                  const p = window.prompt('Введите новый пароль (оставьте пустым, чтобы не менять):', '');
                  if (p != null) setPassword(p);
                }}
              >
                Изменить пароль
              </button>

              <div className="pe-footer-actions">
                <button type="button" className="pe-btn pe-btn-secondary" onClick={onCancel}>
                  Отмена
                </button>
                <button type="button" className="pe-btn pe-btn-primary" onClick={onSave}>
                  ✓ Сохранить
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ProfileEditPage;