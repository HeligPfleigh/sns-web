import { LOGIN_SUCCESS } from '../constants';

export default function user(state = {}, action) {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        ...action.user,
      };
    default:
      return state;
  }
}
