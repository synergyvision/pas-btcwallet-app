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
           console.log(error);
           return error;
        });
    }

    public uploadImage(image, email: string): Promise<string> {
        image = 'data:image/jpeg;base64,' + image;
        const uploadTask = this.storage.child('Photos/' + email + '/profile.jpg').putString(image, 'data_url');
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused');
                break;
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running');
                break;
            }
        },
        (error) => {
            console.log('82');
            console.log(error);
            return error;
        },
        (success) => {
            const pictureURL = uploadTask.snapshot.downloadURL;
            console.log('88');
            console.log(pictureURL);
            return pictureURL;
        });
        return uploadTask;
    }
}
