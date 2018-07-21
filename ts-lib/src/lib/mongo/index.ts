import { MongoClient } from 'mongodb';
import { check } from '../utils';

export default class MongoClientManager{
  static connections: Map<string, any> = new Map();
  static async store(dbName, colName, docs: object | object[], opts?, url: string = 'mongodb://localhost:27017') {
    let { connections } = MongoClientManager;
    let con = connections.get(url);
    if (con) {
      return await con.db(dbName).collection(colName).insert(docs, opts);
    } else {
      let col = await new MongoClientManager(url).getCollection(dbName, colName);
      return col.insert(docs, opts);
    }
  }
  static closeAll(): void {
    let { connections } = MongoClientManager;
    for (const con of connections.values()) {
      con && con.close();
    }
  }
  constructor(public url: string = 'mongodb://localhost:27017') {
    let { connections } = MongoClientManager;
    let con = connections.get(url);
    if (con) {
      return con;
    } else {
      this.connect();
    }
  }

  connect(): Promise<any> {
    return new Promise((res, rej) => {
      const { connections } = MongoClientManager;
      const { url } = this;
      const con = connections.get(url);
      if (con) {
        return res(con);
      } else {
        MongoClient.connect(url, { useNewUrlParser: true }, (err, conn) => {
          if (err) return rej(err);
          console.log("Connected successfully to server");
          connections.set(url, conn);
          res(conn);
        });
      }
    })
  }

  close(): void {
    MongoClientManager.connections[this.url].close();
  }

  getConnection(): Promise<any> {
    return check(() => MongoClientManager.connections.get(this.url));
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