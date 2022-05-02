import React from 'react';
import {Button, Card, Input, Typography, Form} from 'antd';

import './home.scss';
import {useNavigate} from 'react-router-dom';
import userDataStore from '../../store/userDataStore';
import {observer} from 'mobx-react-lite';
import Header from '../header/header';

const {Text} = Typography;

const HomePage = () => {
    return (
        <div>
            <Header />
        </div>
    );
};

export default observer(HomePage);
