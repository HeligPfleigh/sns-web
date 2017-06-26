export const port = process.env.PORT || 8080;
export const host = `localhost:${port}`;
export const analytics = {
  google: {
    trackingId: process.env.GOOGLE_TRACKING_ID,
  },

};

export const server = {
  ip: process.env.APP_IP || 'http://server:8081',
  graphql: process.env.APP_GRAPHQL_URL || 'http://server:8081/graphql',
  ipBrowser: process.env.BROWSER_IP || 'http://api-sns.mttjsc.com',
  graphqlBrowser: process.env.BROWSER_GRAPHQL_URL || 'http://api-sns.mttjsc.com/graphql',
  authPath: process.env.APP_AUTH_PATH || '/auth',
};

export const auth = {
  facebook: {
    id: process.env.FACEBOOK_APP_ID || '669818893191009',
  },
  firebase: {
    apiKey: 'AIzaSyDgbPU5DuXmvxWprMwc-HxTMae05c6rCPc',
    authDomain: 'snschat-fb64b.firebaseapp.com',
    databaseURL: 'https://snschat-fb64b.firebaseio.com',
    projectId: 'snschat-fb64b',
    storageBucket: 'snschat-fb64b.appspot.com',
    messagingSenderId: '1034925992768',
  },
};

