import { Injectable } from '@angular/core';
import { IKeys } from '../models/IKeys';
import * as bip39 from 'bip39';
import * as hdKey from 'ethereumjs-wallet/hdkey';
import * as ethereumjsWallet from 'ethereumjs-wallet';
import { ECPair, HDNode, TransactionBuilder, networks } from 'bitcoinjs-lib';
import { ISigner } from '../models/multisignedWallet';
import { ITransactionSke } from '../interfaces/ITransactionSke';
import { ITInput } from '../interfaces/ITInput';

@Injectable()

/*
Service for handling the cryptographic functions, such as creating private keys, signing and deriving
addresses and public keys
*/

export class KeyService {

    // Creates the Keys for an HD Wallet
    public createKeys(crypto: string, passphrase?: string) {
        const keys: IKeys = {};
        keys.mnemonics = bip39.generateMnemonic();
        /*
        Mnemonics are 12 random words that can be converted to a Hex Seed
        The seed is then hashed with the Passphrase to create the Extended Private Key
        */
        keys.seed = bip39.mnemonicToSeedHex(keys.mnemonics, passphrase);
        keys.passphrase = passphrase || '';
        // the HDNode is an interface from the bitcoinjs lib that can sign and validate data
        const hdKeys = HDNode.fromSeedHex(keys.seed, this.getNetwork(crypto));
        keys.xpub = hdKeys.neutered().toBase58();
        keys.xpriv = hdKeys.toBase58();
        return keys;
    }

    // Creates the Keys for multiple signers of a MultiSigned Address
    public createMultiSignedKeys(users: number, crypto: string): IKeys[] {
        const keys: IKeys[] = [];
        let key: IKeys = {};
        while ( users > 0 ) {
            key = this.createKeys(crypto);
            key.xpriv = '';
            key.xpub = HDNode.fromSeedHex(key.seed).keyPair.getPublicKeyBuffer().toString('hex');
            keys.push(key);
            users --;
        }
        return keys;
    }

    public validateMnemonic(mnemonic: string) {
        // For other validations, the final string must pass this
        // phrase.trim().split(/\s+/g).length >= 12¿
        return bip39.validateMnemonic(mnemonic);
    }

    public signTransaction(trx: ITransactionSke, keys: IKeys, crypto: string): ITransactionSke {
        /*  We need to add the relevant information to the toSign, signatures and signingKeys fields
        to be sent with the Transaction skeleton to BlockCypher */
        // If it is an HD Wallet
        if (crypto !== 'tet' && crypto !== 'eth') {
            return this.signWithDerivedPrivateKey(trx, keys, crypto);
        // If is an Ethereum or Ethereum Testnet Address
        } else {
           return this.signWithPrivateKey(trx, keys, crypto);
        }
    }

    public signWithDerivedPrivateKey(trx: ITransactionSke, keys: IKeys, crypto: string) {
        // We need to derive the xpriv key to the latest path to have the private and public key needed
        const inputAddress = trx.tx.inputs;
        const signingKeys = this.derivePrivKey(keys, inputAddress, crypto);
        trx.pubkeys = [];
        // We Sign and add the Public Keys to the Transaction Skeleton
        trx.signatures = trx.tosign.map((tosign, n) => {
            trx.pubkeys.push(signingKeys[n].getPublicKeyBuffer().toString('hex'));
            return signingKeys[n].sign(new Buffer(tosign, 'hex')).toDER().toString('hex');
        });
        return trx;
    }

    public signWithPrivateKey(trx: ITransactionSke, keys: IKeys, crypto: string) {
        const signingKeys = this.getPrivateKey(keys, crypto);
        // We Sign and add the Public Keys to the Transaction Skeleton
        trx.signatures = trx.tosign.map((tosign, n) => {
            return signingKeys.sign(Buffer.from(tosign, 'hex')).toDER().toString('hex');
        });
        return trx;
    }

    public generateAddress(keys: IKeys) {
        // Generates the Ethereum and Testnet Ethereum address
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

    public getPrivateKey(keys: IKeys, crypto: string): ECPair {
        // Return the private keys of MultiSigned, Ethereum and Testnet Ethereum
        return HDNode.fromSeedHex(keys.seed, this.getNetwork(crypto)).keyPair;
    }

    public getWIF(keys: IKeys, crypto: string): string {
        // Returns the WIF of the wallet
        return HDNode.fromSeedHex(keys.seed, this.getNetwork(crypto)).keyPair.toWIF();
    }

    public getNetwork(crypto: string): any {
        if (crypto === 'btc') {
            return networks.bitcoin;
        } else if (crypto === 'ltc') {
            return networks.litecoin;
        } else if ((crypto === 'bcy') || (crypto === 'test')) {
            return networks.testnet;
        } else {
            return undefined;
        }
    }
}
