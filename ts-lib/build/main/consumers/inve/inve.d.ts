export default class INVE {
    invitation: string;
    static baseUrl: string;
    static commonHeader: object;
    jar: any;
    proxy: string;
    user_email: string;
    user_password: string;
    token: any;
    loginInfo: any;
    constructor(invitation: string);
    getData(uri: string, form?: any, method?: string): Promise<any>;
    register(form: object): Promise<any>;
    getEmailValidCode(PvilidCode: string): Promise<any>;
    getPvilidCode(): Promise<any>;
    validatePhone(form?: any): Promise<any>;
    login(user_email?: string, user_password?: string): Promise<any>;
    mockOperation(): Promise<any>;
    task(): Promise<any>;
}
