export default class ProxyPool {
    readonly conf: {
        cwd: string;
    };
    constructor(conf?: {
        cwd: string;
    });
    crawl(): Promise<{}>;
    checker(): Promise<void>;
    doCheck(proxies?: any[]): Promise<number>;
    task(): Promise<void>;
}
