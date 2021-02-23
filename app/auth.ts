import * as path from "path";
import {google} from "googleapis";
import * as fs from "fs";
import {Router} from "express";
import {COLLECTIONS, instantiateDbHandler, IUserSchema} from "./arango-utils";
import {getUserChannel} from "./youtube";
import {ArangoError} from "arangojs/error";

export let authRouter = Router();
let db = instantiateDbHandler();

authRouter.get("/init", async function (req, res) {
    const scopes = [`https://www.googleapis.com/auth/youtube`];

    let oauth2Client = _setupOAuth();
    // grab the url that will be used for authorization
    const authorizeUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: scopes.join(" "),
    });
    return res.render("index", {authorizeUrl});
});

async function _createNewUser(credentials: any) {
    let youtubeUserInfo = await getUserChannel().then(user => user);
    let newUser: IUserSchema = {
        credentials,
        youtubeUserInfo,
        _key: youtubeUserInfo.id
    };
    return await db.collection(COLLECTIONS.Users)
        .save(newUser)
        .then((x) => {
            console.log(x);
        }, (err: ArangoError) => {
            console.log(err.message);
        });
}

authRouter.get("/callback", async function (req, res) {
    const oauth2Client = _setupOAuth();
    if (req.query.error) {
        // The user did not give us permission.
        return res.redirect("/");
    } else {
        const {tokens} = await oauth2Client.getToken(req.query.code);
        /**
         * This is one of the many ways you can configure googleapis to use authentication credentials.
         * In this method, we're setting a global reference for all APIs.  Any other API you use here, like google.drive('v3'), will now use this auth client.
         * You can also override the auth client at the service and method call levels.
         */
        google.options({auth: oauth2Client});
        oauth2Client.credentials = tokens;
        await _createNewUser(tokens);
        return res.redirect("/yt/get-subscriptions-list");
    }
});

function _setupOAuth(): any {
    /**
     * To use OAuth2 authentication, we need access to a a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI.  To get these credentials for your application, visit https://console.cloud.google.com/apis/credentials.
     */
    let keyPath = path.join(path.resolve(), "client_secret.json");

    interface ClientSecretInterface {
        client_id?: string;
        project_id?: string;
        auth_uri?: string;
        token_uri?: string;
        auth_provider_x509_cert_url?: string;
        client_secret?: string;
        redirect_uris: string[];
    }

    let keys: ClientSecretInterface = {redirect_uris: [""]};
    if (fs.existsSync(keyPath)) {
        keys = require(keyPath).web;
    }

    /**
     * Create a new OAuth2 client with the configured keys.
     */
    return new google.auth.OAuth2(
        keys.client_id,
        keys.client_secret,
        keys.redirect_uris[0]
    );
}
