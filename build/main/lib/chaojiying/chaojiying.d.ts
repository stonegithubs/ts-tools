export default class Chaojiying {
    protected user: string;
    protected pass: string;
    static host: string;
    constructor(user: string, pass: string);
    validate(userfile: any, codetype: string, softid?: number): Promise<any>;
    getScore(): Promise<any>;
}
