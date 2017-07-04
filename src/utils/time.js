import moment from 'moment';

export const prettyDate = (time) => {
  const now = moment(time);
  const date = moment(time);
  if (now.get('day') === date.get('day')) {
    return date.format('hh:mm a');
  }
  if (now.get('year') === date.get('year')) {
    return date.format('dd-MM');
  }
  return date.format('dd-MM-YYYY');
};
export const formatStatus = (time) => {
  if (!time) return 'Ngoại tuyến';
  return `Lần truy cập cuối ${prettyDate(time)}`;
};

export default prettyDate;
