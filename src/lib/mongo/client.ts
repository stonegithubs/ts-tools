import { MongoClient } from 'mongodb';
import { check } from '../utils';

export default class ClientManager{
  static connections: Map<string, any> = new Map();
  static closeAll(): void {
    let { connections } = ClientManager;
    for (const con of connections.values()) {
      con && con.close();
    }
  }
  constructor(public url: string = 'mongodb://localhost:27017') {
    let { connections } = ClientManager;
    let con = connections.get(url);
    if (con) {
      return con;
    } else {
      this.connect();
    }
  }

  connect(): Promise<any> {
    return new Promise((res, rej) => {
      const { connections } = ClientManager;
      const { url } = this;
      const con = connections.get(url);
      if (con) {
        return res(con);
      } else {
        MongoClient.connect(url, (err, conn) => {
          if (err) return rej(err);
          console.log("Connected successfully to server");
          connections.set(url, conn);
          res(conn);
        });
      }
    })
  }

  close(): void {
    ClientManager.connections[this.url].close();
  }

  getConnection(): Promise<any> {
    return check(() => ClientManager.connections.get(this.url));
  }

  async getDB(dbName: string): Promise<any> {
    let con = await this.getConnection();
    return con.db(dbName);
  }

  async getCollection(dbName: string, colName: string): Promise<any> {
    let con = await this.getConnection();
    return con.db(dbName).collection(colName);
  }
}