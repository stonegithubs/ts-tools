export default class Epnex {
    invitation: string;
    proxy: string;
    static baseUrl: string;
    static commonHeader: object;
    jar: any;
    constructor(invitation: string, proxy?: string);
    getData(uri: string, form?: any): Promise<any>;
    register(form: object): Promise<any>;
    getEmailValidCode(PvilidCode: string): Promise<any>;
    getPvilidCode(): Promise<any>;
    task(): Promise<any>;
}
