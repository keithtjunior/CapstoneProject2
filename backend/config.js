'use strict';

require('dotenv').config();
require('colors');

const PORT = +process.env.PORT || 3001;
const INAT_API_URL = 'https://api.inaturalist.org/v1';

console.log('FaunaFinder config'.green);
console.log('PORT:'.yellow, PORT.toString());

module.exports = {
    PORT,
    INAT_API_URL
};