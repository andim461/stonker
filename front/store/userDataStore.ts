import {makeAutoObservable, makeObservable} from 'mobx';

interface Stock {
    tag: string;
    count?: number;
    average?: number;
}
class UserStore {
    balance: number = 0;
    token: string = '';
    stocks: Stock[] = [];
    error: string = '';
    login: string = '';
    loading: boolean = false;

    //
    currentTicker: string = null;

    constructor() {
        makeAutoObservable(this);
    }

    signUp(balance: number, token: string, stocks: object, login: string) {
        this.balance = balance;
        this.token = token;
        this.prepareStocks(stocks || {});
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
                    console.log(res.stocks, 'here');
                    this.prepareStocks(res.stocks || {});
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

    prepareStocks(stocks: object) {
        this.stocks = [];
        for (let [key, value] of Object.entries(stocks)) {
            this.stocks.push({...value, tag: key});
        }
        console.log(this.stocks);
    }

    setLoading(isLoading: boolean) {
        this.loading = isLoading;
    }

    setCurrentTicker(ticker: string) {
        this.currentTicker = ticker;
    }

    marketAction(balance: number, stocks: object) {
        this.balance = balance;
        this.prepareStocks(stocks || {});
    }
}
export default new UserStore();
