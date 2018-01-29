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

    }
}
