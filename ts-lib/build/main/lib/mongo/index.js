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
            await con.db(dbName).collection(colName).insert(docs, opts);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL21vbmdvL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQXNDO0FBQ3RDLG9DQUFpQztBQUVqQztJQWtCRSxZQUFtQixNQUFjLDJCQUEyQjtRQUF6QyxRQUFHLEdBQUgsR0FBRyxDQUFzQztRQUMxRCxJQUFJLEVBQUUsV0FBVyxFQUFFLEdBQUcsa0JBQWtCLENBQUM7UUFDekMsSUFBSSxHQUFHLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMvQixJQUFJLEdBQUcsRUFBRTtZQUNQLE9BQU8sR0FBRyxDQUFDO1NBQ1o7YUFBTTtZQUNMLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUNoQjtJQUNILENBQUM7SUF4QkQsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxJQUF1QixFQUFFLElBQUssRUFBRSxNQUFjLDJCQUEyQjtRQUMzRyxJQUFJLEVBQUUsV0FBVyxFQUFFLEdBQUcsa0JBQWtCLENBQUM7UUFDekMsSUFBSSxHQUFHLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMvQixJQUFJLEdBQUcsRUFBRTtZQUNQLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztTQUM3RDthQUFNO1lBQ0wsSUFBSSxHQUFHLEdBQUcsTUFBTSxJQUFJLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDM0UsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztTQUMvQjtJQUNILENBQUM7SUFDRCxNQUFNLENBQUMsUUFBUTtRQUNiLElBQUksRUFBRSxXQUFXLEVBQUUsR0FBRyxrQkFBa0IsQ0FBQztRQUN6QyxLQUFLLE1BQU0sR0FBRyxJQUFJLFdBQVcsQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUN0QyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ3BCO0lBQ0gsQ0FBQztJQVdELE9BQU87UUFDTCxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQzlCLE1BQU0sRUFBRSxXQUFXLEVBQUUsR0FBRyxrQkFBa0IsQ0FBQztZQUMzQyxNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDO1lBQ3JCLE1BQU0sR0FBRyxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDakMsSUFBSSxHQUFHLEVBQUU7Z0JBQ1AsT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDakI7aUJBQU07Z0JBQ0wscUJBQVcsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsZUFBZSxFQUFFLElBQUksRUFBRSxFQUFFLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFFO29CQUNoRSxJQUFJLEdBQUc7d0JBQUUsT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0NBQWtDLENBQUMsQ0FBQztvQkFDaEQsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQzNCLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDWixDQUFDLENBQUMsQ0FBQzthQUNKO1FBQ0gsQ0FBQyxDQUFDLENBQUE7SUFDSixDQUFDO0lBRUQsS0FBSztRQUNILGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDbkQsQ0FBQztJQUVELGFBQWE7UUFDWCxPQUFPLGFBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFFRCxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQWM7UUFDeEIsSUFBSSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDckMsT0FBTyxHQUFHLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQWMsRUFBRSxPQUFlO1FBQ2pELElBQUksR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3JDLE9BQU8sR0FBRyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDNUMsQ0FBQzs7QUE3RE0sOEJBQVcsR0FBcUIsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQURuRCxxQ0FnRUMifQ==