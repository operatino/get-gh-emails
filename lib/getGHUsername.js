const request = require('superagent');

module.exports = (query, auth) => {
  return new Promise((resolve, reject) => {
    const callGH = () => {
      request
        .get(`https://api.github.com/search/users?q="${query}"&client_id=${auth.client_id}&client_secret=${auth.client_secret}`)
        .end((err, res) => {
          const body = res.body;
          const headers = res.headers;

          if (err) {
            if (res.status === 403 && headers && headers['x-ratelimit-reset']) {
              const timeOut = (new Date(headers['x-ratelimit-reset'] * 1000)) - new Date();

              setTimeout(callGH, timeOut);
              return;
            }

            reject(err);
            return;
          }

          if (body.total_count > 0) {
            resolve(body.items[0].login)
          } else {
            reject('no results');
          }
        });
    };

    callGH();
  })
};
