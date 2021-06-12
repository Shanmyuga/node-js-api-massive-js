const oracledb = require('oracledb');
// hr schema password
var password = 'scigenics'
// checkConnection asycn function
async function checkConnection() {
    try {
        oracledb.initOracleClient({libDir: 'C:\\oracle\\instantclient_19_10'});
        connection = await oracledb.getConnection({
            user: "scigenics",
            password: password,
            connectString: "(DESCRIPTION = (ADDRESS = (PROTOCOL = TCP)(HOST = 136.185.10.147)(PORT = 32771)) (CONNECT_DATA = (SERVER = DEDICATED)  (SERVICE_NAME=xe.oraslim.com)))"
        });
        console.log('connected to database');
    } catch (err) {
        console.error(err.message);
    } finally {
        if (connection) {
            try {
                // Always close connections
                await connection.close();
                console.log('close connection success');
            } catch (err) {
                console.error(err.message);
            }
        }
    }
}

checkConnection();