import { CryptoCoin } from './models/crypto';
import { Activity } from './models/activity';

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
                { name: 'DOGE', exchange: 100000000 },
                { name: 'koinus', exchange: 1 },
            ],
            100000000, 'DOGE'),
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
            [
                { name: 'DASH', exchange: 100000000 },
            ],
            100000000, 'Dash'),
    ];

    public static currenciesList = [
        'USD',
        'EUR',
    ];

    public static exchangePairs = [
        { crypto: 'btc', name: 'btc'},
        { crypto: 'ltc', name: 'ltc'},
        { crypto: 'dog', name: 'doge'},
        { crypto: 'eth', name: 'eth'},
        { crypto: 'das', name: 'dash'},
    ];

    public static activityList = [
        new Activity(1, '12/12/2017', 'Acceso desde dispositivo Android NG-7800'),
        new Activity(2, '06/11/2017', 'Cambio de clave'),
        new Activity(3, '05/04/2017', 'Se agregaron 00,156 BTC a la billetera'),
        new Activity(4, '28/03/2017', 'Se agregaron 00,23 BTC a la billetera'),
        new Activity(5, '14/01/2017', 'Cambio de clave'),
        new Activity(6, '28/12/2016', 'Acceso desde dispositivo iPhone 6c'),
      ];
}
