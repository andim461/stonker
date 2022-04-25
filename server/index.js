const path = require('path');
const express = require('express');
const apiRouter = require('./api');
const bodyParser = require('body-parser');
const util = require('util');
const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;

// couch.createDatabase('stonker-db').then(() => console.log('DB CREATED'));
// couch.insert('stonker-db', {_id: '1233', lol: 'kek'});

// couch.get('stonker-db', '1233').then(({data, headers, status}) => console.log(data));

const app = express();
const port = 3000;

app.use(
    bodyParser.json({
        type: ['application/json', 'text/plain']
    })
);
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + './../dist'));

app.use('/', (_, res) => {
    res.sendFile(path.resolve(__dirname));
});

app.use('/api', apiRouter);

app.listen(process.env.PORT || port);
// const url = util.format(
//     'mongodb://%s:%s@%s/?replicaSet=%s&authSource=%s&ssl=true',
//     'user',
//     'andim461',
//     ['rc1b-2u3clkkk9njqbpej.mdb.yandexcloud.net:27018'].join(','),
//     'rs01',
//     'db'
// );
// console.log(url);
// const options = {
//     useNewUrlParser: true,
//     replicaSet: {
//         sslCA: fs.readFileSync('/usr/local/share/ca-certificates/Yandex/YandexInternalRootCA.crt').toString()
//     }
// };
// MongoClient.connect(url, options, function (err, db) {
//     console.log(err);
//     console.log(db);
// });
