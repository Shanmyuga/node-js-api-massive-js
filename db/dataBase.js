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
        oracledb.initOracleClient({libDir: 'C:\\oracle\\instantclient_19_10'});
        this.connection = await oracledb.getConnection({
            user: "scigenics",
            password: "scigenics",
            connectString: "(DESCRIPTION = (ADDRESS = (PROTOCOL = TCP)(HOST = 136.185.10.147)(PORT = 32771)) (CONNECT_DATA = (SERVER = DEDICATED)  (SERVICE_NAME=xe.oraslim.com)))"
        });

        return this.oracledb;
    }

    destroy() {
        if (this.connection) this.connection.pgp.end();
    }
}

const instance = new Database();
module.exports = instance;