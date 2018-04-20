export const port = process.env.PORT || 8080;
export const host = `localhost:${port}`;
export const analytics = {
  google: {
    trackingId: process.env.GOOGLE_TRACKING_ID,
  },

};

const serverIp = process.env.APP_IP || 'http://backend:3005';
const authPath = process.env.APP_AUTH_PATH || '/auth';

// local run local production config
// const ipBrowser = process.env.BROWSER_IP || 'http://localhost:8081';

// local run server production config
const ipBrowser = process.env.BROWSER_IP || 'https://api-sns.mttjsc.com';

export const server = {
  // internal url
  ip: serverIp,
  graphql: `${serverIp}/graphql`,

  // proxy path
  authPath,

  // public url
  ipBrowser,
  graphqlBrowser: `${ipBrowser}/graphql`,

  // parent path upload images url
  imageUpload: `${ipBrowser}/upload/image`,
  documentUpload: `${ipBrowser}/upload/document`,
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

