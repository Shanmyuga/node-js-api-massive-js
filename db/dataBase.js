const oracledb = require('oracledb');
const dbConfig = require('../db/config/dbconfig');
oracledb.outFormat = oracledb.ARRAY;
const CONSTANTS = require('../app/utils/constants');



    

       //oracledb.initOracleClient({libDir: '/Users/prakash/Downloads/instantclient_19_8'});
oracledb.initOracleClient({libDir: 'C:\\oracle\\instantclient_19_12'});



async function initialize() {
    console.log("initialize");
    await   oracledb.createPool(dbConfig.scigenicsdb);
}

module.exports.initialize = initialize;

async function close() {
    await oracledb.getPool().close(0);
}

module.exports.close = close;

async function simpleExecute(statement, binds = [], opts = {}) {
    let conn;
    let result = [];



    try {
        conn = await oracledb.getConnection('test',);
        result = await conn.execute(statement, binds, opts);
        return (result);
    } catch (err) {
        console.error(err);
        throw (err);
    } finally {
        if (conn) { // conn assignment worked, need to close
            try {
                await conn.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}
module.exports.simpleExecute = simpleExecute;




