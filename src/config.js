/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright � 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable max-len */

export const port = process.env.PORT || 3004;
export const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;

export const analytics = {

  // https://analytics.google.com/
  google: {
    trackingId: process.env.GOOGLE_TRACKING_ID, // UA-XXXXX-X
  },

};

export const server = {
  ip: process.env.SERVER_IP || 'http://localhost:3005',
  graphql: process.env.SERVER_IP ? `${process.env.SERVER_IP}/graphql` : 'http://localhost:3005/graphql',
  ipBrowser: process.env.SERVER_IP_BROWSER || 'http://localhost:3005',
  graphqlBrowser: process.env.SERVER_IP_BROWSER ? `${process.env.SERVER_IP_BROWSER}/graphql` : 'http://localhost:3005/graphql',
  authPath: '/auth',
};

export const auth = {
  // https://developers.facebook.com/
  facebook: {
    id: process.env.FACEBOOK_APP_ID || '678961598943405',
    secret: process.env.FACEBOOK_APP_SECRET || '06a4ac09ae386fa9779547a6de5c0dd3',
  },

  // https://cloud.google.com/console/project
  google: {
    id: process.env.GOOGLE_CLIENT_ID || '251410730550-ahcg0ou5mgfhl8hlui1urru7jn5s12km.apps.googleusercontent.com',
    secret: process.env.GOOGLE_CLIENT_SECRET || 'Y8yR9yZAhm9jQ8FKAL8QIEcd',
  },

  // https://apps.twitter.com/
  twitter: {
    key: process.env.TWITTER_CONSUMER_KEY || 'Ie20AZvLJI2lQD5Dsgxgjauns',
    secret: process.env.TWITTER_CONSUMER_SECRET || 'KTZ6cxoKnEakQCeSpZlaUCJWGAlTEBJj0y2EMkUBujA7zWSvaQ',
  },
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY || 'AIzaSyC-AodKtlF-jqrHwVZ5SfxAYlWBHEbC6Xc',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN || 'sns-chat-dev.firebaseapp.com',
    databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://sns-chat-dev.firebaseio.com',
    projectId: process.env.FIREBASE_PROJECT_ID || 'sns-chat-dev',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'sns-chat-dev.appspot.com',
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '755931811387',
  },
};
