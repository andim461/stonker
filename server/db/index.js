const nano = require('nano')('http://admin:admin@127.0.0.1:5984');

const connect = async () => {
    try {
        await nano.db.create('stonker-db');
    } catch (err) {
        console.log('DB exsist');
    } finally {
        return nano.db.use('stonker-db');
    }
};
module.exports = {connect};
// const util = require('util');
// const MongoClient = require('mongodb').MongoClient;

// const url = util.format(
//     'mongodb://%s:%s@%s/?replicaSet=%s&authSource=%s&ssl=true',
//     'andim',
//     'andim461',
//     ['rc1b-yqnaaf5o5yqo82p1.mdb.yandexcloud.net:27018'].join(','),
//     'rs01',
//     'stonker-db'
// );

// const options = {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     tls: true,
//     tlsCAFile: '/usr/local/share/ca-certificates/Yandex/YandexInternalRootCA.crt',
//     replicaSet: 'rs01',
//     authSource: 'stonker-db'
// };

// const db = () => {
//     MongoClient.connect(url, options, async function (err, db) {
//         console.log('connection to DB');
//         db.db('stonker-db');
//     });
// };

// module.exports = {dbConnection: dbConnect()};
