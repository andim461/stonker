import React from 'react';
import {Button, Card, Input, Typography, Form} from 'antd';

import './login.scss';
import {useNavigate} from 'react-router-dom';
import userDataStore from '../../store/userDataStore';
import {observer} from 'mobx-react-lite';

const {Text} = Typography;

const LoginPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onSubmitLogin = () => {
        form.validateFields()
            .then(() => {
                const values = form.getFieldsValue();
                return fetch('/api/auth/signin', {
                    method: 'POST',
                    body: JSON.stringify({login: values.login, password: values.password})
                });
            })
            .then((res) => res.json())
            .then((res) => {
                userDataStore.signUp(res.balance, res.token, res.stocks, res.login);
                localStorage.setItem('token', res.token);
                console.log(userDataStore);
                navigate('/home');
            })
            .catch((error) => {
                userDataStore.setError('Неправильный логин и/или пароль');
            });
    };

    return (
        <div className="login">
            <Card className="login-card" title="Вход в аккаунт" bordered>
                <Form form={form} onSubmitCapture={onSubmitLogin}>
                    <div className="login-content">
                        Логин
                        <div className="login-spacer-s" />
                        <Form.Item
                            className="login-input"
                            name="login"
                            rules={[
                                {
                                    required: true,
                                    min: 5,
                                    message: 'Логин должен быть больше 4 символов',
                                    validateTrigger: 'onSubmit'
                                }
                            ]}
                            validateFirst
                        >
                            <Input className="login-item" placeholder="Логин" />
                        </Form.Item>
                        <div className="login-spacer" />
                        Пароль
                        <div className="login-spacer-s" />
                        <Form.Item
                            className="login-input"
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    min: 8,
                                    message: 'Пароль должен быть больше 7 символов',
                                    validateTrigger: 'onSubmit'
                                },
                                {
                                    pattern: /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/g,
                                    validateTrigger: 'onSubmit',
                                    message: 'Пароль должен состоять из цифр и прописных и строчных букв'
                                }
                            ]}
                            validateFirst
                        >
                            <Input type="password" placeholder="Пароль" />
                        </Form.Item>
                        <div className="login-spacer" />
                        <Form.Item>
                            <Button className="login-item" type="primary" htmlType="submit">
                                Войти
                            </Button>
                        </Form.Item>
                        <div className="login-spacer-xl" />
                        <Button className="login-item" onClick={() => navigate('/signup')}>
                            Зарегистрироваться
                        </Button>
                        <div className="login-spacer-s" />
                        <Text className="login-item" italic>
                            Нет аккаунта?
                        </Text>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default observer(LoginPage);
