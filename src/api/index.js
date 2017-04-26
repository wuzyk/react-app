let _token;

const defaultHeaders = {
  Authorization: `Bearer 992E98CD-8346-4898-B51B-33CF3C839CD7`,
  Accept: 'application/vnd.wallet.openapi.v1+json',
  'Content-Type': 'application/vnd.wallet.openapi.v1+json'
};

export const setApiToken = token => {
  _token = token;
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
    if (!_token) {
      throw Error('Expected api token to be presented');
    }

    headers.Authorization = `Bearer ${_token}`;
  }

  let body = config.body;

  if (config.json) {
    body = JSON.stringify(config.json);
  }

  return fetch('http://localhost:3000' + config.url, {
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
    .catch(error => {
      return Promise.reject({
        code: error.Error || 'TRANSPORT_ERROR',
        message: error.ErrorDescription || 'Error occured while receiving data'
      });
    });
};
