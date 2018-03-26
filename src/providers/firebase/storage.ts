import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Injectable()
export class StorageProvider {

    public cameraOptions: CameraOptions;
    constructor(private camera: Camera) {
        this.cameraOptions = {
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
        };
    }

    public takeProfileImago(email): void {
        this.camera.getPicture({
            quality: 100,
            destinationType: this.camera.DestinationType.DATA_URL,
            sourceType: this.camera.PictureSourceType.CAMERA,
            encodingType: this.camera.EncodingType.PNG,
            saveToPhotoAlbum: true,
          }).then((image) => {
            this.uploadImage(image, email);
          }, (error) => {
            console.log('ERROR -> ' + JSON.stringify(error));
          });
        }

    public selectProfileImage(email) {
        this.camera.getPicture({
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            destinationType: this.camera.DestinationType.DATA_URL,
            quality: 100,
            encodingType: this.camera.EncodingType.PNG,
        })
        .then((image) => {
            this.uploadImage(image, email);
        }, (error) => {
            console.log('ERROR -> ' + JSON.stringify(error));
        });
    }

    public uploadImage(image, email: string) {
        firebase.storage().ref('/Photos/')
            .child((this.generateUUID(email)).child('myPhoto.png')
            .putString(image, 'base64', { contentType: 'image/png' })
            .then((savedPicture) => {
                const pictureURL = savedPicture.downloadURL;
                console.log(pictureURL);
                return pictureURL;
        }));
    }

    private generateUUID(email: string): any {
        const d = new Date().getTime();
        const uid = email + d;
        console.log(uid);
        return uid;
      }
}
