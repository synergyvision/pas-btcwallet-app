import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { Loading } from 'ionic-angular';

@Injectable()
export class LoaderService {
    public loadingSpinner: Loading;

    constructor(private loadingCtrl: LoadingController) {}

    public showLoader(msg: string) {
        this.loadingSpinner = this.loadingCtrl.create({content : msg});
        this.loadingSpinner.present();
    }

    public dismissLoader() {
        this.loadingSpinner.dismissAll();
    }
}
