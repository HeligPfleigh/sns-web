export const port = process.env.PORT || 8080;
export const host = `localhost:${port}`;
export const analytics = {
  google: {
    trackingId: process.env.GOOGLE_TRACKING_ID,
  },

};

export const server = {
  ip: process.env.APP_IP || 'http://localhost:8081',
  graphql: process.env.APP_GRAPHQL_URL || 'http://localhost:8081/graphql',
  ipBrowser: process.env.BROWSER_IP || 'http://api-sns.mttjsc.com',
  graphqlBrowser: process.env.BROWSER_GRAPHQL_URL || 'http://api-sns.mttjsc.com/graphql',
  authPath: process.env.APP_AUTH_PATH || '/auth',
};

export const auth = {
  facebook: {
    id: process.env.FACEBOOK_APP_ID || '678961598943405',
    secret: process.env.FACEBOOK_APP_SECRET || '06a4ac09ae386fa9779547a6de5c0dd3',
  },
  firebase: {
    apiKey: process.env.FIREBASE_PROJECT_APIKEY || 'AIzaSyDgbPU5DuXmvxWprMwc-HxTMae05c6rCPc',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'snschat-fb64b.firebaseapp.com',
    databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://snschat-fb64b.firebaseio.com',
    projectId: process.env.FIREBASE_PROJECT_ID || 'snschat-fb64b',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'snschat-fb64b.appspot.com',
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '1034925992768',
  },
};

