// Object to be stored on the Firebase RealTime Database

/* Contains the Mnemonics that generate the Hex Seed used for
creating the HD Keys used by the HDWallets */

export interface IKeys {
    mnemonics?: string;
    xpub?: string;
    seed?: string;
    xpriv?: string;
    passphrase?: string;
}
