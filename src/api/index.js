import store from '../store';
import authStore from '../auth/store';

const APP_TOKEN = '992E98CD-8346-4898-B51B-33CF3C839CD7';

const defaultHeaders = {
  Authorization: `Bearer ${APP_TOKEN}`,
  Accept: 'application/vnd.wallet.openapi.v1+json',
  'Content-Type': 'application/vnd.wallet.openapi.v1+json'
};

export const apiCall = (config = {}) => {
  if (!config.url) {
    console.warn('No url specified for api call');
    return;
  }

  const headers = {
    ...defaultHeaders,
    ...config.headers
  };

  if (config.secure !== false) {
    const token = authStore.getSessionToken(store.getState());
    headers.Authorization = `Bearer ${token}`;
  }

  let body = config.body;

  if (config.json) {
    body = JSON.stringify(config.json);
  }

  return fetch(config.url, {
    method: config.method || 'GET',
    headers,
    body
  })
    .then(response => {
      const status = response.status;
      if ((status >= 200 && status < 300) || status === 304)
        return response.json();

      return response.json().then(error => Promise.reject(error));
    })
    .catch(error =>
      Promise.reject({
        code: error.Error || 'TRANSPORT_ERROR',
        message: error.ErrorDescription || 'Error occured while receiving data'
      })
    );
};
