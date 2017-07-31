import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import user from './user';
import me from './me';
import chat from './chat';
import runtime from './runtime';
import alert from './alert';

export default function createRootReducer({ apolloClient }) {
  return combineReducers({
    apollo: apolloClient.reducer(),
    form: formReducer,
    user,
    me,
    chat,
    runtime,
    alert,
  });
}
