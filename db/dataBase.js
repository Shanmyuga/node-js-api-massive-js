const oracledb = require('oracledb');
const dbConfig = require('../db/config/dbconfig');
oracledb.outFormat = oracledb.ARRAY;
const CONSTANTS = require('../app/utils/constants');



    

      // oracledb.initOracleClient({libDir: '/usr/lib/oracle/19.3/client64/lib'});
//oracledb.initOracleClient({libDir: 'C:\\oracle\\instantclient_19_11'});



async function initialize(env) {

    console.log("initialize");
    if(env === "remote") {
        oracledb.initOracleClient({libDir: '/usr/lib/oracle/19.3/client64/lib'});
        await oracledb.createPool(dbConfig.scigenicsDbRemote);
    }
    if(env === "local") {
        oracledb.initOracleClient({libDir: '/usr/lib/oracle/19.3/client64/lib'});
        await oracledb.createPool(dbConfig.scigenicsDblocal);
    }
    if(env === "development") {
        //oracledb.initOracleClient({libDir: '/usr/lib/oracle/19.3/client64/lib'});
oracledb.initOracleClient({libDir: 'C:\\oracle\\instantclient_19_11'});
        await oracledb.createPool(dbConfig.scigenicsDbRemote);
    }

    if(env === "office") {
        //oracledb.initOracleClient({libDir: '/usr/lib/oracle/19.3/client64/lib'});
        oracledb.initOracleClient({libDir: 'C:\\oracleclient\\product\\12.2.0\\client_1\\instantclient_19_12'});
        await oracledb.createPool(dbConfig.scigenicsDbRemote);
    }
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




