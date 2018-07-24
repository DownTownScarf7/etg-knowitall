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

const urlGamepedia = 'https://enterthegungeon.gamepedia.com';
const urlGungeoneers = 'https://enterthegungeon.gamepedia.com/Gungeoneers';
const dataGungeoneers = {};
const dataGuns = {};
const dataItems = {};

request(urlGungeoneers, (err, res, body) => {
  if (err) {
    console.error(err);
    return;
  }
  const $ = cheerio.load(body);
  $('#mw-content-text table tr').each(function () {
    if ($(this).children('td').length > 0) {
      const gungeoneer = $(this).children('td').eq(0);
      const weapons = $(this).children('td').eq(1);
      const items = $(this).children('td').eq(2);
      const name = gungeoneer.find('a').attr('title');
      const icon = gungeoneer.find('img').attr('src');
      const href = gungeoneer.eq(0).find('a').attr('href');
      const startingWeapons = {};

      weapons.find('a').not('.image').each(function (index) {
        startingWeapons[$(this).attr('href').substring(1)] = {
          gunName: $(this).attr('title'),
          gunLink: $(this).attr('href'),
          gunSrc: $(this).prev('.image').children('img').attr('src'),
          }
      });

      dataGungeoneers[href.substring(1)] = {
        name,
        icon,
        startingWeapons,
        wikiLink: `${urlGamepedia}${href}`,
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
