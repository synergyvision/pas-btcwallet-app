import { Injectable } from '@angular/core';
import { Keys } from '../models/keys';
import * as bip39 from 'bip39';
import * as HDKey from 'hdkey';

@Injectable()

export class KeyService {

    public createKeys(passphrase?: string) {
        // We generate 12 random words to be used to generate the master seed
        const keys = new Keys();
        keys.passphrase = '';
        keys.mnemonics = bip39.generateMnemonic();
        // We transform the mnemonics to a HEX Seed
        keys.seed = bip39.mnemonicToSeedHex(keys.mnemonics);
        // We generate a HD Wallet Key
        const hdKey = HDKey.fromMasterSeed(keys.seed);
        keys.xpriv = hdKey.privateExtendedKey;
        keys.xpub = hdKey.publicExtendedKey;
        return keys;
    }

    public validateMnemonic(mnemonic: string) {
         // For validations, the final string must pass this
        // phrase.trim().split(/\s+/g).length >= 12¿
        return bip39.validateMnemonic(mnemonic);
    }
}
