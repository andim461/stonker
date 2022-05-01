import React from 'react';
import {Button, Card, Input, Typography, Form} from 'antd';
import userDataStore from '../../store/userDataStore';

import './signup.scss';
import {useNavigate} from 'react-router-dom';

const {Text} = Typography;

const SignupPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onSubmitSignup = () => {
        form.validateFields()
            .then(() => {
                const values = form.getFieldsValue();
                if (values.password === values.password2) {
                    return fetch('/api/auth/signup', {
                        method: 'POST',
                        body: JSON.stringify({login: values.login, password: values.password})
                    });
                }
                throw Error('Validation');
            })
            .then((res) => res.json())
            .then((res) => {
                userDataStore.signUp(res.balance, res.token, res.stocks);
                console.log(userDataStore);
            })
            .catch((error) => {
                const values = form.getFieldsValue();
                userDataStore.setError(
                    values.password !== values.password2 ? 'Пароли не совпадают' : 'Поля невалидны или Ваш логин занят'
                );
                console.log(userDataStore.error);
            });
    };

    return (
        <div className="login">
            <Card className="login-card" title="Регистрация" bordered>
                <Form form={form} onSubmitCapture={onSubmitSignup}>
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
                        Пароль ещё раз
                        <div className="login-spacer-s" />
                        <Form.Item
                            className="login-input"
                            name="password2"
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
                                },
                                {}
                            ]}
                            validateFirst
                        >
                            <Input type="password" placeholder="Пароль" />
                        </Form.Item>
                        <div className="login-spacer" />
                        <Form.Item>
                            <Button className="login-item" type="primary" htmlType="submit">
                                Зарегистрироваться
                            </Button>
                        </Form.Item>
                        <div className="login-spacer-xl" />
                        <Button className="login-item" onClick={() => navigate('/login')}>
                            Войти
                        </Button>
                        <div className="login-spacer-s" />
                        <Text className="login-item" italic>
                            Есть аккаунт?
                        </Text>
                    </div>
                </Form>
            </Card>
            <div className="error">{userDataStore.error}</div>
        </div>
    );
};

export default SignupPage;
