/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import 'isomorphic-fetch';
import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import compression from 'compression';
import expressJwt from 'express-jwt';
import jwt from 'jsonwebtoken';
import React from 'react';
import ReactDOM from 'react-dom/server';
import { renderToStringWithData } from 'react-apollo';
import UniversalRouter from 'universal-router';
import PrettyError from 'pretty-error';
import createApolloClient from './core/createApolloClient';
import App from './components/App';
import Html from './components/Html';
import { ErrorPageWithoutStyle } from './routes/error/ErrorPage';
import errorPageStyle from './routes/error/ErrorPage.css';
import passport, { verifiedChatToken } from './core/passport';
// import schema from './data/schema';
import routes from './routes';
import assets from './assets.json'; // eslint-disable-line import/no-unresolved
import configureStore from './store/configureStore';
import { setRuntimeVariable } from './actions/runtime';
import { port, auth, databaseUrl } from './config';
import Mongoose from './data/mongoose';
import chat from './core/chat';

// Create connect database
Mongoose.connect(databaseUrl, {});

const app = express();

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(compression());
if (__DEV__) {
  app.use(express.static(path.join(__dirname, 'public')));
} else {
  const oneDay = 86400000; // in milliseconds
  app.use(express.static(path.join(__dirname, 'public'), {
    etag: true,
    maxage: oneDay,
  }));
}
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//
// Authentication
// -----------------------------------------------------------------------------
app.use(expressJwt({
  secret: auth.jwt.secret,
  credentialsRequired: false,
  getToken: req => req.cookies.id_token,
}));
app.use(passport.initialize());

if (__DEV__) {
  app.enable('trust proxy');
}
app.get('/login/facebook',
  passport.authenticate('facebook', { scope: ['email', 'user_location'], session: false }),
);
app.get('/login/facebook/return',
  passport.authenticate('facebook', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const expiresIn = 60 * 60 * 24 * 180;
    const token = jwt.sign(req.user, auth.jwt.secret, { expiresIn });
    res.cookie('id_token', token, { maxAge: 1000 * expiresIn });
    res.redirect('/');
  },
);

app.get('/logout', (req, res) => {
// app.post('/logout', (req, res) => {
  res.clearCookie('id_token');
  res.redirect('/');
});

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req, res, next) => {
  try {
    await verifiedChatToken(req, res);
    const apolloClient = createApolloClient({
      rootValue: { request: req },
    });

    const store = configureStore({
      user: req.user || null,
    }, {
      cookie: req.headers.cookie,
      apolloClient,
      chat,
    });

    store.dispatch(setRuntimeVariable({
      name: 'initialNow',
      value: Date.now(),
    }));

    const css = new Set();

    // Global (context) variables that can be easily accessed from any React component
    // https://facebook.github.io/react/docs/context.html
    const context = {
      // Enables critical path CSS rendering
      // https://github.com/kriasoft/isomorphic-style-loader
      insertCss: (...styles) => {
        // eslint-disable-next-line no-underscore-dangle
        styles.forEach(style => css.add(style._getCss()));
      },
      // Initialize a new Redux store
      // http://redux.js.org/docs/basics/UsageWithReact.html
      store,
      // Apollo Client for use with react-apollo
      client: apolloClient,
      chat,
    };

    const route = await UniversalRouter.resolve(routes, {
      ...context,
      path: req.path,
      query: req.query,
    });

    if (route.redirect) {
      res.redirect(route.status || 302, route.redirect);
      return;
    }

    const data = { ...route };

    data.children = await renderToStringWithData(<App context={context}>{route.component}</App>);
    data.styles = [
      { id: 'css', cssText: [...css].join('') },
    ];
    data.scripts = [
      assets.vendor.js,
      assets.client.js,
    ];
    if (assets.vendor.css) {
      data.cssVendors = [assets.vendor.css];
    }

    // Furthermore invoked actions will be ignored, client will not receive them!
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.log('Serializing store...');
    }
    data.state = context.store.getState();

    if (assets[route.chunk]) {
      data.scripts.push(assets[route.chunk].js);
    }

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
    res.status(route.status || 200);
    res.send(`<!doctype html>${html}`);
  } catch (err) {
    next(err);
  }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.log(pe.render(err)); // eslint-disable-line no-console
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      styles={[{ id: 'css', cssText: errorPageStyle._getCss() }]} // eslint-disable-line no-underscore-dangle
    >
      {ReactDOM.renderToString(<ErrorPageWithoutStyle error={err} />)}
    </Html>,
  );
  res.status(err.status || 500);
  res.send(`<!doctype html>${html}`);
});

//
// Launch the server
// -----------------------------------------------------------------------------
/* eslint-disable no-console */
app.listen(port, () => {
  console.log(`The server is running at http://localhost:${port}/`);
});
/* eslint-enable no-console */
