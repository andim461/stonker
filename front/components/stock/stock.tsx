import React from 'react';
import {Button, Card, Input, Typography, Form} from 'antd';

import './stock.scss';
import {useNavigate} from 'react-router-dom';
import userDataStore from '../../store/userDataStore';
import {observer} from 'mobx-react-lite';
import Header from '../header/header';
import {AdvancedRealTimeChart} from 'react-ts-tradingview-widgets';

const {Text} = Typography;

const Stock = () => {
    return (
        <div className="page">
            <Header />
            <div className="content">
                <div className="graph">
                    <AdvancedRealTimeChart theme="light" autosize symbol={userDataStore.currentTicker} />
                </div>
                <div>info / average / amount / buy / sold</div>
            </div>
        </div>
    );
};

export default observer(Stock);
