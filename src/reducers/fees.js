import { LOAD_FEE } from '../constants';

export const loadFee = data => ({ type: LOAD_FEE, data });

export default function feeDetail(state = {}, action) {
  switch (action.type) {
    case LOAD_FEE:
      return {
        feeDetail: action.data,
      };
    default:
      return state;
  }
}
