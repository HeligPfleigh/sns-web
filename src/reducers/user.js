import { LOGIN_SUCCESS, REMOVE_USER } from '../constants';

export default function user(state = {}, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        ...action.user,
      };
    case REMOVE_USER:
      return null;
    default:
      return state;
  }
}
