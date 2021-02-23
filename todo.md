# TODO List:

- write unit tests
- implement persistence with arangodb (start with user token)
- move the client_secret
- setup git repo
- make server listen for client calls (express??)
- make api calls
- develop client (vue.js?)
- cleanup node_modules
- use typescript for BE

### User ->* Folder ->* Subscriptions Flow

- User should create Folders
- User should add Subscription to Folders
- User should open Folders containing the same feed as YouTube's, but the query only fetches the video from those
  SubscriberIds

# Further developments:

- If a User unsubscribe from a Channel the channel must be removed from the Folders
- Use docker to scale
- Deploy on AWS to public
- Develop Chrome extension to inject DOM nodes into YT interface