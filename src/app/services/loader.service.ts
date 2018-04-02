import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { Loading } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class LoaderService {
    public loadingSpinner: Loading;

    constructor(private loadingCtrl: LoadingController, private translate: TranslateService) {}

    public showLoader(msg: string) {
        this.loadingSpinner = this.loadingCtrl
        .create({
            content : this.translate.instant(msg),
            showBackdrop: false,
            spinner: 'crescent',
        });
        this.loadingSpinner.present();
    }

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
