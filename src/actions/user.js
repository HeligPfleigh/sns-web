import { LOGIN_SUCCESS, REMOVE_USER } from '../constants';

export function remove() {
  return {
    type: REMOVE_USER,
  };
}

export default function loginSuccess(user) {
  return {
    type: LOGIN_SUCCESS,
    user,
  };
}
