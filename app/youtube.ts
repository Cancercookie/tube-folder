import {flatten, pick} from "lodash";
import {google, youtube_v3} from "googleapis";
import {Router} from "express";
import Youtube = youtube_v3.Youtube;
import Schema$Channel = youtube_v3.Schema$Channel;

let youtube: Youtube = google.youtube("v3");
export let youtubeRouter = Router();

interface SubscriptionsListParameters {
    mine?: boolean;
    part?: string[];
    maxResults?: number;
}

class GetOwnChannelParameters {
    mine = true;
    part?: string[];
    maxResults = 1;
}

youtubeRouter.get("/get-subscriptions-list", async (req, res) => {
    const params = {
        ...(req.query.parameters as SubscriptionsListParameters),
        ...{
            mine: true,
            part: ["snippet"],
            maxResults: 50,
        },
    };

    return await Promise.resolve(youtube.subscriptions.list(params)).then(
        (res) => {
            console.table(
                flatten(res.data["items"]).map(({snippet}) =>
                    pick(snippet, ["title", "resourceId.channelId"])
                )
            );
        }
    );
});

export async function getUserChannel(req?, res?): Promise<Schema$Channel> {
    const params = {
        ...new GetOwnChannelParameters(),
        ...{
            part: ["id"],
        },
    };
    let [channel] = await Promise.resolve(youtube.channels.list(params)).then((res) => res.data.items);
    return channel;
}

youtubeRouter.get("/get-user-channel", (req, res) => getUserChannel(req));
