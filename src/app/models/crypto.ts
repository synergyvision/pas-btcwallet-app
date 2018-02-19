export class CryptoCoin {
    public name: string;
    public value: string;
    public units?: any;
    // Expected Input
    /*     [
        {
        name: string,
        exchange: number,
        }
    ]; */
    public difference: number;
    public coin: string;

    constructor(name: string, value: string, units, difference: number, coin: string) {
        this.name = name;
        this.value = value;
        this.units = units;
        this.difference = difference;
        this.coin = coin;
    }
}
