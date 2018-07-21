"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const utils_1 = require("../utils");
class MongoClientManager {
    constructor(url = 'mongodb://localhost:27017') {
        this.url = url;
        let { connections } = MongoClientManager;
        let con = connections.get(url);
        if (con) {
            return con;
        }
        else {
            this.connect();
        }
    }
    static async store(dbName, colName, docs, opts, url = 'mongodb://localhost:27017') {
        let { connections } = MongoClientManager;
        let con = connections.get(url);
        if (con) {
            return await con.db(dbName).collection(colName).insert(docs, opts);
        }
        else {
            let col = await new MongoClientManager(url).getCollection(dbName, colName);
            return col.insert(docs, opts);
        }
    }
    static closeAll() {
        let { connections } = MongoClientManager;
        for (const con of connections.values()) {
            con && con.close();
        }
    }
    connect() {
        return new Promise((res, rej) => {
            const { connections } = MongoClientManager;
            const { url } = this;
            const con = connections.get(url);
            if (con) {
                return res(con);
            }
            else {
                mongodb_1.MongoClient.connect(url, { useNewUrlParser: true }, (err, conn) => {
                    if (err)
                        return rej(err);
                    console.log("Connected successfully to server");
                    connections.set(url, conn);
                    res(conn);
                });
            }
        });
    }
    close() {
        MongoClientManager.connections[this.url].close();
    }
    getConnection() {
        return utils_1.check(() => MongoClientManager.connections.get(this.url));
    }
    async getDB(dbName) {
        let con = await this.getConnection();
        return con.db(dbName);
    }
    async getCollection(dbName, colName) {
        let con = await this.getConnection();
        return con.db(dbName).collection(colName);
    }
}
MongoClientManager.connections = new Map();
exports.default = MongoClientManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL21vbmdvL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQXNDO0FBQ3RDLG9DQUFpQztBQUVqQztJQWtCRSxZQUFtQixNQUFjLDJCQUEyQjtRQUF6QyxRQUFHLEdBQUgsR0FBRyxDQUFzQztRQUMxRCxJQUFJLEVBQUUsV0FBVyxFQUFFLEdBQUcsa0JBQWtCLENBQUM7UUFDekMsSUFBSSxHQUFHLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMvQixJQUFJLEdBQUcsRUFBRTtZQUNQLE9BQU8sR0FBRyxDQUFDO1NBQ1o7YUFBTTtZQUNMLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUNoQjtJQUNILENBQUM7SUF4QkQsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUF1QixFQUFFLElBQUssRUFBRSxNQUFjLDJCQUEyQjtRQUMzRyxJQUFJLEVBQUUsV0FBVyxFQUFFLEdBQUcsa0JBQWtCLENBQUM7UUFDekMsSUFBSSxHQUFHLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMvQixJQUFJLEdBQUcsRUFBRTtZQUNQLE9BQU8sTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ3BFO2FBQU07WUFDTCxJQUFJLEdBQUcsR0FBRyxNQUFNLElBQUksa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztZQUMzRSxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQy9CO0lBQ0gsQ0FBQztJQUNELE1BQU0sQ0FBQyxRQUFRO1FBQ2IsSUFBSSxFQUFFLFdBQVcsRUFBRSxHQUFHLGtCQUFrQixDQUFDO1FBQ3pDLEtBQUssTUFBTSxHQUFHLElBQUksV0FBVyxDQUFDLE1BQU0sRUFBRSxFQUFFO1lBQ3RDLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDcEI7SUFDSCxDQUFDO0lBV0QsT0FBTztRQUNMLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7WUFDOUIsTUFBTSxFQUFFLFdBQVcsRUFBRSxHQUFHLGtCQUFrQixDQUFDO1lBQzNDLE1BQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUM7WUFDckIsTUFBTSxHQUFHLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNqQyxJQUFJLEdBQUcsRUFBRTtnQkFDUCxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNqQjtpQkFBTTtnQkFDTCxxQkFBVyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUU7b0JBQ2hFLElBQUksR0FBRzt3QkFBRSxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDekIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO29CQUNoRCxXQUFXLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDM0IsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNaLENBQUMsQ0FBQyxDQUFDO2FBQ0o7UUFDSCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFFRCxLQUFLO1FBQ0gsa0JBQWtCLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNuRCxDQUFDO0lBRUQsYUFBYTtRQUNYLE9BQU8sYUFBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUVELEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBYztRQUN4QixJQUFJLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUNyQyxPQUFPLEdBQUcsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDeEIsQ0FBQztJQUVELEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBYyxFQUFFLE9BQWU7UUFDakQsSUFBSSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDckMsT0FBTyxHQUFHLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM1QyxDQUFDOztBQTdETSw4QkFBVyxHQUFxQixJQUFJLEdBQUcsRUFBRSxDQUFDO0FBRG5ELHFDQWdFQyJ9