class BulletinVO {


    constructor(message_created_by, message,dept_assigned_to,ack_by,job_desc,target_date,seq_dept_message_id) {


        this._dept_assigned_to = dept_assigned_to;
        this._ack_by = ack_by;
        this._job_desc = job_desc;
        this._target_date = target_date;
        this._message_created_by = message_created_by;
        this._message = message;
        this._seq_dept_message_id = seq_dept_message_id;

    }


    get message_created_by() {
        return this._message_created_by;
    }

    set message_created_by(value) {
        this._message_created_by = value;
    }

    get message() {
        return this._message;
    }

    set message(value) {
        this._message = value;
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

    get job_desc() {
        return this._job_desc;
    }

    set job_desc(value) {
        this._job_desc = value;
    }

    get target_date() {
        return this._target_date;
    }

    set target_date(value) {
        this._target_date = value;
    }


    get seq_dept_message_id() {
        return this._seq_dept_message_id;
    }

    set seq_dept_message_id(value) {
        this._seq_dept_message_id = value;
    }
}
