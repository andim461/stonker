const express = require('express');
const stocks = express.Router();
const {connect: dbConnect} = require('../../db');
const {v4: uuid} = require('uuid');
const jwt = require('jsonwebtoken');
const {SECRET_JWT, STOCK_TAGS} = require('../../constants');
const fs = require('fs');
const path = require('path');

stocks.post('/buy', async (req, res) => {
    const db = await dbConnect();

    if (!req.body.token || !STOCK_TAGS.includes(req.body.tag) || !req.body.count) {
        res.sendStatus(402);
        return;
    }

    let _id = null;

    try {
        _id = jwt.verify(req.body.token, SECRET_JWT)._id;
    } catch (err) {
        res.sendStatus(403);
        return;
    }

    // ищем по id
    const documents = await db.find({selector: {_id: {$eq: _id}}});

    if (!documents.docs.length) {
        console.log(documents, req.body.login);
        res.sendStatus(403);
        return;
    }
    const user = documents.docs[0];

    const finnhub = require('finnhub');

    const api_key = finnhub.ApiClient.instance.authentications['api_key'];
    api_key.apiKey = 'c9dfkjaad3id6u3ebci0';
    const finnhubClient = new finnhub.DefaultApi();

    finnhubClient.quote(req.body.tag, (error, data, response) => {
        const price = data.c * req.body.count;
        if (price > user.balance || !user.balance) {
            res.send({error: 'Have not money', code: 1000});
            return;
        }
        const currCount = user.stocks && req.body.tag in user.stocks ? user.stocks[req.body.tag].count : 0;
        const average = currCount
            ? (user.stocks[req.body.tag].price * currCount + price) / (currCount + req.body.count)
            : data.c;
        db.insert({
            ...user,
            balance: user.balance - price,
            stocks: {...user.stocks, [req.body.tag]: {count: currCount + req.body.count, average}}
        });
        res.send({
            balance: user.balance - price,
            stocks: {...user.stocks, [req.body.tag]: {count: currCount + req.body.count, average}}
        });
    });
});

/* 
    req.body = {
        login: string;
        password: string;
    }
*/

stocks.post('/sold', async (req, res) => {
    const db = await dbConnect();

    if (!req.body.token || !STOCK_TAGS.includes(req.body.tag) || !req.body.count) {
        res.sendStatus(402);
        return;
    }

    let _id = null;

    try {
        _id = jwt.verify(req.body.token, SECRET_JWT)._id;
    } catch (err) {
        res.sendStatus(403);
        return;
    }

    // ищем по id
    const documents = await db.find({selector: {_id: {$eq: _id}}});

    if (!documents.docs.length) {
        console.log(documents, req.body.login);
        res.sendStatus(403);
        return;
    }
    const user = documents.docs[0];

    const finnhub = require('finnhub');

    const api_key = finnhub.ApiClient.instance.authentications['api_key'];
    api_key.apiKey = 'c9dfkjaad3id6u3ebci0';
    const finnhubClient = new finnhub.DefaultApi();

    finnhubClient.quote(req.body.tag, (error, data, response) => {
        const currCount = user.stocks && req.body.tag in user.stocks ? user.stocks[req.body.tag].count : 0;
        const price = data.c * req.body.count;
        if (currCount < req.body.count) {
            res.send({error: 'Have not stock', code: 1001});
            return;
        }
        db.insert({
            ...user,
            balance: user.balance + price,
            stocks: {
                ...user.stocks,
                [req.body.tag]: {...user.stocks[req.body.tag], count: currCount - req.body.count}
            }
        });
        res.send({
            balance: user.balance + price,
            stocks: {
                ...user.stocks,
                [req.body.tag]: {...user.stocks[req.body.tag], count: currCount - req.body.count}
            }
        });
    });
});

stocks.get('/market', (req, res) => {
    try {
        const data = [];
        for (let tag of STOCK_TAGS) {
            const fileData = fs.readFileSync(path.join(__dirname, `../../companiesData_${tag}`));
            const json = JSON.parse(fileData);
            data.push(json);
        }
        console.log(data);
        const tags = data.map((value) => value.ticker);
        if (tags.length !== STOCK_TAGS.length) {
            throw new Error('Have not all tags');
        }

        for (let tag of STOCK_TAGS) {
            if (!tags.includes(tag)) {
                throw new Error('Have not all tags');
            }
        }

        res.send(data);
        return;
    } catch (err) {
        const data = [];
        const finnhub = require('finnhub');

        const api_key = finnhub.ApiClient.instance.authentications['api_key'];
        api_key.apiKey = 'c9dfkjaad3id6u3ebci0';
        const finnhubClient = new finnhub.DefaultApi();

        for (let tag of STOCK_TAGS) {
            finnhubClient.companyProfile2({symbol: tag}, (error, data, response) => {
                fs.writeFileSync(path.join(__dirname, `../../companiesData_${tag}`), JSON.stringify(data));
            });
        }
        res.send({error: 'try again', code: 1002});
    }
});

module.exports = stocks;
