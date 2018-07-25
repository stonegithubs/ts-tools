export default class ProxyPoll {
    readonly conf: {
        cwd: string;
    };
    constructor(conf?: {
        cwd: string;
    });
    task(): void;
    checker(): Promise<void>;
}
