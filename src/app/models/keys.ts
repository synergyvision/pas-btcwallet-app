// Object to be stored on the Firebase RealTime Database

/* Contains the Mnemonics that generate the Hex Seed used for
creating the HD Keys used by the HDWallets */

export class Keys {
    public mnemonics: string;
    public xpriv: string;
    public xpub: string;
    public seed: string;
    public passphrase?: string;

    constructor() {
        this.mnemonics = this.seed =
        this.xpriv = this.xpub = this.passphrase =
        undefined;
    }
}
