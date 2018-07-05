export default class Epnex {
    invitation: string;
    static baseUrl: string;
    static commonHeader: object;
    jar: any;
    proxy: string;
    constructor(invitation: string);
    getData(uri: string, form?: any): Promise<any>;
    register(form: object): Promise<any>;
    getEmailValidCode(PvilidCode: string): Promise<any>;
    getPvilidCode(): Promise<any>;
    validatePhone(form?: any): Promise<any>;
    login(form?: any): Promise<any>;
    task(): Promise<any>;
}
