export class ErrorService {
    public title: string;
    public message: string;
    public subTitle: string;
    public code?: number;

    constructor(errorCode?: number, errorText?: string) {
        this.title = 'Error';
        if ((errorCode === 0) || (errorText === 'ERROR_CREATING_WALLET')) {
            this.subTitle = 'Intente mas tarde';
            this.message = 'No se pudo establecer conexión al servidor';
        }
        if (errorText === 'SAME_USER'){
            this.subTitle = 'No se puede registar como usuario';
        }
        if (errorText === 'CAMARA_ERROR') {
            this.message = 'Debe darle permisos a la aplicación para usar la cámara';
        }
        if (errorCode === 429){
            this.message = 'El servidor se encuentra ocupado en este momento';
            this.subTitle = 'Intente mas tarde';
        }
    }
}
