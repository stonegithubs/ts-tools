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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9tb25nby9jbGllbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxxQ0FBc0M7QUFDdEMsb0NBQWlDO0FBRWpDO0lBUUUsWUFBbUIsTUFBYywyQkFBMkI7UUFBekMsUUFBRyxHQUFILEdBQUcsQ0FBc0M7UUFDMUQsSUFBSSxFQUFFLFdBQVcsRUFBRSxHQUFHLGFBQWEsQ0FBQztRQUNwQyxJQUFJLEdBQUcsR0FBRyxXQUFXLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQy9CLElBQUksR0FBRyxFQUFFO1lBQ1AsT0FBTyxHQUFHLENBQUM7U0FDWjthQUFNO1lBQ0wsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1NBQ2hCO0lBQ0gsQ0FBQztJQWRELE1BQU0sQ0FBQyxRQUFRO1FBQ2IsSUFBSSxFQUFFLFdBQVcsRUFBRSxHQUFHLGFBQWEsQ0FBQztRQUNwQyxLQUFLLE1BQU0sR0FBRyxJQUFJLFdBQVcsQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUN0QyxHQUFHLElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ3BCO0lBQ0gsQ0FBQztJQVdELE9BQU87UUFDTCxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQzlCLE1BQU0sRUFBRSxXQUFXLEVBQUUsR0FBRyxhQUFhLENBQUM7WUFDdEMsTUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQztZQUNyQixNQUFNLEdBQUcsR0FBRyxXQUFXLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pDLElBQUksR0FBRyxFQUFFO2dCQUNQLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ2pCO2lCQUFNO2dCQUNMLHFCQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsRUFBRTtvQkFDckMsSUFBSSxHQUFHO3dCQUFFLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUN6QixPQUFPLENBQUMsR0FBRyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7b0JBQ2hELFdBQVcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUMzQixHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ1osQ0FBQyxDQUFDLENBQUM7YUFDSjtRQUNILENBQUMsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUVELEtBQUs7UUFDSCxhQUFhLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUM5QyxDQUFDO0lBRUQsYUFBYTtRQUNYLE9BQU8sYUFBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFFRCxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQWM7UUFDeEIsSUFBSSxHQUFHLEdBQUcsTUFBTSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDckMsT0FBTyxHQUFHLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxLQUFLLENBQUMsYUFBYSxDQUFDLE1BQWMsRUFBRSxPQUFlO1FBQ2pELElBQUksR0FBRyxHQUFHLE1BQU0sSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3JDLE9BQU8sR0FBRyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDNUMsQ0FBQzs7QUFuRE0seUJBQVcsR0FBcUIsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQURuRCxnQ0FxREMifQ==