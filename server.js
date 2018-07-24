'use strict';

require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const path = require('path');
const cheerio = require('cheerio');
const request = require('request');
const app = express();
const PORT = 8080;

app.use(express.static(__dirname));
app.use(express.json());

// const conn = mysql.createConnection({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
// });

const urlGungeoneers = 'https://enterthegungeon.gamepedia.com/Gungeoneers';
const dataGungeoneers = {};

request(urlGungeoneers, (err, res, body) => {
  if (err) {
    console.error(err);
    return;
  }
  const $ = cheerio.load(body);
  $('#mw-content-text table tr').each(function () {
    if ($(this).children('td').length > 0) {
      const name = $(this).children('td').eq(0).find('a').attr('title');
      const icon = $(this).children('td').eq(0).find('img').attr('src');
      const href = $(this).children('td').eq(0).find('a').attr('href');
      dataGungeoneers[href.substring(1)] = {
        name,
        icon,
        wikiLink: `${urlGungeoneers}${href}`,
      };
    };
  });
  console.log(dataGungeoneers);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api', (req, res) => {
  res.json({
    dataGungeoneers,
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
