import React from 'react';
import LoginPage from './login/login';
import './app.scss';
import {HashRouter, Route, Routes, Navigate} from 'react-router-dom';
import SignupPage from './signup/signup';
import {observer} from 'mobx-react-lite';
import userDataStore from '../store/userDataStore';
import Home from './HomePage/Home';
import Market from './market/market';
import Stock from './stock/stock';

const App: React.FC = () => {
    const isAuth = userDataStore.token || localStorage.getItem('token');
    return (
        <div className="app">
            <HashRouter>
                <Routes>
                    <Route path="/login" element={isAuth ? <Navigate to="/home" replace /> : <LoginPage />} />
                    <Route path="*" element={isAuth ? <Navigate to="/home" replace /> : <LoginPage />} />
                    <Route path="/signup" element={isAuth ? <Navigate to="/home" replace /> : <SignupPage />} />
                    <Route path="/home" element={isAuth ? <Home /> : <Navigate to="/login" replace />} />
                    <Route path="/market" element={isAuth ? <Market /> : <Navigate to="/login" replace />} />
                    <Route
                        path="/buy"
                        element={isAuth && userDataStore.currentTicker ? <Stock /> : <Navigate to="/home" replace />}
                    />
                </Routes>
            </HashRouter>
        </div>
    );
};

export default observer(App);
