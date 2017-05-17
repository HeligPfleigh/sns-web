
import moment from 'moment';
import jwt from 'jsonwebtoken';
import * as admin from 'firebase-admin';
import _ from 'lodash';
import expressJwt from 'express-jwt';
import { firebaseService, auth } from './config';
import config from '../../config';

const defaultAdminApp = admin.initializeApp({
  credential: admin.credential.cert(firebaseService),
  databaseURL: config.auth.firebase.databaseURL,
});
async function verifiedChatToken(req, res) {
  try {
    const user = jwt.verify(req.cookies.id_token, auth.jwt.secret);
    if (user && user.chatToken && user.chatExp && moment(user.chatExp).diff(new Date()) < 0) {
      const chatToken = await defaultAdminApp.auth().createCustomToken(user.chatId);
      req.user = { ...user, chatToken, chatExp: moment().add(0, 'hours').unix() };
      const expiresIn = 60 * 60 * 24 * 180;
      const token = jwt.sign(_.omit(req.user, ['exp', 'iat']), auth.jwt.secret, { expiresIn });
      res.cookie('id_token', token, { maxAge: 1000 * expiresIn });
      return req.user;
    }
  } catch (error) {
    return error;
  }
  return null;
}

export const jwtMiddleware = () => expressJwt({
  secret: auth.jwt.secret,
  credentialsRequired: false,
  getToken: req => req.cookies.id_token,
});

export const veryfiedFirebaseMiddleware = () => async (req, res, next) => {
  await verifiedChatToken(req, res);
  next();
};
