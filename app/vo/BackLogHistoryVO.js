class BackLogValueObject {

constructor(user_comments,sprint_name,updated_date,updated_by,assigned_to) {
    this._user_comments = user_comments;
    this._sprint_name = sprint_name;
    this._updated_date = updated_date;
    this._updated_by = updated_by;
    this._assigned_to = assigned_to;

}


    get user_comments() {
        return this._user_comments;
    }

    set user_comments(value) {
        this._user_comments = value;
    }

    get sprint_name() {
        return this._sprint_name;
    }

    set sprint_name(value) {
        this._sprint_name = value;
    }

    get updated_date() {
        return this._updated_date;
    }

    set updated_date(value) {
        this._updated_date = value;
    }

    get updated_by() {
        return this._updated_by;
    }

    set updated_by(value) {
        this._updated_by = value;
    }

    get assigned_to() {
        return this._assigned_to;
    }

    set assigned_to(value) {
        this._assigned_to = value;
    }
}


module.exports = BackLogValueObject;