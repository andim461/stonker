import React from 'react';
import LoginPage from './login/login';
import './app.scss';
import {HashRouter, Route, Routes} from 'react-router-dom';
import SignupPage from './signup/signup';

const App: React.FC = () => {
    const isAuth = true;
    return (
        <div>
            <HashRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="*" element={isAuth ? <div>Home page</div> : <LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                </Routes>
            </HashRouter>
        </div>
    );
};

export default App;
