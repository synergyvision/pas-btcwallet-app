export class AppConstants {
    /*inject-const*/
    /*endinject*/
    public static CRYPTO_API_URL = 'https://api.blockcypher.com/v1/';
    public static CRYPTO_API_TOKEN = '6947d4107df14da5899cb2f87a9bb254';
    public static CRYPTO_API_SOCKET = 'wss://socket.blockcypher.com/v1/';
    public static EXCHANGE_API_URL = 'https://cors.shapeshift.io';
    public static AUTH_SERVER_URL = 'http://192.168.1.145:3000/twofactor/';
    public static MARKET_API_URL =
    'https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,DOGE,DASH,LTC&tsyms=';
    public static firebaseConfig = {
        apiKey: 'AIzaSyBTBCJbNBmUBmKaMUK-JMFTKgY1W8H-r6w',
        authDomain: 'visionbitwallet.firebaseapp.com',
        databaseURL: 'https://visionbitwallet.firebaseio.com',
        projectId: 'visionbitwallet',
        storageBucket: 'visionbitwallet.appspot.com',
        messagingSenderId: '1069944614319',
    };
}
