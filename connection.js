'use strict'

const promise = require('bluebird');
const request = promise.promisifyAll(require('request'))
const APIKEY = 'fff9f900987a05902f07d757aba5540f'

const CheckConnection = async () => {
    const tryConnection = await request.getAsync({
        method: 'GET',
        uri: `http://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=${APIKEY}`,
    })
    const respons = JSON.parse(tryConnection.body)
    if (respons.cod !== "200") {
        return promise.reject(new Error("Not connected to API! Code response : " + respons.cod));
    }
    else {
        return true;
    }
}

const GetWeatherByCityId = async (cityId) => {
    try {
        const data = await request.getAsync({
            method: 'GET',
            uri: `http://api.openweathermap.org/data/2.5/forecast?id=${cityId}&APPID=${APIKEY}`,
        })
        const respons = JSON.parse(data.body);
        if (respons.cod !== "200") {
            return promise.reject(new Error("Not connected to API! Code response : " + respons.cod));
        }
        else {
            return respons;
        }
    } catch (err) {
        console.log(err)
        return promise.reject(new Error("Not connected to API! Code response : " + err));
    }
}

module.exports = {
    CheckConnection,
    GetWeatherByCityId
}