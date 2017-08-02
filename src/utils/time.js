import moment from 'moment';

export const prettyDate = (time) => {
  const now = moment();
  const date = moment(time);
  if (now.get('day') === date.get('day')) {
    return date.format('HH:mm');
  }

  if (now.diff(date, 'hours') <= 24) {
    return `${now.diff(date, 'hours')} giờ`;
  }

  if (now.get('month') === date.get('month')) {
    return `${now.diff(date, 'days')} ngày`;
  }

  if (now.get('year') === date.get('year')) {
    return date.format('DD-MM');
  }
  return date.format('DD-MM-YYYY');
};
export const formatStatus = (time) => {
  if (!time) return 'Ngoại tuyến';
  return `Lần truy cập cuối ${prettyDate(time)}`;
};

export default prettyDate;
