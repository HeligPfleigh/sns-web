import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import user from './user';
import chat from './chat';
import runtime from './runtime';


export default function createRootReducer({ apolloClient }) {
  return combineReducers({
    apollo: apolloClient.reducer(),
    form: formReducer,
    user,
    chat,
    runtime,
  });
}
