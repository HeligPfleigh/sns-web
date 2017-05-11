/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright � 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable max-len */

export const port = 3004;
export const host = `localhost:${port}`;

export const analytics = {

  // https://analytics.google.com/
  google: {
    trackingId: process.env.GOOGLE_TRACKING_ID, // UA-XXXXX-X
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
  // https://developers.facebook.com/
  facebook: {
    id: '678961598943405',
    secret: '06a4ac09ae386fa9779547a6de5c0dd3',
  },

  // https://cloud.google.com/console/project
  google: {
    id: '251410730550-ahcg0ou5mgfhl8hlui1urru7jn5s12km.apps.googleusercontent.com',
    secret: 'Y8yR9yZAhm9jQ8FKAL8QIEcd',
  },

  // https://apps.twitter.com/
  twitter: {
    key: 'Ie20AZvLJI2lQD5Dsgxgjauns',
    secret: 'KTZ6cxoKnEakQCeSpZlaUCJWGAlTEBJj0y2EMkUBujA7zWSvaQ',
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
