'use strict'

const connection = require("./connection");
const buildcsv = require("./buildcsv");

const checkApiConnectin = async() => {
    try{
        const checkConnection = await connection.CheckConnection();
        if(checkConnection){
            console.log("Connection to API exists!")
        } else {
            new Error("Not connected to API! ")
        }
        const csv = await buildcsv.BuildCSVWearther()
        console.log("File builded!")
        return
    }catch(err){
        console.error(err)
        console.log("File not builded!")
        return
    }
}

checkApiConnectin()



process.on('uncaughtException', function (error) {
    if (!error) {
        console.error("UncaughtException reject of null!");
    } 
    else if (error.stack) {
        console.error(error.stack);
    }
    else {
        console.error(error);
    }
});

process.on('unhandledRejection', function (reason) {
    if (!reason) {
        console.error("UnhandledRejection reject of null!");
    }else if (reason.stack) {
        console.error(reason.stack);
    }
    else {
        console.error(reason);
    }
});