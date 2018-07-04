export default class Epnex {
    invitation: string;
    proxy: string;
    static baseUrl: string;
    static commonHeader: object;
    jar: any;
    constructor(invitation: string, proxy?: string);
    getData(uri: string, form?: any, params?: any): Promise<any>;
    register(form: object): Promise<any>;
    getEmailValidCode(PvilidCode: string): Promise<any>;
    getPvilidCode(): Promise<any>;
    validatePhone(form?: any): Promise<any>;
    login(form?: any): Promise<any>;
    task(): Promise<any>;
}
