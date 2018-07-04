"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const utils_1 = require("../utils");
class ClientManager {
    constructor(url = 'mongodb://localhost:27017') {
        this.url = url;
        let { connections } = ClientManager;
        let con = connections.get(url);
        if (con) {
            return con;
        }
        else {
            this.connect();
        }
    }
    static closeAll() {
        let { connections } = ClientManager;
        for (const con of connections.values()) {
            con && con.close();
        }
    }
    connect() {
        return new Promise((res, rej) => {
            const { connections } = ClientManager;
            const { url } = this;
            const con = connections.get(url);
            if (con) {
                return res(con);
            }
            else {
                mongodb_1.MongoClient.connect(url, (err, conn) => {
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
        ClientManager.connections[this.url].close();
    }
    getConnection() {
        return utils_1.check(() => ClientManager.connections.get(this.url));
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
ClientManager.connections = new Map();
exports.default = ClientManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvbGliL21vbmdvL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscUNBQXNDO0FBQ3RDLG9DQUFpQztBQUVqQztJQVFFLFlBQW1CLE1BQWMsMkJBQTJCO1FBQXpDLFFBQUcsR0FBSCxHQUFHLENBQXNDO1FBQzFELElBQUksRUFBRSxXQUFXLEVBQUUsR0FBRyxhQUFhLENBQUM7UUFDcEMsSUFBSSxHQUFHLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMvQixJQUFJLEdBQUcsRUFBRTtZQUNQLE9BQU8sR0FBRyxDQUFDO1NBQ1o7YUFBTTtZQUNMLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztTQUNoQjtJQUNILENBQUM7SUFkRCxNQUFNLENBQUMsUUFBUTtRQUNiLElBQUksRUFBRSxXQUFXLEVBQUUsR0FBRyxhQUFhLENBQUM7UUFDcEMsS0FBSyxNQUFNLEdBQUcsSUFBSSxXQUFXLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDdEMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUNwQjtJQUNILENBQUM7SUFXRCxPQUFPO1FBQ0wsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUM5QixNQUFNLEVBQUUsV0FBVyxFQUFFLEdBQUcsYUFBYSxDQUFDO1lBQ3RDLE1BQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUM7WUFDckIsTUFBTSxHQUFHLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNqQyxJQUFJLEdBQUcsRUFBRTtnQkFDUCxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNqQjtpQkFBTTtnQkFDTCxxQkFBVyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUU7b0JBQ3JDLElBQUksR0FBRzt3QkFBRSxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDekIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO29CQUNoRCxXQUFXLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDM0IsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNaLENBQUMsQ0FBQyxDQUFDO2FBQ0o7UUFDSCxDQUFDLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFFRCxLQUFLO1FBQ0gsYUFBYSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDOUMsQ0FBQztJQUVELGFBQWE7UUFDWCxPQUFPLGFBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBRUQsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFjO1FBQ3hCLElBQUksR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3JDLE9BQU8sR0FBRyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN4QixDQUFDO0lBRUQsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFjLEVBQUUsT0FBZTtRQUNqRCxJQUFJLEdBQUcsR0FBRyxNQUFNLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUNyQyxPQUFPLEdBQUcsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzVDLENBQUM7O0FBbkRNLHlCQUFXLEdBQXFCLElBQUksR0FBRyxFQUFFLENBQUM7QUFEbkQsZ0NBcURDIn0=