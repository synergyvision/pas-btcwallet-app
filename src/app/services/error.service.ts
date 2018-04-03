export class ErrorService {
    public title: string;
    public message: string;
    public subTitle: string;
    public code?: number;

    constructor(errorCode?, errorText?) {
        this.title = 'Error';
        if ((errorCode === 0) || (errorText === 'ERROR_CREATING_WALLET')) {
            this.subTitle = 'ERROR.connection_subtitle';
            this.message = 'ERROR.connection_message';
        }
        if (errorText === 'NO_WALLET') {
            this.message = 'CREATE_WALLET';
        }
        if (errorText === 'NO_WALLET_FOR_SELECTED_CRYPTO') {
            this.message = 'ERROR_no_wallet_for_crypto_message';
        }
        // HTTP Error Handler
        // Too many Requests or CORS Eror
        if (errorCode === 429) {
            this.message = 'ERROR.connection_message';
            this.subTitle = 'ERROR.connection_subtitle';
        }
        if (errorCode === 409) {
            if (errorText.error === 'Error: wallet exists') {
                this.message = 'WALLET_DUPLICATE';
            }
        }
    }
}
