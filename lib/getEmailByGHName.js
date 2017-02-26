const request = require('superagent');
const getEmailByGHEvents = require('./getEmailByGHEvents.js');

module.exports = (username, auth) => {
  return new Promise((resolve, reject) => {
    const callGH = () => {
      request
        .get(`https://api.github.com/users/${username}?client_id=${auth.client_id}&client_secret=${auth.client_secret}`)
        .end(async (err, res) => {
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

          const body = res.body;

          if (body && body.email) {
            resolve(body.email);
          } else {
            let emailFromEvents;

            try {
              emailFromEvents = await getEmailByGHEvents(username, auth);
            } catch(err) {
              reject(err);
              return;
            }

            resolve(emailFromEvents);
          }
        });
    };

    callGH();
  });
};
