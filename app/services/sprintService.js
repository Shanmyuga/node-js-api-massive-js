let db = require('../../db/dataBase');
const oracledb = require("oracledb");
let DropDown = require('../vo/dropdown');
let BacklogVo = require('../vo/BackLogHistoryVO');
let sprintValueObject = require('../vo/sprintVO');

class sprintService {

    static async delete(req) {
        let id = req.params.id;


        const result = await db.simpleExecute("delete from SCI_BACKLOG_MASTER where seq_backlog_id = :seq_backlog_id", [id], {autoCommit: true});
        return result;
    }

    static async getOne(req) {
        let id = req.params.id;
        let resultArray = new Array();
        const result = await db.simpleExecute("SELECT      bm.dept_id,      bm.epic_desc,      bm.user_story_id,      bm.user_story_task,      sj.user_task_status,      bm.workorder_ref,      bm.seq_work_id,      bm.seq_backlog_id,      sj.seq_sprint_job_id,bm.REFERENCE_EPICS  FROM      sci_backlog_master bm,      sci_sprint_job_details sj  WHERE  sj.seq_backlog_id = bm.seq_backlog_id      and sj.seq_sprint_job_id = :seq_sprint_job_id", [id]);

        result.rows.forEach((row) => {
            resultArray.push(new sprintValueObject(row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7],row[8],row[9]));
        });
        return resultArray;
    }

    static async getDeptSprints(dept) {

        const result = await db.simpleExecute("select  SEQ_SPRINT_ID ,sprint_name  from SCI_SPRINT_MASTER where sysdate between sprint_start_date and sprint_end_Date  and sprint_dept = :dept union  select  SEQ_SPRINT_ID ,sprint_name  from SCI_SPRINT_MASTER where sysdate+7 between sprint_start_date and sprint_end_Date  and sprint_dept = :dept1 union  select  SEQ_SPRINT_ID ,sprint_name  from SCI_SPRINT_MASTER where sysdate+8 between sprint_start_date and sprint_end_Date  and sprint_dept = :dept2", [dept, dept,dept]
        );
        let droparray = new Array();

        result.rows.forEach((row,index) => {
            if(index <2) {
                droparray.push(new DropDown(row[1], row[0]));
            }
        });
        return droparray;
    }


    static async getStoryComments(req) {

        let seqBackLogId = req.params.id;
        const result = await db.simpleExecute("select USER_COMMENTS, (select sprint_name from SCI_SPRINT_JOB_DETAILS jd where scm.SEQ_SPRINT_JOB_ID=jd.SEQ_SPRINT_JOB_ID) as sprint_name, UPDATED_DATE, UPDATED_BY , ASSIGNED_TO from sci_sprint_story_comments scm where seq_backlog_id = :bklog order by updated_Date asc", [seqBackLogId]
        );
        let droparray = new Array();

        result.rows.forEach((row) => {
            droparray.push(new BacklogVo(row[0], row[1],row[2],row[3],row[4]));
        });
        return droparray;
    }
    static async getSprintDataByName(sprintName) {

        const result = await db.simpleExecute("select  bm.dept_id ,bm.epic_desc ,bm.user_story_id ,bm.user_story_task,bm.epic_status ,bm.workorder_ref,bm.seq_work_id ,sj.seq_backlog_id ,sj.seq_sprint_job_id ,bm.REFERENCE_EPICS from Sci_sprint_job_details sj  ,SCI_BACKLOG_MASTER bm where sj.seq_backlog_id = bm.seq_backlog_id and sprint_name = :sprint_name  ", [sprintName]
        );

        let resultArray = new Array();
        result.rows.forEach((row) => {
            resultArray.push(new sprintValueObject(row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8],row[9]));
        });
        return resultArray;
    }

    static async getDept(req) {

        const result = await db.simpleExecute("select distinct dept_id from SCI_STANDARD_EPIC_DATA where dept_id is not null"
        );
        let droparray = new Array();

        result.rows.forEach((row) => {
            droparray.push(new DropDown(row[0], row[0]));
        });
        return droparray;
    }

    static async getUsers(req) {

        const result = await db.simpleExecute("select  user_id||'-'||user_firstname from scigenics_user_master where user_id is not null"
        );
        let droparray = new Array();

        result.rows.forEach((row) => {
            droparray.push(new DropDown(row[0], row[0]));
        });
        return droparray;
    }
    static async getWorkOrders(req) {

        const result = await db.simpleExecute("select job_Desc ,seq_work_id from sci_workorder_master where word_order_Type = 'Fermenter' and wo_status = 'Y'"
        );
        let droparray = new Array();
        const gbp = new DropDown({label: 'GBP', value: 'British Pounds'});
        result.rows.forEach((row) => {
            droparray.push(new DropDown(row[0], row[1]));
        });
        return droparray;
    }

    static async getAll(req, page, pageSize) {
        let active = req.query.active || 'id';
        const order = req.query.order || 'desc';
        let searchByName = req.body.searchByName || req.query.searchByName;
        let searchByWO = req.body.searchByWO || req.query.searchByWO;
        const newPage = (page - 1) * pageSize;
        let searchByNameParam = '%' + searchByName + '%';
        if (searchByNameParam === undefined) {
            searchByNameParam = '%%';
        }
        let searchByWOParam = '%' + searchByWO + '%';
        if (searchByWOParam === undefined) {
            searchByWOParam = '%%';
        }

        let resultArray = new Array();

        const result = await db.simpleExecute("SELECT     ab.dept_id,     ab.epic_desc,     ab.user_story_id,     ab.user_story_task,     ab.user_task_status,     ab.workorder_ref,     ab.seq_work_id,     ab.seq_backlog_id,     ab.seq_sprint_job_id,    ab.REFERENCE_EPICS, ab.assigned_to,     ab.comments FROM     (         SELECT             ROWNUM  AS rn,             sj.seq_sprint_job_id,  bm.REFERENCE_EPICS,           bm.dept_id,             bm.epic_desc,             bm.user_story_id,             bm.user_story_task,             sj.user_task_status,             bm.workorder_ref,             bm.seq_work_id,             sj.seq_backlog_id,             (                 SELECT                     assigned_to                 FROM                     sci_sprint_story_comments cm                 WHERE                     cm.seq_story_rm_id = (                         SELECT                             MAX(seq_story_rm_id)                         FROM                             sci_sprint_story_comments ct                         WHERE                             ct.seq_sprint_job_id = sj.seq_sprint_job_id                     )             )       AS assigned_to,             (                 SELECT                     user_comments                 FROM                     sci_sprint_story_comments cm                 WHERE                     cm.seq_story_rm_id = (                         SELECT                             MAX(seq_story_rm_id)                         FROM                             sci_sprint_story_comments ct                         WHERE                             ct.seq_sprint_job_id = sj.seq_sprint_job_id                     )             )       AS comments         FROM             sci_sprint_job_details  sj,             sci_backlog_master      bm         WHERE                 sj.seq_backlog_id = bm.seq_backlog_id             AND sj.sprint_name LIKE :sprint_name     ) ab WHERE     ab.rn BETWEEN :startlimit AND :endlimit", [searchByNameParam, newPage, parseInt(newPage) + parseInt(pageSize)]
        );
        result.rows.forEach((row) => {
            resultArray.push(new sprintValueObject(row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8],row[9],row[10],row[11]));
        });
        return resultArray;
    }

    static async getAllCount() {
        let result = await db.simpleExecute("select count(1) from sci_backlog_master");
        let total = result.rows[0][0];
        return total;
    }
    static async updateSprintToBackLog(req, id) {



        let seqSprintJobId = req.body.seq_sprint_job_id;
        let seqBackLogId = req.body.seq_backlog_id;

        db.simpleExecute(" update SCI_SPRINT_JOB_DETAILS jb set jb.user_task_status = 'BKLOG',jb.updated_date=sysdate,updated_by =:user_data where jb.seq_sprint_job_id = :seq_sprint_job_id",
            [ req.user,seqSprintJobId], {autoCommit: true});


        db.simpleExecute(" update SCI_BACKLOG_MASTER jb set jb.EPIC_STATUS = 'BKLOG',jb.updated_date=sysdate,updated_by =:user_data where jb.seq_backlog_id = :seq_backlog_id",
            [req.user,seqBackLogId], {autoCommit: true});
        db.simpleExecute(" Insert into SCI_SPRINT_STORY_COMMENTS (SEQ_STORY_RM_ID, SEQ_SPRINT_JOB_ID, USER_COMMENTS, SEQ_BACKLOG_ID, UPDATED_BY, UPDATED_DATE, ASSIGNED_TO) values ( SCI_SPRINT_STORY_COMMENT_SEQ.nextval , :SEQ_SPRINT_JOB_ID,:USER_COMMENTS,:SEQ_BACKLOG_ID,:USER_data,sysdate ,:ASSIGNED_TO)   ",
            [seqSprintJobId, "RETURN TO BACKLOG BY THE SPRINT UPDATE", seqBackLogId, req.user,null], {autoCommit: true});
        return true;
    }

    static async updateStoryToComplete(req, id) {



        let seqSprintJobId = req.body.seq_sprint_job_id;
        let seqBackLogId = req.body.seq_backlog_id;

        db.simpleExecute(" update SCI_SPRINT_JOB_DETAILS jb set jb.user_task_status = 'COMPLETE',jb.updated_date=sysdate,updated_by =:user_data where jb.seq_sprint_job_id = :seq_sprint_job_id",
            [ req.user,seqSprintJobId], {autoCommit: true});


        db.simpleExecute(" update SCI_BACKLOG_MASTER jb set jb.EPIC_STATUS = 'COMPLETE',jb.updated_date=sysdate,updated_by =:user_data where jb.seq_backlog_id = :seq_backlog_id",
            [req.user,seqBackLogId], {autoCommit: true});

        db.simpleExecute(" Insert into SCI_SPRINT_STORY_COMMENTS (SEQ_STORY_RM_ID, SEQ_SPRINT_JOB_ID, USER_COMMENTS, SEQ_BACKLOG_ID, UPDATED_BY, UPDATED_DATE, ASSIGNED_TO) values ( SCI_SPRINT_STORY_COMMENT_SEQ.nextval , :SEQ_SPRINT_JOB_ID,:USER_COMMENTS,:SEQ_BACKLOG_ID,:USER_data,sysdate ,:ASSIGNED_TO)   ",
            [seqSprintJobId, "COMPLETED BY THE SPRINT UPDATE", seqBackLogId, req.user,null], {autoCommit: true});
        return true;
    }
    static async save(req, id) {

        console.log(req.user);
        let dept_id = req.body.dept_id;
        let seqBacklogId = req.body.seq_backlog_id;

        let seqSprintJobId = req.body.seq_sprint_job_id;
        let comments = req.body.comments;
        let referece_comments = req.body.reference_comments;
        let assigned_to = req.body.assigned_to;
            db.simpleExecute(" Insert into SCI_SPRINT_STORY_COMMENTS (SEQ_STORY_RM_ID, SEQ_SPRINT_JOB_ID, USER_COMMENTS, SEQ_BACKLOG_ID, UPDATED_BY, UPDATED_DATE, ASSIGNED_TO) values ( SCI_SPRINT_STORY_COMMENT_SEQ.nextval , :SEQ_SPRINT_JOB_ID,:USER_COMMENTS,:SEQ_BACKLOG_ID,:USER_data,sysdate ,:ASSIGNED_TO)   ",
                [seqSprintJobId, comments, seqBacklogId, req.user,assigned_to], {autoCommit: true});

            if(req.body.action === "close") {
                let seqSprintJobId = req.body.seq_sprint_job_id;
                let seqBackLogId = req.body.seq_backlog_id;

                db.simpleExecute(" update SCI_SPRINT_JOB_DETAILS jb set jb.user_task_status = 'COMPLETE', jb.completed_tasks =:reference_epic,jb.updated_date=sysdate,updated_by =:user_data where jb.seq_sprint_job_id = :seq_sprint_job_id",
                    [ referece_comments,req.user,seqSprintJobId], {autoCommit: true});


                db.simpleExecute(" update SCI_BACKLOG_MASTER jb set jb.EPIC_STATUS = 'COMPLETE',jb.updated_date=sysdate,updated_by =:user_data where jb.seq_backlog_id = :seq_backlog_id",
                    [req.user,seqBackLogId], {autoCommit: true});

                db.simpleExecute(" Insert into SCI_SPRINT_STORY_COMMENTS (SEQ_STORY_RM_ID, SEQ_SPRINT_JOB_ID, USER_COMMENTS, SEQ_BACKLOG_ID, UPDATED_BY, UPDATED_DATE, ASSIGNED_TO) values ( SCI_SPRINT_STORY_COMMENT_SEQ.nextval , :SEQ_SPRINT_JOB_ID,:USER_COMMENTS,:SEQ_BACKLOG_ID,:USER_data,sysdate ,:ASSIGNED_TO)   ",
                    [seqSprintJobId, "COMPLETED BY THE SPRINT UPDATE", seqBackLogId, req.user,null], {autoCommit: true});


                let arrayinternalId = referece_comments.split(',');
                for(let entry of arrayinternalId) {
                    db.simpleExecute(" update SCI_BACKLOG_MASTER jb set jb.EPIC_STATUS = 'COMPLETE',jb.updated_date=sysdate,updated_by =:user_data where jb.seq_backlog_id = :seq_backlog_id",
                        [req.user,entry], {autoCommit: true});

                }
            }

            if(req.body.action === "bklog") {
                let seqSprintJobId = req.body.seq_sprint_job_id;
                let seqBackLogId = req.body.seq_backlog_id;

                db.simpleExecute(" update SCI_SPRINT_JOB_DETAILS jb set jb.user_task_status = 'BKLOG',jb.updated_date=sysdate,updated_by =:user_data where jb.seq_sprint_job_id = :seq_sprint_job_id",
                    [ req.user,seqSprintJobId], {autoCommit: true});


                db.simpleExecute(" update SCI_BACKLOG_MASTER jb set jb.EPIC_STATUS = 'BKLOG',jb.updated_date=sysdate,updated_by =:user_data where jb.seq_backlog_id = :seq_backlog_id",
                    [req.user,seqBackLogId], {autoCommit: true});
                db.simpleExecute(" Insert into SCI_SPRINT_STORY_COMMENTS (SEQ_STORY_RM_ID, SEQ_SPRINT_JOB_ID, USER_COMMENTS, SEQ_BACKLOG_ID, UPDATED_BY, UPDATED_DATE, ASSIGNED_TO) values ( SCI_SPRINT_STORY_COMMENT_SEQ.nextval , :SEQ_SPRINT_JOB_ID,:USER_COMMENTS,:SEQ_BACKLOG_ID,:USER_data,sysdate ,:ASSIGNED_TO)   ",
                    [seqSprintJobId, "RETURN TO BACKLOG BY THE SPRINT UPDATE", seqBackLogId, req.user,null], {autoCommit: true});
            }

        return true;
    }

    static async saveSprint(req, id) {


        let seq_sprint_id = req.body.seq_sprint_id;
        let seq_backlog_id = req.body.seq_backlog_id;


        db.simpleExecute("insert into  SCI_SPRINT_JOB_DETAILS( SEQ_SPRINT_JOB_ID, SEQ_SPRINT_NO, SEQ_BACKLOG_ID, INSERTED_DATE, INSERTED_BY, USER_TASK_STATUS, USER_COMMENTS, UPDATED_BY, UPDATED_DATE) values (SCI_SPRINT_JOB_DETAILS_SEQ.nextval,:SEQ_SPRINT_NO,:SEQ_BACKLOG_ID,sysdate,:INSERTED_BY,'IN_SPRINT',null,:UPDATED_BY,sysdate)", [seq_sprint_id, seq_backlog_id, req.user, req.user], {autoCommit: true});
        db.simpleExecute("update SCI_BACKLOG_MASTER set EPIC_STATUS = 'IN_SPRINT' ,updated_by = :updated_by,updated_date = sysdate where seq_backlog_id = :seq_backlog_id ",
            [req.user, seq_backlog_id], {autoCommit: true});


        return true;
    }
}

module.exports = sprintService;