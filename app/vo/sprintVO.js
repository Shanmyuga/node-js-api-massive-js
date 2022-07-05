class SprintVO {


    constructor(dept_id, epic_desc,user_story_id,user_story_task,epic_status,job_desc,seq_work_id,seq_backlog_id,seq_sprint_job_id,reference_comments,assigned_to,comments) {
        this._dept_id = dept_id;

        this._epic_desc = epic_desc;
        this._user_story_id = user_story_id;
        this._user_story_task = user_story_task;
        this._epic_status = epic_status;
        this._job_desc = job_desc;
        this._seq_work_id = seq_work_id;
        this._seq_backlog_id = seq_backlog_id;
        this._seq_sprint_job_id = seq_sprint_job_id;
        this._reference_comments = reference_comments;
        this._assigned_to = assigned_to;
        this._comments = comments;

    }


    get dept_id() {
        return this._dept_id;
    }

    set dept_id(value) {
        this._dept_id = value;
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


    get job_desc() {
        return this._job_desc;
    }

    set job_desc(value) {
        this._job_desc = value;
    }

    get seq_work_id() {
        return this._seq_work_id;
    }

    set seq_work_id(value) {
        this._seq_work_id = value;
    }

    get seq_backlog_id() {
        return this._seq_backlog_id;
    }

    set seq_backlog_id(value) {
        this._seq_backlog_id = value;
    }


    get epic_status() {
        return this._epic_status;
    }

    set epic_status(value) {
        this._epic_status = value;
    }


    get seq_sprint_job_id() {
        return this._seq_sprint_job_id;
    }

    set seq_sprint_job_id(value) {
        this._seq_sprint_job_id = value;
    }


    get reference_comments() {
        return this._reference_comments;
    }

    set reference_comments(value) {
        this._reference_comments = value;
    }
}

module.exports = SprintVO;