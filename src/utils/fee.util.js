import { PAID, UNPAID } from '../constants';

// eslint-disable-next-line
export const convertStatus = (status) => {
  switch (status) {
    case PAID:
      return 'Đã thanh toán';
    case UNPAID:
      return 'Chưa thanh toán';
    default:
      return 'Chưa thanh toán hết';
  }
};
