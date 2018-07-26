'use strict';

const api = 'http://localhost:8080/api';
const requestData = new XMLHttpRequest();


window.onload = () => {
  requestData.open('GET', api, true);
  requestData.setRequestHeader("Content-Type", "application/json");
  requestData.onload = () => {
    const res = JSON.parse(requestData.responseText);
    let mainDiv = document.querySelector('#gungeoneers');
    let subDiv = document.createElement('div');
    mainDiv.appendChild(document.createElement('h3')).innerText = 'GUNGONEERS';
    subDiv.classList.add('icon-container');
    mainDiv.appendChild(subDiv);
    for (let i in res.dataGungeoneers) {
      const gungeoneer = res.dataGungeoneers[i];
      const wikiLink = document.createElement('a');
      const img = document.createElement('img');
      const div = document.createElement('div');
      const descBox = document.createElement('div');
      const descBoxWeaponsDiv = document.createElement('div');
      const descBoxItemsDiv = document.createElement('div');

      div.classList.add('valid');
      wikiLink.classList.add('wikiLink');
      wikiLink.href = gungeoneer.wikiLink;
      wikiLink.target = '_blank';
      img.classList.add('icon', 'gungeoneer');
      img.src = gungeoneer.icon;

      subDiv.appendChild(div);
      div.appendChild(wikiLink);
      wikiLink.appendChild(img);

      descBox.classList.add('description-box');
      descBox.appendChild(document.createElement('h3')).innerText = gungeoneer.name;
      descBox.appendChild(descBoxWeaponsDiv);
      descBox.appendChild(descBoxItemsDiv);
      div.appendChild(descBox);

      descBoxWeaponsDiv.appendChild(document.createElement('h4')).innerText = 'Starting Weapons';
      for (let j in gungeoneer.startingWeapons) {
        const gun = gungeoneer.startingWeapons[j];

        const gunDiv = document.createElement('div');
        const gunPara = document.createElement('p');
        const gunImg = document.createElement('img');

        gunDiv.classList.add('description-icon-wrapper');        
        gunImg.src = gun.gunSrc;
        gunImg.width = gun.gunImgSize.width;
        gunImg.height = gun.gunImgSize.height;
        gunImg.classList.add('description-icon');
        descBoxWeaponsDiv.appendChild(gunDiv);
        gunDiv.appendChild(gunImg);
        gunPara.innerText = gun.gunName;
        gunDiv.appendChild(gunPara);
      }

      descBoxItemsDiv.appendChild(document.createElement('h4')).innerText = 'Starting Items';
      for (let j in gungeoneer.startingItems) {
        const item = gungeoneer.startingItems[j];

        const itemDiv = document.createElement('div');
        const itemPara = document.createElement('p');
        const itemImg = document.createElement('img');

        itemDiv.classList.add('description-icon-wrapper');
        itemImg.src = item.itemSrc;
        itemImg.width = item.itemImgSize.width;
        itemImg.height = item.itemImgSize.height;
        itemImg.classList.add('description-icon');
        descBoxItemsDiv.appendChild(itemDiv);
        itemDiv.appendChild(itemImg);
        itemPara.innerText = item.itemName;
        itemDiv.appendChild(itemPara);
      }
    }

    mainDiv = document.querySelector('#guns');
    subDiv = document.createElement('div');
    mainDiv.appendChild(document.createElement('h3')).innerText = 'GUNS';
    subDiv.classList.add('icon-container');
    mainDiv.appendChild(subDiv);

    for (let i in res.dataGuns) {
      const gun = res.dataGuns[i];
      const div = document.createElement('div');

      div.innerHTML = gun.gunImg;
      const anchor = div.children[0];
      const img = anchor.children[0];

      anchor.href = gun.gunWikiLink;
      anchor.target = '_blank';
      anchor.className = 'wikiLink';
      img.className = 'pixelart valid';
      if (img.height < 15) {
        img.width *= 2;
        img.height *= 2;
      } else if (img.height < 30) {
        img.width *= 1.5;
        img.height *= 1.5;
      } else if (img.height > 40) {
        img.width *= 0.8;
        img.height *= 0.8;
      }
      subDiv.appendChild(div);
    }
  };
  requestData.send();

  document.querySelector('#search').addEventListener('keydown', event => {
    // Placeholder
    console.log(event.target.value);
  });

  document.querySelector('#items').appendChild(document.createElement('h3')).innerText = 'ITEMS';
  document.querySelector('#npcs').appendChild(document.createElement('h3')).innerText = 'NPCS';
  document.querySelector('#bosses').appendChild(document.createElement('h3')).innerText = 'BOSSES';
  document.querySelector('#cult').appendChild(document.createElement('h3')).innerText = 'CULT OF THE GUNDEAD';
  document.querySelector('#objects').appendChild(document.createElement('h3')).innerText = 'OBJECTS';
  document.querySelector('#pickups').appendChild(document.createElement('h3')).innerText = 'PICKUPS';
}
