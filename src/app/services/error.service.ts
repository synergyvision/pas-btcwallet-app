export class ErrorService {
    public title: string;
    public message: string;
    public subTitle: string;
    public code?: number;

    constructor(errorCode?: number, errorText?) {
        this.title = 'Error';
        if ((errorCode === 0) || (errorText === 'ERROR_CREATING_WALLET')) {
            this.subTitle = 'Intente mas tarde';
            this.message = 'No se pudo establecer conexión al servidor';
        }
        if (errorText === 'SAME_USER') {
            this.message = 'No se puede registar como usuario';
        }
        if (errorText === 'CAMARA_ERROR') {
            this.message = 'Debe darle permisos a la aplicación para usar la cámara';
        }
        if (errorText === 'NO_WALLET') {
            this.message = 'CREATE_WALLET';
        }
        if (errorText === 'NO_WALLET_FOR_SELECTED_CRYPTO') {
            this.message = 'El contacto no posee una billetera en la moneda seleccionada';
        }
        // HTTP Error Handler
        // Too many Requests or CORS Eror
        if (errorCode === 429) {
            this.message = 'El servidor se encuentra ocupado en este momento';
            this.subTitle = 'Intente mas tarde';
        }
        if (errorCode === 409) {
            if (errorText.error === 'Error: wallet exists') {
                this.message = 'WALLET_DUPLICATE';
            }
        }
    }
}
