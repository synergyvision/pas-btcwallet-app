import { CryptoCoin } from './models/crypto';

// Lowest unit of Token used by default by BlockCypher

export class AppData {

    public static cryptoCurrencies = [
        { name: 'Testnet', value: 'tes' },
        { name: 'Bitcoin', value: 'btc' },
        { name: 'Dogecoin', value: 'dog' },
        { name: 'Litecoin', value: 'ltc' },
        { name: 'BlockCypher Testnet', value: 'bcy' },
        { name: 'Ethereum', value: 'eth' },
        { name: 'Ethereum Testnet', value: 'tet'},
    ];

    public static restAPIPaths = [
        { name: 'TESTNET_URL', path: 'btc/test3', crypto: 'tes'},
        { name: 'BITCOIN_URL', path: 'btc/main', crypto: 'btc'},
        { name: 'BLOCKCYPHER_TESTNET_URL', path: 'bcy/test', crypto: 'bcy'},
        { name: 'ETHER_URL', path: 'eth/main', crypto: 'eth'},
        { name: 'DOGE_URL', path: 'doge/main', crypto: 'dog'},
        { name: 'LITECOIN_URL', path: 'ltc/main', crypto: 'ltc'},
        { name: 'ETHER_TESTNET_URL', path: 'beth/test', crypto: 'tet'},
    ];

    public static cryptoUnitList = [
        new CryptoCoin(
            'Testnet',
            'tes',
            [
                { name: 'BTC', exchange: 100000000 },
                { name: 'mBTC', exchange: 100000 },
                { name: 'sat', exchange: 1 },
            ],
            100000000, 'BTC'),
        new CryptoCoin(
            'BlockCypher',
            'bcy',
            [
                { name: 'BTC', exchange: 100000000 },
                { name: 'mBTC', exchange: 100000 },
                { name: 'sat', exchange: 1 },
            ],
            100000000, 'BTC'),
        new CryptoCoin(
            'Bitcoin',
            'btc',
            [
                { name: 'BTC', exchange: 100000000 },
                { name: 'mBTC', exchange: 100000 },
                { name: 'sat', exchange: 1 },
            ],
            100000000, 'BTC'),
        new CryptoCoin(
            'DOGECOIN',
            'dog',
            [
                { name: 'DOGE', exchange: 1 },
            ],
            1, 'DOGE'),
        new CryptoCoin(
            'LiteCoin',
            'ltc',
            [
                { name: 'LTC', exchange: 100000000 },
                { name: 'lites', exchange: 1000000 },
                { name: 'photons', exchange: 1000 },
                { name: 'litoshis', exchange: 1 },
            ],
            100000000, 'LTC'),
        new CryptoCoin(
            'Ether',
            'eth',
            [
                { name: 'ether', exchange: 1000000000000000000 },
                { name: 'Gwei', exchange: 1000000000000000 },
                { name: 'Mwei', exchange: 1000000000000 },
                { name: 'Kwei', exchange: 1000000000 },
                { name: 'wei', exchange: 1 },
            ],
            1000000000000000000, 'Ether'),
        new CryptoCoin(
            'Ether Testnet',
            'tet',
            [
                { name: 'ether', exchange: 1000000000000000000 },
                { name: 'Gwei', exchange: 1000000000000000 },
                { name: 'Mwei', exchange: 1000000000000 },
                { name: 'Kwei', exchange: 1000000000 },
                { name: 'wei', exchange: 1 },
            ],
            1000000000000000000, 'Ether'),
        new CryptoCoin(
            'Dash',
            'das',
            [ {

            }]
            ,0, 'Dash'),
    ];

    public static currenciesList = [
        'USD',
        'EUR',
    ];
}
