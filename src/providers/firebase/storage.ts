import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Block } from 'bitcoinjs-lib';

@Injectable()
export class StorageProvider {

    public storage;
    constructor(private camera: Camera) {
        this.storage = firebase.storage().ref();
    }

    public createProfileImage(email: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.storage.child('wallet-user.jpg')
            .getDownloadURL()
            .then((url) => {
                const xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.onload = (event) => {
                    const blob = xhr.response;
                    this.storage.child('Photos/' +  email + '/profile.jpg').put(blob)
                    .then((response) => {
                    resolve(response.downloadURL);
                });
                };
                xhr.open('GET', url);
                xhr.send();
            }).catch((error) => {
                // Handle any errors
                reject(error);
            });
        });
    }

    public takeProfileImage(email): Promise<any> {
        return this.camera.getPicture({
            quality: 50,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            saveToPhotoAlbum: true,
            sourceType : this.camera.PictureSourceType.CAMERA,
          }).then((image) => {
            return this.uploadImage(image, email);
          }, (error) => {
            return error;
          });
        }

    public selectProfileImage(email): Promise<any> {
        return this.camera.getPicture({
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            destinationType: this.camera.DestinationType.DATA_URL,
            quality: 50,
            encodingType: this.camera.EncodingType.JPEG,
        })
        .then((image) => {
            return this.uploadImage(image, email);
        }, (error) => {
           return error;
        });
    }

    public uploadImage(image, email: string): Promise<string> {
        image = 'data:image/jpeg;base64,' + image;
        return this.storage.child('Photos/' + email + '/profile.jpg')
            .putString(image, 'data_url')
            .then((savedPicture) => {
                const pictureURL = savedPicture.downloadURL;
                console.log(savedPicture);
                return pictureURL;
        }).catch((error) => {
            return (error);
        });
    }
}
