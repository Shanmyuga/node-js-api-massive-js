class BulletinVO {


    constructor(dept_assigned_to,ack_by,message,job_desc,message_created_by,message_created_date, target_date,seq_dept_mess_id,original_fileName,ack_comments,dept_assigned_from) {


        this._dept_assigned_to = dept_assigned_to;
        this._ack_by = ack_by;
        this._job_desc = job_desc;
        this._target_date = target_date;
        this._message_created_by = message_created_by;
        this._message_created_date = message_created_date;
        this._dept_message = message;
        this._seq_dept_mess_id = seq_dept_mess_id;
        this._message = message;
        this._original_fileName = original_fileName;
        this._ack_comments = ack_comments;
        this._dept_assigned_from = dept_assigned_from;

    }


    get dept_assigned_to() {
        return this._dept_assigned_to;
    }

    set dept_assigned_to(value) {
        this._dept_assigned_to = value;
    }

    get ack_by() {
        return this._ack_by;
    }

    set ack_by(value) {
        this._ack_by = value;
    }

    get message() {
        return this._message;
    }

    set message(value) {
        this._message = value;
    }

    get job_desc() {
        return this._job_desc;
    }

    set job_desc(value) {
        this._job_desc = value;
    }

    get message_created_by() {
        return this._message_created_by;
    }

    set message_created_by(value) {
        this._message_created_by = value;
    }

    get target_date() {
        return this._target_date;
    }

    set target_date(value) {
        this._target_date = value;
    }

    get seq_dept_mess_id() {
        return this._seq_dept_mess_id;
    }

    set seq_dept_mess_id(value) {
        this._seq_dept_mess_id = value;
    }


    get original_fileName() {
        return this._original_fileName;
    }

    set original_fileName(value) {
        this._original_fileName = value;
    }


    get ack_comments() {
        return this._ack_comments;
    }

    set ack_comments(value) {
        this._ack_comments = value;
    }


    get message_created_date() {
        return this._message_created_date;
    }

    set message_created_date(value) {
        this._message_created_date = value;
    }


    get dept_assigned_from() {
        return this._dept_assigned_from;
    }

    set dept_assigned_from(value) {
        this._dept_assigned_from = value;
    }
}
module.exports = BulletinVO;
