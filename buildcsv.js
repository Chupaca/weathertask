'use strict'

const promise = require("bluebird")
const fs = promise.promisifyAll(require("fs"))
const moment = require("moment")
const connection = require("./connection");
const CitiesList = {
    281184: 'Jerusalem',
    5128638: 'NewYork',
    292223: 'Dubai',
    6458923: 'Lisbon',
    6453366: 'Oslo',
    6618607: 'Paris',
    2950158: 'Berlin',
    264371: 'Athens',
    1835848: 'Seoul',
    1880252: 'Singapore',
}

const BuildCSVWearther = async () => {
    let dataToCSV = {}
    for await (let cityDays of Object.keys(CitiesList).map(cityId => GetWeatherBy5Days(cityId))) {
        dataToCSV = buildFinalCSV(dataToCSV, cityDays)
    }
    return await buildFile(dataToCSV)
}

async function GetWeatherBy5Days(cityId) {
    const data = await connection.GetWeatherByCityId(cityId)
    if (data) {
        return sortDataByDays(data)
    }
}

function sortDataByDays(data) {
    let sortableCityData = {}
    data.list.forEach(item => {
        sortableCityData[moment(item.dt_txt).startOf("day").valueOf()] = {
            Temp: getTemp(sortableCityData[moment(item.dt_txt).startOf("day").valueOf()], item.main.temp),
            Rain: getRainExists(sortableCityData[moment(item.dt_txt).startOf("day").valueOf()], item.weather[0].main),
            City: data.city.name
        }
    })
    return sortableCityData
}

function getTemp(oldStep, newStep) {
    return oldStep && oldStep.Temp > newStep ? oldStep.Temp : newStep
}

function getRainExists(oldStep, newStep) {
    return oldStep && oldStep.Rain ? true : newStep == "Rain" ? true : false
}

function buildFinalCSV(dataToCSV, cityDays) {
    Object.entries(cityDays).forEach(([day, data]) => {
        if (!dataToCSV[day]) {
            dataToCSV[day] = { MaxTemp: { temp: data.Temp, city: data.City }, MinTemp: { temp: data.Temp, city: data.City }, Rain: [] }
        } else {
            dataToCSV[day].MaxTemp = dataToCSV[day].MaxTemp.temp > data.Temp ? dataToCSV[day].MaxTemp : { temp: data.Temp, city: data.City };
            dataToCSV[day].MinTemp = dataToCSV[day].MinTemp.temp < data.Temp ? dataToCSV[day].MinTemp : { temp: data.Temp, city: data.City };
        }
        if (data.Rain) {
            dataToCSV[day].Rain.push(data.City)
        }
    })
    return dataToCSV
}

async function buildFile(dataToCSV) {
    const fileName = "./Weather.csv";
    const endRow = "\r\n";
    let content = "DAY,city with h. temp,city with l. temp,cities with rain" + endRow;
    Object.entries(dataToCSV).forEach(([day, data]) => {
        content += `${moment(Number(day)).format("DD/MM/YYYY")},${data.MaxTemp.city},${data.MinTemp.city},${data.Rain.join(" ")},${endRow}`
    })
    return await fs.writeFileAsync(fileName, content,  { encoding: "binary" })
}

module.exports = {
    BuildCSVWearther
}