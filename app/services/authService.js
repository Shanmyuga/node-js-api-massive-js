let bcrypt = require('bcrypt');
let jwt = require('jsonwebtoken');
const CONSTANTS = require('../utils/constants');
let db = require('../../db/dataBase');

function createJwtToken(userId, username) {
    return jwt.sign({ user_name: username, id: userId }, CONSTANTS.jwtSecret, { expiresIn: CONSTANTS.jwtExpiration });
}

class authService {
    static async findById(id) {
        console.log(id);
        const result = await db.simpleExecute(`SELECT user_id
       FROM SCIGENICS_USER_MASTER 
       WHERE seq_user_id = :id`,
            [id]);
        return result;
    }

    static async login(req, res) {
        const user_name = req.body.txtUsername;
        const plainPassword = req.body.txtPassword;
        let result = null;
try {
     result = await db.simpleExecute(
        `SELECT password,seq_user_id,user_id
       FROM SCIGENICS_USER_MASTER 
       WHERE user_id = :id`,
        [user_name] // bind value for :id
    );
}
catch (e) {

    console.log(e);
}
        if (result) {
console.log(result.rows[0][0])
            const checkPassword = plainPassword === result.rows[0][0];

            if (!checkPassword) {
                return { success: false, message: 'Invalid user or password', token: null }
            }

            const token = createJwtToken(result.rows[0][1], result.rows[0][2]);
            return { success: true, message: 'Access data', token: token };
        } else {
            return { success: false, message: res.__('api.auth.login.data.error'), token: null }
        }
    }

}

module.exports = authService;