import React, {useEffect, useState} from 'react';
import {Button, Card, Input, Typography, Form} from 'antd';

import './market.scss';
import {useNavigate} from 'react-router-dom';
import userDataStore from '../../store/userDataStore';
import {observer} from 'mobx-react-lite';
import Header from '../header/header';

const {Text} = Typography;

interface Stock {
    country: string;
    currency: string;
    exchange: string;
    finnhubIndustry: string;
    ipo: Date;
    logo: string;
    marketCapitalization: number;
    name: string;
    phone: string;
    shareOutstanding: number;
    ticker: string;
    weburl: string;
}

const Market = () => {
    const navigate = useNavigate();
    const [stocks, setStocks] = useState<Stock[]>([]);
    useEffect(() => {
        userDataStore.setLoading(true);
        fetch('/api/stocks/market')
            .catch(() => fetch('api/stocks/market'))
            .then((res) => res.json())
            .then((json: Stock[]) => setStocks(json))
            .catch(() => userDataStore.setError('Ошибка загрузки списка акций'))
            .finally(() => userDataStore.setLoading(false));
    }, []);
    return (
        <div>
            <Header />
            <div className="cards">
                {stocks.map((stock) => (
                    <Card
                        className="card"
                        key={stock.ticker}
                        title={
                            <div>
                                <img className="logo" src={stock.logo} />
                                {stock.name}
                            </div>
                        }
                        extra={
                            <Button
                                type="primary"
                                onClick={() => {
                                    userDataStore.setCurrentTicker(stock.ticker);
                                    navigate('/buy');
                                }}
                            >
                                Купить/продать
                            </Button>
                        }
                    >
                        <p>Страна: {stock.country}</p>
                        <p>Биржа: {stock.exchange}</p>
                        <p>Отрасль: {stock.finnhubIndustry}</p>
                        <p>Рыночная капитализация: {stock.marketCapitalization} M</p>
                        <Button type="link" href={stock.weburl} target="_blank" className="link">
                            {stock.weburl}
                        </Button>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default observer(Market);
