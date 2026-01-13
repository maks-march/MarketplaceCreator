import React, { useEffect, useState } from 'react';
import PageLayout from '../components/PageLayout';
import { brandsApi } from '../services/api/brands/brands.api';
import '../styles/BrandsPage.css';

// Тип для отображения
type BrandRow = {
    id: number;
    name: string;
    description: string;
};

const BrandsPage: React.FC = () => {
    const [brands, setBrands] = useState<BrandRow[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>('');

    // Загрузка данных (паттерн из MainPage/LoginPage)
    useEffect(() => {
        let mounted = true;

        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await brandsApi.getAll();
                if (mounted) {
                    if (res.success && res.data) {
                        // @ts-ignore: Проверка структуры ответа
                        const items = res.data.brands || [];
                        setBrands(items.map((b: any) => ({
                            id: b.id,
                            name: b.name,
                            description: b.description
                        })));
                    } else {
                        setError('Не удалось загрузить бренды');
                    }
                }
            } catch (e) {
                if (mounted) {
                    console.error(e);
                    setError('Ошибка сети');
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        fetchData();

        return () => { mounted = false; };
    }, []);

    if (loading) return <PageLayout><div>Загрузка...</div></PageLayout>;

    return (
        <PageLayout>
            <div className="brands-page">
                <h2>Наши бренды</h2>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                
                <div className="brands-grid">
                    {brands.length === 0 && !error && <p>Бренды не найдены</p>}
                    {brands.map((b) => (
                        <div key={b.id} className="brand-card">
                            <h3>{b.name}</h3>
                            <p>{b.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </PageLayout>
    );
};

export default BrandsPage;