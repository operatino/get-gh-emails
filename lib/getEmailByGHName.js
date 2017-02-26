const request = require('superagent');
const exec = require('child_process').exec;

module.exports = (username, auth) => {
  return new Promise((resolve, reject) => {
    const callGH = () => {
      request
        .get(`https://api.github.com/users/${username}/events/public?client_id=${auth.client_id}&client_secret=${auth.client_secret}`)
        .end(function (err, res) {
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

          if (!body || body.length === 0) {
            reject('no events found');
            return;
          }

          const filteredEvents = body.map((item) => {
            if (item && item.payload && item.payload.commits) {
              return item.payload.commits.map((item) => {
                return item.author;
              });
            }

            return '';
          }).filter(item => item !== '');

          if (filteredEvents.length === 0) {
            reject('no relevant events found');
            return;
          }

          exec(`./bash/findGitHubEmail.sh '${JSON.stringify(filteredEvents, null, 2)}'`, function (err, stdout, stderr) {
            if (err) {
              let msg = `error running bash script: ${err}`;
              console.warn(`getEmailByGHName.js - ${msg}`);
              reject(err);
            }

            resolve(stdout.trim());
          });
        });
    };

    callGH();
  })
};
