import dayjs from 'dayjs';

export function isToday(date) {
  return dayjs(date).isSame(dayjs(), 'day');
}

export function formatDate(date) {
  return dayjs(date).format('MMM DD, YYYY');
}

export function getDaysSince(date) {
  return dayjs().diff(dayjs(date), 'day');
}

export function formatDateForInput(date) {
  return dayjs(date).format('YYYY-MM-DD');
}
