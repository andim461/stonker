import {makeAutoObservable} from 'mobx';

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

    constructor() {
        makeAutoObservable(this);
    }

    signUp(balance: number, token: string, stocks: Stock[]) {
        this.balance = balance;
        this.token = token;
        this.stocks = stocks;
    }

    setError(message: string) {
        this.error = message;
        console.log(message);
        setTimeout(() => {
            this.error = '';
        }, 3000);
    }
}
export default new UserStore();
