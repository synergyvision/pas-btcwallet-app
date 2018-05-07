import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { Loading } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable()

/*
Service for showing loaders to the user
*/
export class LoaderService {
    public loadingSpinner: Loading;

    constructor(private loadingCtrl: LoadingController, private translate: TranslateService) {}

    // Shows a loader with a message to the user
    public showLoader(msg: string) {
        this.loadingSpinner = this.loadingCtrl
        .create({
            content : this.translate.instant(msg),
            showBackdrop: false,
            spinner: 'crescent',
        });
        this.loadingSpinner.present();
    }

    public showSpinner() {
        this.loadingSpinner = this.loadingCtrl
        .create({
        });
        this.loadingSpinner.present();
    }

    // Shows a full screen loader with a message to the user
    public showFullLoader(msg: string) {
        this.loadingSpinner = this.loadingCtrl
        .create({
            content : this.translate.instant(msg),
            showBackdrop: false,
            spinner: 'crescent',
            cssClass: 'full-loader',
        });
        this.loadingSpinner.present();
    }

    public dismissLoader() {
        this.loadingSpinner.dismiss();
    }
}
