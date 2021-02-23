import {Database} from "arangojs";
import {ArangoError} from "arangojs/error";
import {COLLECTIONS} from "../app/arango-utils";

function firstInitDb() {
    let db = new Database();
    db.useBasicAuth(process.env.DEV_DB_USR, process.env.DEV_DB_PWD);

    db.createDatabase(process.env.DB_NAME).then(
        () => {
            console.log("Database created");
            db = db.database(process.env.DB_NAME);
            let usersCollection = db.collection(COLLECTIONS.Users);
            usersCollection.create().then(
                () => console.log("Users collection created"),
                (err: ArangoError) => console.error("Failed to create Users collection:", err.message)
            );

            let foldersCollection = db.collection(COLLECTIONS.Folders);
            foldersCollection.create().then(
                () => console.log("Folders collection created"),
                (err: ArangoError) => console.error("Failed to create Folders collection:", err.message)
            );
        },
        (err: ArangoError) => console.error("Failed to create database:", err.message)
    );
}

firstInitDb();