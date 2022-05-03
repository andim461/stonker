import React, {useEffect, useState} from 'react';
import {Button, Card, Input, Typography, Form, InputNumber} from 'antd';

import './stock.scss';
import {useNavigate} from 'react-router-dom';
import userDataStore from '../../store/userDataStore';
import {observer} from 'mobx-react-lite';
import Header from '../header/header';
import {AdvancedRealTimeChart} from 'react-ts-tradingview-widgets';
import DefaultApi from 'finnhub/dist/api/DefaultApi';

const {Text} = Typography;

const MyCard = observer(() => {
    const [buyAmount, setBuyAmount] = useState(1);
    const [soldAmount, setSoldAmount] = useState(1);
    const [currentPrice, setPrice] = useState<number>(null);
    const userStock = userDataStore.stocks.find((value) => value.tag === userDataStore.currentTicker);

    useEffect(() => {
        fetch(`https://finnhub.io/api/v1/quote?symbol=${userDataStore.currentTicker}&token=c9dfkjaad3id6u3ebci0`)
            .then((res) => res.json())
            .then((json) => setPrice(json.c));
    }, [buyAmount, soldAmount]);

    const buy = () => {
        userDataStore.setLoading(true);
        fetch('/api/stocks/buy', {
            method: 'POST',
            body: JSON.stringify({
                token: userDataStore.token || localStorage.getItem('token'),
                tag: userDataStore.currentTicker,
                count: buyAmount
            })
        })
            .then((res) => res.json())
            .then((json) => {
                console.log(json);
                if (json.code === 1000) {
                    userDataStore.setError('Не хватает денег.');
                    return;
                }
                userDataStore.marketAction(json.balance, json.stocks);
            })
            .catch((err) => {
                console.log(err);
                userDataStore.setError('Возникла неизвестная ошибка, попробуйте позже или обновите страницу.');
            })
            .finally(() => {
                userDataStore.setLoading(false);
            });
    };
    const sold = () => {
        userDataStore.setLoading(true);
        fetch('/api/stocks/sold', {
            method: 'POST',
            body: JSON.stringify({
                token: userDataStore.token || localStorage.getItem('token'),
                tag: userDataStore.currentTicker,
                count: soldAmount
            })
        })
            .then((res) => res.json())
            .then((json) => {
                console.log(json);
                if (json.code === 1001) {
                    userDataStore.setError('У вас нет акций.');
                    return;
                }
                userDataStore.marketAction(json.balance, json.stocks);
            })
            .catch((err) => {
                console.log(err);
                userDataStore.setError('Возникла неизвестная ошибка, попробуйте позже или обновите страницу.');
            })
            .finally(() => {
                userDataStore.setLoading(false);
            });
    };

    return (
        <Card title={userDataStore.currentTicker} bordered className="stock-card">
            <p>{(userStock?.count || 0) > 0 ? `У Вас ${userStock?.count} акции(я).` : 'У Вас пока нет акций.'}</p>
            {(userStock?.count || 0) > 0 && userStock?.average ? (
                <p>Средняя цена ваших акций: {userStock?.average.toFixed(2)}$</p>
            ) : null}
            <p className="action">
                <InputNumber min={1} defaultValue={1} onChange={(val) => setBuyAmount(val)} className="action-field" />
                {currentPrice ? (currentPrice * buyAmount).toFixed(2) : null}$
                <Button
                    type="primary"
                    size="large"
                    onClick={buy}
                    disabled={userDataStore.loading}
                    className="action-button"
                >
                    Купить
                </Button>
            </p>
            {(userStock?.count || 0) > 0 ? (
                <p className="action">
                    <InputNumber
                        min={1}
                        defaultValue={1}
                        onChange={(val) => setSoldAmount(val)}
                        className="action-field"
                    />
                    {currentPrice ? (currentPrice * soldAmount).toFixed(2) : null}$
                    <Button
                        type="primary"
                        size="large"
                        onClick={sold}
                        disabled={userDataStore.loading}
                        className="action-button"
                    >
                        Продать
                    </Button>
                </p>
            ) : null}
        </Card>
    );
});

const Stock = () => {
    return (
        <div className="page">
            <Header />
            <div className="content">
                <div className="graph">
                    <AdvancedRealTimeChart theme="light" autosize symbol={userDataStore.currentTicker} />
                </div>
                <MyCard />
            </div>
        </div>
    );
};

export default observer(Stock);
