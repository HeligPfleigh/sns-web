import { LOAD_PROFILE } from '../constants';

export const loadProfile = data => ({ type: LOAD_PROFILE, data });

export default function profile(state = {}, action) {
  switch (action.type) {
    case LOAD_PROFILE:
      return {
        profile: action.data,
      };
    default:
      return state;
  }
}
