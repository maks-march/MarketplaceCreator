import React, { useEffect, useState } from 'react';
import PageLayout from '../components/PageLayout';
import { newsApi } from '../services/api/news/news.api';
import '../styles/NewsPage.css';

type NewsItem = {
    id: number;
    title: string;
    description: string;
    date: string;
};

const NewsPage: React.FC = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        let mounted = true;
        const load = async () => {
            setLoading(true);
            try {
                const res = await newsApi.getAll();
                if (mounted) {
                    if (res.success && res.data) {
                        // @ts-ignore
                        const items = res.data.news || [];
                        setNews(items.map((n: any) => ({
                            id: n.id,
                            title: n.title,
                            description: n.description,
                            date: n.created
                        })));
                    } else {
                         setError('Ошибка получения новостей');
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
        load();
        return () => { mounted = false; };
    }, []);

    return (
        <PageLayout>
            <div className="news-page">
                <h2>Новости</h2>
                {loading && <div>Загрузка...</div>}
                {error && <div style={{color:'red'}}>{error}</div>}
                <div className="news-list">
                    {news.map(n => (
                        <div key={n.id} className="news-item">
                            <h3>{n.title}</h3>
                            <small>{new Date(n.date).toLocaleDateString()}</small>
                            <p>{n.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </PageLayout>
    );
};

export default NewsPage;