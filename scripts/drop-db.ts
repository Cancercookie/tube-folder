import {Database} from "arangojs";
import {ArangoError} from "arangojs/error";

function dropDb() {
  const db = new Database();
  db.useBasicAuth(process.env.DEV_DB_USR, process.env.DEV_DB_USR);

  db.dropDatabase(process.env.DB_NAME).then(
      () => console.log("Database dropped, ops..."),
      (err: ArangoError) => console.error("Failed to drop database:", err.message)
  );
}

dropDb();
