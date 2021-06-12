class EpicValueObject {


    constructor(dept_id, epic_id,epic_desc,user_story_id,user_story_task) {
       this._dept_id = dept_id;
        this._epic_id = epic_id;
        this._epic_desc = epic_desc;
        this._user_story_id = user_story_id;
        this._user_story_task = user_story_task;
    }


    get dept_id() {
        return this._dept_id;
    }

    set dept_id(value) {
        this._dept_id = value;
    }

    get epic_id() {
        return this._epic_id;
    }

    set epic_id(value) {
        this._epic_id = value;
    }

    get epic_desc() {
        return this._epic_desc;
    }

    set epic_desc(value) {
        this._epic_desc = value;
    }

    get user_story_id() {
        return this._user_story_id;
    }

    set user_story_id(value) {
        this._user_story_id = value;
    }

    get user_story_task() {
        return this._user_story_task;
    }

    set user_story_task(value) {
        this._user_story_task = value;
    }
}

module.exports = EpicValueObject;