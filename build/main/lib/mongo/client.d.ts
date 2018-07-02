export default class ClientManager {
    url: string;
    static connections: Map<string, any>;
    static closeAll(): void;
    constructor(url?: string);
    connect(): Promise<any>;
    close(): void;
    getConnection(): Promise<any>;
    getDB(dbName: string): Promise<any>;
    getCollection(dbName: string, colName: string): Promise<any>;
}
