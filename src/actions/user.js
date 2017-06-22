import { LOGIN_SUCCESS } from '../constants';

export default function loginSuccess(user) {
  return {
    type: LOGIN_SUCCESS,
    user,
  };
}
