class BulletinVOResponse {




    constructor(message, seq_dept_mess_id,ack_comments) {



        this._seq_dept_mess_id = seq_dept_mess_id;
        this._message = message;
        this._ack_comments = ack_comments;

    }

    get ack_comments() {
        return this._ack_comments;
    }

    set ack_comments(value) {
        this._ack_comments = value;
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
