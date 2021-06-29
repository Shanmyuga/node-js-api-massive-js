module.exports = {
    scigenicsdb: {
        poolAlias: 'test',
        user: 'scigenics',
        password: 'scigenics',
        connectString: '(DESCRIPTION = (ADDRESS = (PROTOCOL = TCP)(HOST = 122.165.141.17)(PORT = 8050)) (CONNECT_DATA = (SERVER = DEDICATED)  (SERVICE_NAME=xe.oraslim.com)))',
        poolMin: 10,
        poolMax: 10,
        poolIncrement: 0

    }
};