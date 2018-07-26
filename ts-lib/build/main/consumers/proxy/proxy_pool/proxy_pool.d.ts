export default class ProxyPool {
    readonly conf: {
        cwd: string;
    };
    constructor(conf?: {
        cwd: string;
    });
    crawl(): Promise<{}>;
    checker(queryDoc?: {}): Promise<void>;
    doCheck(proxies: any[], round: any): Promise<number>;
    stripDuplicates(cursor?: any): Promise<any>;
    checkAlive(): Promise<void>;
    task(): Promise<void>;
}
