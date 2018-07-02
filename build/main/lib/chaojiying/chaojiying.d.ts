export default class Chaojiying {
    protected user: string;
    protected pass: string;
    protected softid?: string;
    static host: string;
    constructor(user: string, pass: string, softid?: string);
    validate(userfile: any, codetype: string, softId?: string): Promise<any>;
    getScore(): Promise<any>;
}
