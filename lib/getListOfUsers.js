const csv = require('csv');
const fs = require('fs');

module.exports = (filaPath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filaPath, 'utf8', (err, data) => {
      if (err) {
        console.warn(`getListOfUsers.js - can't read file ${filaPath}: ${err}`);
        reject(err);
        return;
      }

      csv.parse(data, function (err, parsedData) {
        if (err) {
          console.warn(`getListOfUsers.js - can't parse file ${filaPath}: ${err}`);
          reject(err);
          return;
        }

        csv.transform(parsedData, function (transformedDataRow) {
          return transformedDataRow[0];
        }, function (err, transformedData) {
          resolve(transformedData);
        });
      });
    });
  });
};
