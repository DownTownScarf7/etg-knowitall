'use strict';

const api = 'http://localhost:8080/api';
const requestGungeoneers = new XMLHttpRequest();


window.onload = () => {
  requestGungeoneers.open('GET', api, true);
  requestGungeoneers.setRequestHeader("Content-Type", "application/json");
  requestGungeoneers.onload = () => {
    const res = JSON.parse(requestGungeoneers.responseText);
    console.log(res);
    const mainDiv = document.querySelector('#gungeoneers');
    const subDiv = document.createElement('div');
    mainDiv.appendChild(document.createElement('h3')).innerText = 'GUNGONEERS';
    subDiv.classList.add('icon-container');
    mainDiv.appendChild(subDiv);
    for (let i in res.dataGungeoneers) {
      const gungeoneer = res.dataGungeoneers[i];
      const wikiLink = document.createElement('a');
      const img = document.createElement('img');
      wikiLink.href = gungeoneer.wikiLink;
      wikiLink.target = '_blank';
      img.classList.add('icon', 'gungeoneer');
      img.src = gungeoneer.icon;
      subDiv.appendChild(wikiLink);
      wikiLink.appendChild(img);
    }
  };
  requestGungeoneers.send();

  document.querySelector('#search').addEventListener('keydown', event => {
    // Placeholder
    console.log(event.target.value);
  });

  document.querySelector('#guns').appendChild(document.createElement('h3')).innerText = 'GUNS';
  document.querySelector('#items').appendChild(document.createElement('h3')).innerText = 'ITEMS';
  document.querySelector('#npcs').appendChild(document.createElement('h3')).innerText = 'NPCS';
  document.querySelector('#bosses').appendChild(document.createElement('h3')).innerText = 'BOSSES';
  document.querySelector('#cult').appendChild(document.createElement('h3')).innerText = 'CULT OF THE GUNDEAD';
  document.querySelector('#objects').appendChild(document.createElement('h3')).innerText = 'OBJECTS';
  document.querySelector('#pickups').appendChild(document.createElement('h3')).innerText = 'PICKUPS';
}
