import {makeAutoObservable, makeObservable} from 'mobx';

interface Stock {
    tag: string;
    count?: number;
    avereage?: number;
}
class UserStore {
    balance: number = 0;
    token: string = '';
    stocks: {tag: string; count?: number; price?: number}[] = [];
    error: string = '';
    login: string = '';
    loading: boolean = false;

    //
    currentTicker: string = null;

    constructor() {
        makeAutoObservable(this);
    }

    signUp(balance: number, token: string, stocks: Stock[], login: string) {
        this.balance = balance;
        this.token = token;
        this.stocks = stocks;
        this.login = login;
    }

    setError(message: string) {
        this.error = message;
        console.log(message);
        setTimeout(() => {
            this.error = '';
        }, 3000);
    }

    signOut() {
        this.token = null;
        localStorage.removeItem('token');
    }

    loadUserData() {
        if (!this.balance || !this.login) {
            this.loading = true;
            // Заменить на GET и положить токен в query
            fetch('/api/stocks/user', {
                method: 'POST',
                body: JSON.stringify({token: this.token || localStorage.getItem('token')})
            })
                .then((res) => res.json())
                .then((res) => {
                    console.log(res);
                    this.stocks = res.stocks;
                    this.login = res.login;
                    this.balance = res.balance;
                })
                .catch((err) => {
                    console.log(err);
                    this.error = 'Ошибка загрузки Ваших данных';
                })
                .finally(() => {
                    this.loading = false;
                });
        }
    }

    setLoading(isLoading: boolean) {
        this.loading = isLoading;
    }

    setCurrentTicker(ticker: string) {
        this.currentTicker = ticker;
    }
}
export default new UserStore();
