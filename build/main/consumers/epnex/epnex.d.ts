export default class Epnex {
    proxy: string;
    static baseUrl: string;
    static commonHeader: object;
    jar: any;
    constructor(proxy?: string);
    register(): boolean;
    getData(uri: string, body?: any): Promise<any>;
    getEmailValidCode(PvilidCode: string): Promise<any>;
    getPvilidCode(): Promise<any>;
    task(): Promise<any>;
}
