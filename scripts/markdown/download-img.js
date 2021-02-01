const fs = require('fs');
const axios = require('axios');
const { log } = require('./utils/log-utils');

/**
 * Download online image to local file store
 * Useful to optimize images for Next `<Image >` tags
 *
 * @param {*} url       Web URL (only supports http)
 * @param {*} fileName  Path to local file store
 */

exports.downloadImage = async (url, fileName) => {
  return axios({
    url: url.replace('https:', 'http:'),
    responseType: 'stream'
  }).then(
    (response) =>
      new Promise((resolve, reject) => {
        response.data
          .pipe(fs.createWriteStream(fileName))
          .on('finish', () => resolve(`${fileName}`))
          .on('error', (e) => reject(`save Image: ${url}: ${JSON.stringify(e)}`));
      })
  );
};
