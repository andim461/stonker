const finnhub = require('finnhub');

const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = 'c9dfkjaad3id6u3ebci0';
const finnhubClient = new finnhub.DefaultApi();

finnhubClient.quote('NVDA', (error, data, response) => {
    console.log(data);
});

// const finnhub = require('finnhub');

// const api_key = finnhub.ApiClient.instance.authentications['api_key'];
// api_key.apiKey = 'c9dfkjaad3id6u3ebci0';
// const finnhubClient = new finnhub.DefaultApi();

// finnhubClient.companyProfile2({symbol: 'YNDX'}, (error, data, response) => {
//     console.log(data);
// });
