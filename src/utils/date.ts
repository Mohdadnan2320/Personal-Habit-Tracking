const dayjs = require('dayjs');

module.exports.todayISO = function todayISO(): string {
  return dayjs().format('YYYY-MM-DD');
};

module.exports.lastNDays = function lastNDays(n: number): string[] {
  const days: string[] = [];
  for (let i = 0; i < n; i++) {
    days.push(dayjs().subtract(i, 'day').format('YYYY-MM-DD'));
  }
  return days.reverse();
};
