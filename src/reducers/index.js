import { combineReducers } from 'redux';
import user from './user';
import chat from './chat';
import runtime from './runtime';
import { reducer as reduxFormReducer } from 'redux-form';

export default function createRootReducer({ apolloClient }) {
  return combineReducers({
    form: reduxFormReducer,
    apollo: apolloClient.reducer(),
    user,
    chat,
    runtime,
  });
}
