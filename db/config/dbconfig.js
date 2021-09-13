module.exports = {
    scigenicsdb: {
        poolAlias: 'test',
        user: 'scigenics',
        password: 'scigenics',
        connectString: '(DESCRIPTION = (ADDRESS = (PROTOCOL = TCP)(HOST = 192.168.1.115)(PORT = 32771)) (CONNECT_DATA = (SERVER = DEDICATED)  (SERVICE_NAME=xe.oraslim.com)))',
        poolMin: 10,
        poolMax: 10,
        poolIncrement: 0

    }
};
