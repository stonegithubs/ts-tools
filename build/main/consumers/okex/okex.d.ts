export default class Okex {
    private readonly api_key;
    private readonly secret_key;
    constructor(api_key: string, secret_key: string);
    buildSign(params?: any): string;
}
