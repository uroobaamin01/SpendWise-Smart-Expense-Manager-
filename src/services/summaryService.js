import api, { unwrap } from './api';

export const summaryService = {
  /** Income / expense totals for the `months` months ending at `end` (YYYY-MM). */
  getMonthlySeries: ({ months = 6, end } = {}) => unwrap(api.get('/summary/monthly', { params: { months, end } })),
};
