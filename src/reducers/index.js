import { combineReducers } from 'redux';
import { reducer as reduxFormReducer } from 'redux-form';
import user from './user';
import chat from './chat';
import runtime from './runtime';


export default function createRootReducer({ apolloClient }) {
  return combineReducers({
    form: reduxFormReducer,
    apollo: apolloClient.reducer(),
    user,
    chat,
    runtime,
  });
}
