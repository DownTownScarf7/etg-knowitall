'use strict';

const express = require('express');
const path = require('path');
const cheerio = require('cheerio');
const request = require('request');
const app = express();
const PORT = 8080;

app.use(express.static(__dirname));
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

const urlGamepedia = 'https://enterthegungeon.gamepedia.com';
const gungeoneers = [];
const guns = [];
const items = [];

request(`${urlGamepedia}/Gungeoneers`, (err, res, body) => {
  if (err) {
    console.error(err);
    return;
  }

  const $ = cheerio.load(body);
  $('#mw-content-text table tr').each(function () {
    if ($(this).children('td').length > 0) {
      const gungeoneer = $(this).children('td').eq(0);
      const dataStartingWeapons = [];
      const dataStartingItems = [];

      $(this).children('td').eq(1).find('a').not('.image').each(function () {
        const gunImg = $(this).prev('.image').children('img');
        dataStartingWeapons.push({
          name: $(this).attr('title'),
          wikiLink: `${urlGamepedia}${$(this).attr('href')}`,
          img: {
            src: gunImg.attr('src'),
            width: gunImg.attr('width'),
            height: gunImg.attr('height'),
          },
        });
      });

      $(this).children('td').eq(2).find('a').not('.image').each(function () {
        const itemImg = $(this).prev('.image').children('img');
        dataStartingItems.push({
          name: $(this).attr('title'),
          wikiLink: `${urlGamepedia}${$(this).attr('href')}`,
          img: {
            src: itemImg.attr('src'),
            width: itemImg.attr('width'),
            height: itemImg.attr('height'),
          },
        });
      });

      gungeoneers.push({
        name: gungeoneer.find('a').attr('title'),
        icon: gungeoneer.find('img').attr('src'),
        startingWeapons: dataStartingWeapons,
        startingItems: dataStartingItems,
        wikiLink: `${urlGamepedia}${gungeoneer.eq(0).find('a').attr('href')}`,
      });
    };
  });

  console.log('Gungeoneer data gathered, JSON ready.');
});

request(`${urlGamepedia}/Guns`, (err, res, body) => {
  if (err) {
    console.error(err);
    return;
  }

  const $ = cheerio.load(body);
  $('table tbody tr').each(function (index) {
    const columns = $(this).find('td');

    
    if (columns.length > 0) {
      guns.push({
        imgHtml: columns.eq(0).html(),
        name: columns.eq(1).children('a').text(),
        wikiLink: `${urlGamepedia}${columns.eq(1).children('a').attr('href')}`,
        quote: columns.eq(2).text(),
        stats: {
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
        smallNotes: columns.eq(14).text(),
        notesHtml: '-',
      });

      request(`${urlGamepedia}${columns.eq(1).children('a').attr('href')}`, (err, res, body) => {
        if (err) {
          console.error(err);
          return;
        }

        const $ = cheerio.load(body);

        if ($('#Notes') && $('#Notes') != null) {
          guns[index - 1].notesHtml = $('#Notes').parent('h2').next('ul').html();
        }
      });
    }
  });

  console.log('Gun data gathered, JSON ready.');
});

request(`${urlGamepedia}/Items`, (err, res, body) => {
  if (err) {
    console.error(err);
    return;
  }

  const $ = cheerio.load(body);
  $('table tbody tr').each(function (index) {
    const columns = $(this).find('td');

    if (columns.length > 0) {
      items.push({
        imgHtml: columns.eq(0).html(),
        name: columns.eq(1).children('a').text(),
        wikiLink: `${urlGamepedia}${columns.eq(1).children('a').attr('href')}`,
        type: columns.eq(2).text().replace(/\s/g, ''),
        quote: columns.eq(3).text(),
        quality: columns.eq(4).html(),
        effect: columns.eq(5).text(),
        notesHtml: '-',
      });

      request(`${urlGamepedia}${columns.eq(1).children('a').attr('href')}`, (err, res, body) => {
        if (err) {
          console.error(err);
          return;
        }

        const $ = cheerio.load(body);

        if ($('#Notes') && $('#Notes') != null) {
          items[index - 1].notesHtml = $('#Notes').parent('h2').next('ul').html();
        }
      });
    }
  });

  console.log('Item data gathered, JSON ready.');
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api', (req, res) => {
  res.json({
    gungeoneers,
    guns,
    items,
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
