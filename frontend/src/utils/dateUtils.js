import dayjs from 'dayjs';

export function isToday(date) {
  return dayjs(date).isSame(dayjs(), 'day');
}
