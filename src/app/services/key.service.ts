import { Injectable } from '@angular/core';
import { IKeys } from '../models/IKeys';
import * as bip39 from 'bip39';
import * as hdKey from 'ethereumjs-wallet/hdkey';
import * as ethereumjsWallet from 'ethereumjs-wallet';
import { ITInput, ITransaction, ITransactionSke } from '../models/ITransaction';
import { ECPair, HDNode, TransactionBuilder, networks } from 'bitcoinjs-lib';

@Injectable()

export class KeyService {

    public createKeys(crypto: string, passphrase?: string) {
        const keys: IKeys = {};
        keys.mnemonics = bip39.generateMnemonic();
        keys.seed = bip39.mnemonicToSeedHex(keys.mnemonics);
        // We transform the mnemonics to a HEX Seed
        keys.passphrase = '';
        const hdKeys = HDNode.fromSeedHex(keys.seed, this.getNetwork(crypto));
        keys.xpub = hdKeys.neutered().toBase58();
        keys.xpriv = hdKeys.toBase58();
        return keys;
    }

    public validateMnemonic(mnemonic: string) {
        // For validations, the final string must pass this
        // phrase.trim().split(/\s+/g).length >= 12¿
        return bip39.validateMnemonic(mnemonic);
    }

    public signWithPrivKey(trx: ITransactionSke, keys: IKeys, crypto: string): ITransactionSke {
        /*         We need to add the relevant information to the toSign, signatures and signingKeys fields
                to be sent with the Transaction skeleton to BlockCypher */
        const inputAddress = trx.tx.inputs;
        if (crypto !== 'tet' && crypto !== 'eth') {
            const signingKeys = this.derivePrivKey(keys, inputAddress, this.getNetwork(crypto));
            // We Sign and add the Public Keys to the Transaction Skeleton
            trx.signatures = trx.tosign.map((tosign, n) => {
                trx.pubkeys.push(signingKeys[n].getPublicKeyBuffer().toString('hex'));
                return signingKeys[n].sign(new Buffer(tosign, 'hex')).toDER().toString('hex');
            });
        } else {
            const signingKeys = this.getPrivateKey(keys);
            trx.signatures = trx.tosign.map((tosign, n) => {
                return signingKeys.sign(Buffer.from(tosign, 'hex')).toDER().toString('hex');
            });
        }
        console.log(JSON.stringify(trx));
        return trx;
    }

    public generateAddress(keys: IKeys) {
        const wallet = ethereumjsWallet.fromExtendedPrivateKey(keys.xpriv);
        return wallet.getAddressString();
    }

    // Function that returns the private keys from addresses (using the depth information)
    public derivePrivKey(keys: IKeys, inputAddress: ITInput[], crypto: string): HDNode[] {
        const privKeys = [];
        // We create an HDnode object from the private key of the user
        const hdNode = HDNode.fromBase58(keys.xpriv, this.getNetwork(crypto));
        inputAddress.forEach((address) => {
            // Since ITInput includes the hd path of the address, we can derive the private key
            const key = hdNode.derivePath(address.hd_path);
            privKeys.push(key);
        });
        // We return the array of private keys
        return privKeys;
    }

    public getPrivateKey(keys): ECPair{
        return HDNode.fromBase58(keys.xpriv).keyPair;
    }

    public getWIF(keys: IKeys, crypto: string): string {
        return HDNode.fromSeedHex(keys.seed, this.getNetwork(crypto)).keyPair.toWIF();
    }

    public getNetwork(crypto: string): any {
        if (crypto === 'btc') {
            return networks.bitcoin;
        } else if (crypto === 'ltc') {
            return networks.litecoin;
        } else if ((crypto === 'bcy') || (crypto === 'test')){
            return networks.testnet;
        } else {
            // While i find the ethereum js library
            return undefined;
        }
    }

}
