import { OPEN_ALERT_GLOBAL } from '../constants';

export const openAlertGlobal = data => ({ type: OPEN_ALERT_GLOBAL, data });

export default function alert(state = {
  message: '',
  open: false,
  autoHideDuration: 0, // 0 is not auto hide
}, action) {
  switch (action.type) {
    case OPEN_ALERT_GLOBAL:
      return {
        ...state,
        ...action.data,
      };
    default:
      return state;
  }
}
