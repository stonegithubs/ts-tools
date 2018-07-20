export default class MongoClientManager {
    url: string;
    static connections: Map<string, any>;
    static store(dbName: any, colName: any, docs: object | object[], opts?: any, url?: string): Promise<any>;
    static closeAll(): void;
    constructor(url?: string);
    connect(): Promise<any>;
    close(): void;
    getConnection(): Promise<any>;
    getDB(dbName: string): Promise<any>;
    getCollection(dbName: string, colName: string): Promise<any>;
}
