import { Injectable } from '@angular/core';
import { Keys } from '../models/keys';
import * as bip39 from 'bip39';
import { ITransactionSke } from '../models/ITransaction';
import { HDNode, TransactionBuilder, networks } from 'bitcoinjs-lib';

const testnet = networks.testnet;
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
        const hdKeys = HDNode.fromSeedHex(keys.seed, testnet);
        keys.xpub = hdKeys.neutered().toBase58();
        keys.xpriv = hdKeys.toBase58();
        console.log(keys);
        return keys;
    }

    public validateMnemonic(mnemonic: string) {
         // For validations, the final string must pass this
        // phrase.trim().split(/\s+/g).length >= 12¿
        return bip39.validateMnemonic(mnemonic);
    }

    public signWithPrivKey(trx: ITransactionSke, keys: Keys): ITransactionSke {
        trx.pubkeys = [];
        const signingKeys = HDNode.fromBase58(keys.xpriv, testnet).keyPair;
        trx.signatures = trx.tosign.map((tosign, n) => {
            trx.pubkeys.push(signingKeys.getPublicKeyBuffer().toString('hex'));
            return signingKeys.sign(new Buffer(tosign, 'hex')).toDER().toString('hex');
          });
        console.log(trx);
        return trx;
    }

}
