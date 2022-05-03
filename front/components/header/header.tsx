import React, {useEffect} from 'react';
import {Button, Card, Input, Typography, Form} from 'antd';
import {UserOutlined} from '@ant-design/icons';

import './header.scss';
import {useNavigate} from 'react-router-dom';
import userDataStore from '../../store/userDataStore';
import {observer} from 'mobx-react-lite';

const {Text} = Typography;

const header = () => {
    const navigate = useNavigate();
    useEffect(() => {
        userDataStore.loadUserData();
    }, []);
    return (
        <div className="header">
            <Button
                type="default"
                shape="round"
                size="large"
                onClick={() => {
                    userDataStore.signOut();
                    navigate('/login');
                }}
            >
                Выйти
            </Button>
            <Button type="primary" shape="round" size="large" onClick={() => navigate('/feed')}>
                Лента
            </Button>
            <Button type="primary" shape="round" size="large" onClick={() => navigate('/market')}>
                Рынок
            </Button>
            <Button
                type="primary"
                size="large"
                shape="round"
                icon={<UserOutlined />}
                onClick={() => navigate('/home')}
                danger
            >
                {userDataStore.login} | {userDataStore.balance.toFixed(2)}$
            </Button>
        </div>
    );
};

export default observer(header);
