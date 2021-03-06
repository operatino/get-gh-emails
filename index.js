const async = require('async');

const getEmailByGHName = require('./lib/getEmailByGHName.js');
const getListOfUsers = require('./lib/getListOfUsers.js');
const getGHUsername = require('./lib/getGHUsername.js');
const args = process.argv.slice(2);

const auth = {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET
};

const run = async(csvPath, limit) => {
  const users = await getListOfUsers(csvPath);
  const limitUsers = limit ? users.slice(0, limit) : users;
  const limitUsersLength = limitUsers.length;

  async.mapLimit(limitUsers, 4, async(item, callback) => {
    try {
      const itemSplit = item.trim().split(' ');

      if (itemSplit.length < 2) {
        callback(null, '');
        return;
      }

      const userName = await getGHUsername(item, auth);

      if (userName) {
        const email = await getEmailByGHName(userName, auth);

        callback(null, email);

        console.log(`${item}, ${userName}, ${email}`);

        return;
      }

      callback(null, '');
    } catch (error) {
      callback(null, '');
    }
  }, (err, results) => {
    const nonEmptyResults = results.filter(item => item !== '');

    console.log('results', JSON.stringify(nonEmptyResults, null, 2));
    console.log(`got ${nonEmptyResults.length} out of ${limitUsersLength}`);
  });
};

if (args && args[0]) {
  run(args[0]);
} else {
  console.log('please specify CSV path as a first argument...');
}
