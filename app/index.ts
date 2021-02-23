import express from "express";

import {authRouter} from "./auth";
import {youtubeRouter} from "./youtube";

export const app: express.Application = express();
app.set('view engine', 'ejs');
app.set('views', __dirname);

app.use('/auth', authRouter);
app.use('/yt', youtubeRouter);

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

