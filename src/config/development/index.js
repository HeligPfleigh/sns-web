export const port = 3004;
export const host = `localhost:${process.env.PORT || port}`;

export const analytics = {
  google: {
    trackingId: process.env.GOOGLE_TRACKING_ID,
  },

};

// server run dev config
// const serverIp = 'http://server:3005';
// const browserIp = 'http://api-sns.mttjsc.com';

// local run dev config
const serverIp = process.env.APP_IP || 'http://localhost:3005';
const browserIp = 'http://localhost:3005';

export const server = {
  ip: serverIp,
  graphql: `${serverIp}/graphql`,
  ipBrowser: browserIp,
  graphqlBrowser: `${browserIp}/graphql`,
  authPath: '/auth',
};

export const auth = {
  facebook: {
    id: process.env.FACEBOOK_APP_ID || '678961598943405',
  },
  firebase: {
    apiKey: 'AIzaSyC-AodKtlF-jqrHwVZ5SfxAYlWBHEbC6Xc',
    authDomain: 'sns-chat-dev.firebaseapp.com',
    databaseURL: 'https://sns-chat-dev.firebaseio.com',
    projectId: 'sns-chat-dev',
    storageBucket: 'sns-chat-dev.appspot.com',
    messagingSenderId: '755931811387',
  },
};
