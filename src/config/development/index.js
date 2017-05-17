export const port = 3004;
export const host = `localhost:${port}`;

export const analytics = {
  google: {
    trackingId: process.env.GOOGLE_TRACKING_ID,
  },

};

export const server = {
  ip: 'http://localhost:3005',
  graphql: 'http://localhost:3005/graphql',
  ipBrowser: 'http://localhost:3005',
  graphqlBrowser: 'http://localhost:3005/graphql',
  authPath: '/auth',
};

export const auth = {
  firebase: {
    apiKey: 'AIzaSyC-AodKtlF-jqrHwVZ5SfxAYlWBHEbC6Xc',
    authDomain: 'sns-chat-dev.firebaseapp.com',
    databaseURL: 'https://sns-chat-dev.firebaseio.com',
    projectId: 'sns-chat-dev',
    storageBucket: 'sns-chat-dev.appspot.com',
    messagingSenderId: '755931811387',
  },
};
