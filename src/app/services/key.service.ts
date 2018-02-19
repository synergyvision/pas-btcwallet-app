import { Injectable } from '@angular/core';
import { Keys } from '../models/keys';
import * as bip39 from 'bip39';
import * as bip32 from 'bip32-utils';
import { ITInput, ITransaction, ITransactionSke } from '../models/ITransaction';
import { HDNode, TransactionBuilder, networks } from 'bitcoinjs-lib';

const testnet = networks.testnet;
@Injectable()

export class KeyService {

    public createKeys(crypto: string, passphrase?: string) {
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
/*         We need to add the relevant information to the toSign, signatures and signingKeys fields
        to be sent with the Transaction skeleton to BlockCypher */
        trx.pubkeys = [];
        const inputAddress = trx.tx.inputs;
        // Since we don't store private keys, we need to derive them using the path depth of the input addresses
        const signingKeys = this.derivePrivKey(keys, inputAddress);
        // We Sign and add the Public Keys to the Transaction Skeleton
        trx.signatures = trx.tosign.map((tosign, n) => {
            trx.pubkeys.push(signingKeys[n].getPublicKeyBuffer().toString('hex'));
            return signingKeys[n].sign(new Buffer(tosign, 'hex')).toDER().toString('hex');
          });
        return trx;
    }

    // Function that returns the private keys from addresses (using the depth information)
    public derivePrivKey(keys: Keys, inputAddress: ITInput[]) {
        const privKeys  = [];
        // We create an HDnode object from the private key of the user
        const hdNode = HDNode.fromBase58(keys.xpriv, testnet);
        inputAddress.forEach((address) => {
            // Since ITInput includes the hd path of the address, we can derive the private key
            const key = hdNode.derivePath(address.hd_path);
            privKeys.push(key);
        });
        // We return the array of private keys
        return privKeys;
    }

}
