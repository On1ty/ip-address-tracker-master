"use strict"

const ipElem = document.querySelector('[data-ip]');
const locElem = document.querySelector('[data-loc]');
const ispElem = document.querySelector('[data-isp]');
const timeZoneElem = document.querySelector('[data-timezone]');

const inputElem = document.querySelector('[data-input]');
const submitElem = document.querySelector('[data-submit');

window.addEventListener('load', async (e) => {
    const ipObj = await getIp();
    const getLocObj = await getLoc(ipObj.ip);

    renderResult(getLocObj);

    console.log({
        lat: getLocObj.latitude,
        long: getLocObj.longitude
    })

    navMap(getLocObj.latitude, getLocObj.longitude)
});

submitElem.addEventListener('click', async () => {
    const inputIp = inputElem.value
    const getLocObj = await getLoc(inputIp);

    console.log({
        lat: getLocObj.latitude,
        long: getLocObj.longitude
    })

    if (getLocObj.message) {
        console.log(getLocObj.message);
        inputElem.value = '';
        return;
    }

    renderResult(getLocObj);
    navMap(getLocObj.latitude, getLocObj.longitude)

    console.log('got location');
});

inputElem.addEventListener('keydown', (e) => {
    if (e.keyCode === 13) {
        submitElem.click();
    }
})

const renderResult = (getLocObj) => {
    ipElem.innerHTML = getLocObj.ip;
    ispElem.innerHTML = getLocObj.isp.toString().toLowerCase();
    timeZoneElem.innerHTML = getLocObj.time_zone.name;
    locElem.innerHTML = `${getLocObj.city}, ${getLocObj.state_prov} ${getLocObj.zipcode}`;
    inputElem.value = '';
}

const getIp = async () => {
    const url = 'https://api.ipgeolocation.io/getip';

    const response = await fetch(url);
    return await response.json();
}

const getLoc = async (ip) => {
    const api_key = '427a69b06384444aa6d871da503ccaa7';
    const url = `https://api.ipgeolocation.io/ipgeo?apiKey=${api_key}&ip=${ip}`;

    const response = await fetch(url);
    return await response.json();
}

const navMap = (lat, long) => {
    var map = L.map('map').setView([lat, long], 50);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([lat, long]).addTo(map)
        .bindPopup('I am here!')
        .openPopup();
}