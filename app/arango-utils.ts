import {Database} from "arangojs";

export enum COLLECTIONS {
  Users = "Users",
  Folders = "Folders",
}

export interface IUserSchema {
  credentials: Object;
  youtubeUserInfo: Object;
  _key: string;
}

export function instantiateDbHandler(): Database {
  let db = new Database();
  db.database(process.env.DB_NAME);
  db.useBasicAuth(process.env.DEV_DB_USR, process.env.DEV_DB_USR);
  return db;
}
