const oracledb = require('oracledb');
oracledb.outFormat = oracledb.ARRAY;
const CONSTANTS = require('../app/utils/constants');

class Database {
    constructor() {
        if (Database.instance) return Database.instance;

        this.connection = null;
        Database.instance = this;
    }

    async init() {
        oracledb.initOracleClient({libDir: '/Users/prakash/Downloads/instantclient_19_8'});
        this.connection = await oracledb.getConnection({
            user: "scigenics",
            password: "scigenics",
            connectString: "(DESCRIPTION = (ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.115)(PORT = 32771)) (CONNECT_DATA = (SERVER = DEDICATED)  (SERVICE_NAME=xe.oraslim.com)))"
        });
    console.log(this.connection);
        return this.oracledb;
    }

    destroy() {
        if (this.connection) this.connection.pgp.end();
    }
}

const instance = new Database();
module.exports = instance;
