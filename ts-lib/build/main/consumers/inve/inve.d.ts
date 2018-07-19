export default class INVE {
    inviteCode: string;
    static baseUrl: string;
    static commonHeader: object;
    jar: any;
    proxy: string;
    constructor(inviteCode: string);
    getData(uri: string, form?: any, method?: string): Promise<any>;
    queryUserByPhone(phone: any): Promise<any>;
    queryUserByEmail(): Promise<any>;
    register(form: object): Promise<any>;
    getPvilidCode(): Promise<any>;
    getPhoneCode(form: {
        code: any;
        phone: any;
    }): Promise<any>;
    validatePhone(): Promise<any>;
    login(username: any, password: any): Promise<void>;
    mock(): Promise<void>;
    task(task_id: any): Promise<any>;
}
