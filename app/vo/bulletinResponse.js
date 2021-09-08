class BulletinVOResponse {


    constructor(message, seq_dept_mess_id) {



        this._seq_dept_mess_id = seq_dept_mess_id;
        this._message = message;


    }


    get message() {
        return this._message;
    }

    set message(value) {
        this._message = value;
    }

    get seq_dept_mess_id() {
        return this._seq_dept_mess_id;
    }

    set seq_dept_mess_id(value) {
        this._seq_dept_mess_id = value;
    }
}
    module.exports = BulletinVOResponse;
