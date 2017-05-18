export const port = 3004;
export const host = `localhost:${port}`;

export const analytics = {
  google: {
    trackingId: process.env.GOOGLE_TRACKING_ID,
  },

};

// const serverIp = 'http://api-sns.mttjsc.com';
const serverIp = 'http://server:3005';
const browserIp = 'http://api-sns.mttjsc.com';

export const server = {
  ip: serverIp,
  graphql: `${serverIp}/graphql`,
  ipBrowser: browserIp,
  graphqlBrowser: `${browserIp}/graphql`,
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
