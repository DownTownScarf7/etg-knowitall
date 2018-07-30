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
const dataGungeoneers = {};
const dataGuns = {};
const dataItems = {};

request(`${urlGamepedia}/Gungeoneers`, (err, res, body) => {
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
      const startingItems = {};

      weapons.find('a').not('.image').each(function (index) {
        const gunImg = $(this).prev('.image').children('img');
        startingWeapons[$(this).attr('href').substring(1)] = {
          gunName: $(this).attr('title'),
          gunLink: $(this).attr('href'),
          gunSrc: gunImg.attr('src'),
          gunImgSize: { width: gunImg.attr('width'), height: gunImg.attr('height') },
          }
      });

      items.find('a').not('.image').each(function (index) {
        const itemImg = $(this).prev('.image').children('img');
        startingItems[$(this).attr('href').substring(1)] = {
          itemName: $(this).attr('title'),
          itemLink: $(this).attr('href'),
          itemSrc: itemImg.attr('src'),
          itemImgSize: { width: itemImg.attr('width'), height: itemImg.attr('height') },
          }
      });

      dataGungeoneers[href.substring(1)] = {
        name,
        icon,
        startingWeapons,
        startingItems,
        wikiLink: `${urlGamepedia}${href}`,
      };
    };
  });
});

request(`${urlGamepedia}/Guns`, (err, res, body) => {
  if (err) {
    console.error(err);
    return;
  }

  const $ = cheerio.load(body);
  $('table tbody tr').each(function () {
    const columns = $(this).find('td');

    if (columns.length > 0) {
      dataGuns[columns.eq(1).children('a').attr('href').substring(1)] = {
        gunImg: columns.eq(0).html(),
        gunName: columns.eq(1).children('a').text(),
        gunWikiLink: `${urlGamepedia}${columns.eq(1).children('a').attr('href')}`,
        gunQuote: columns.eq(2).text(),
        gunStats: {
          quality: columns.eq(3).children().html(),
          type: columns.eq(4).text(),
          magSize: columns.eq(5).html(),
          ammoCap: columns.eq(6).html(),
          damage: columns.eq(7).text(),
          fireRate: columns.eq(8).text(),
          reloadTime: columns.eq(9).text(),
          shotSpeed: columns.eq(10).html(),
          range: columns.eq(11).html(),
          force: columns.eq(12).html(),
          spread: columns.eq(13).text(),
        },
        gunSmallNotes: columns.eq(14).text(),
        gunNotes: '-',
      }
      request(`${urlGamepedia}${columns.eq(1).children('a').attr('href')}`, (err, res, body) => {
        if (err) {
          console.error(err);
          return;
        }

        const $ = cheerio.load(body);

        if ($('#Notes') && $('#Notes') != null) {
          dataGuns[columns.eq(1).children('a').attr('href').substring(1)].gunNotes = $('#Notes').parent('h2').next('ul').html();
        }
      });
    }
  });
  console.log('Data gathered, JSON ready.');
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api', (req, res) => {
  res.json({
    dataGungeoneers,
    dataGuns,
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
