import api from './index';

export const getDashboardSummary = () => api.get('/dashboard/summary').then(res => res.data);