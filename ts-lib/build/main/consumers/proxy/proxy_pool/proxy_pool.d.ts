export default class ProxyPool {
    readonly conf: {
        cwd: string;
    };
    constructor(conf?: {
        cwd: string;
    });
    crawl(): Promise<{}>;
    checker(): Promise<void>;
    doCheck(proxies: any[], round: any): Promise<number>;
    stripDuplicates(cursor?: any): Promise<any>;
    task(): Promise<void>;
}
