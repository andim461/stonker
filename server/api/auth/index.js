const express = require('express');
const auth = express.Router();
const {connect: dbConnect} = require('../../db');
const {v4: uuid} = require('uuid');
const jwt = require('jsonwebtoken');
const {SECRET_JWT} = require('../../constants');
const bcrypt = require('bcryptjs');

auth.post('/signin', async (req, res) => {
    const db = await dbConnect();

    if (!req.body.login || !req.body.password) {
        res.sendStatus(402);
        return;
    }

    // проверка на существование логина
    const documents = await db.find({selector: {login: {$eq: req.body.login}}});

    if (!documents.docs.length) {
        res.sendStatus(403);
        return;
    }

    const doc = documents.docs[0];
    if (bcrypt.compareSync(doc.password, req.body.password)) {
        res.sendStatus(403);
        return;
    }

    const token = jwt.sign({_id: doc._id, login: req.body.login}, SECRET_JWT);

    await db.insert({...doc, token});

    res.send({token, login: req.body.login, _id: doc._id, balance: doc.balance, stocks: doc.stocks});
});

/* 
    req.body = {
        login: string;
        password: string;
    }
*/

auth.post('/signup', async (req, res) => {
    const db = await dbConnect();

    // Валидацию?
    if (!req.body.login || !req.body.password) {
        res.sendStatus(402);
        return;
    }

    // проверка на существование логина
    const hasDocument = (await db.find({selector: {login: {$eq: req.body.login}}})).docs.length > 0;

    if (hasDocument) {
        res.sendStatus(403);
        return;
    }
    const _id = uuid();
    const token = jwt.sign({_id, login: req.body.login}, SECRET_JWT);
    await db.insert({
        _id,
        login: req.body.login,
        password: bcrypt.hashSync(req.body.password, 10),
        token,
        balance: 100_000,
        stocks: {}
    });

    res.send({token, login: req.body.login, _id, balance: 100_000, stocks: {}});
});

module.exports = auth;
