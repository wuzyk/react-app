import { apiCall } from 'api';

export const fetchProfile = userId =>
  apiCall({
    url: `/OpenApi/profile?userId=${userId}`
  });
