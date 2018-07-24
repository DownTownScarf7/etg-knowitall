'use strict';

const api = 'http://localhost:8080/api';
const requestGungeoneers = new XMLHttpRequest();


window.onload = () => {
  requestGungeoneers.open('GET', api, true);
  requestGungeoneers.setRequestHeader("Content-Type", "application/json");
  requestGungeoneers.onload = () => {
    const res = JSON.parse(requestGungeoneers.responseText);
    console.log(res);
    document.querySelector('#gungeoneers').appendChild(document.createElement('h3')).innerText = 'GUNGONEERS';
    res.iconGungeoneers.forEach(icon => {
      document.querySelector('#gungeoneers').appendChild(document.createElement('img')).src = icon;
    });
  };
  requestGungeoneers.send();

  document.querySelector('#search').addEventListener('keydown', event => {
    console.log(event.key);
  });

  document.querySelector('#guns').appendChild(document.createElement('h3')).innerText = 'GUNS';
  document.querySelector('#items').appendChild(document.createElement('h3')).innerText = 'ITEMS';
  document.querySelector('#npcs').appendChild(document.createElement('h3')).innerText = 'NPCS';
  document.querySelector('#bosses').appendChild(document.createElement('h3')).innerText = 'BOSSES';
  document.querySelector('#cult').appendChild(document.createElement('h3')).innerText = 'CULT OF THE GUNDEAD';
  document.querySelector('#objects').appendChild(document.createElement('h3')).innerText = 'OBJECTS';
  document.querySelector('#pickups').appendChild(document.createElement('h3')).innerText = 'PICKUPS';
}
