let db = require('../../db/dataBase');
const oracledb = require("oracledb");
let DropDown = require('../vo/dropdown');
let bulletinVo = require('../vo/bulletinVO');

class bulletinService {

    static async delete(req) {
        let id = req.params.id;


        const result = await db.simpleExecute("delete from SCI_BACKLOG_MASTER where seq_backlog_id = :seq_backlog_id", [id], {autoCommit: true});
        return result;
    }

    static async getOne(req) {
        let id = req.params.id;
        let resultArray = new Array();

        return resultArray;
    }

    static async getDeptSprints(dept) {

        const result = await db.simpleExecute("select  SEQ_SPRINT_ID ,sprint_name  from SCI_SPRINT_MASTER where sysdate between sprint_start_date and sprint_end_Date  and sprint_dept = :dept union all select  SEQ_SPRINT_ID ,sprint_name  from SCI_SPRINT_MASTER where sysdate+7 between sprint_start_date and sprint_end_Date  and sprint_dept = :dept1", [dept, dept]
        );
        let droparray = new Array();

        result.rows.forEach((row) => {
            droparray.push(new DropDown(row[1], row[0]));
        });
        return droparray;
    }






    static async getAll(req, page, pageSize) {
        let active = req.query.active || 'id';
        const order = req.query.order || 'desc';
        let searchByDept = req.body.searchByDept || req.query.searchByDept;

        const newPage = (page - 1) * pageSize;
        let searchByDeptParam = '%' + searchByDept + '%';
        if (searchByDeptParam === undefined) {
            searchByDeptParam = '%%';
        }


        let resultArray = new Array();

        const result = await db.simpleExecute("SELECT        ab.created_by,        ab.message,        ab.assigned_to,        ab.ack_by,        ab.job_desc,        ab.targetdate,       ab.seq_dept_message_id    FROM        (            SELECT                ROWNUM  AS rn,              created_by,        message,        assigned_to,        ack_by,        job_desc,        to_char(target_date, 'dd-MM-yyyy') as targetdate,        seq_dept_message_id            FROM                sci_dept_messages  sj                where assigned_to like :dept_id                                   ) ab    WHERE        ab.rn BETWEEN :startlimit AND :endlimit", [searchByDeptParam, newPage, parseInt(newPage) + parseInt(pageSize)]
        );
        result.rows.forEach((row) => {
            resultArray.push(new sprintValueObject(row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8],row[9],row[10]));
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
        return true;
    }

    static async updateStoryToComplete(req, id) {



        let seqSprintJobId = req.body.seq_sprint_job_id;
        let seqBackLogId = req.body.seq_backlog_id;

        db.simpleExecute(" update SCI_SPRINT_JOB_DETAILS jb set jb.user_task_status = 'COMPLETE',jb.updated_date=sysdate,updated_by =:user_data where jb.seq_sprint_job_id = :seq_sprint_job_id",
            [ req.user,seqSprintJobId], {autoCommit: true});


        db.simpleExecute(" update SCI_BACKLOG_MASTER jb set jb.EPIC_STATUS = 'COMPLETE',jb.updated_date=sysdate,updated_by =:user_data where jb.seq_backlog_id = :seq_backlog_id",
            [req.user,seqBackLogId], {autoCommit: true});
        return true;
    }
    static async save(req, id) {

        console.log(req.user);
        let message = req.body.message;
        let deptAssignedTo = req.body.dept_assigned_to;

        let targetDate = req.body.target_date;
        let jobDesc = req.body.job_desc

        db.simpleExecute(" insert into SCI_DEPT_MESSAGES(SEQ_DEPT_MESS_ID, CREATED_BY, MESSAGE, ASSIGNED_TO, ACK_DATE, ACK_BY, INSERTED_BY,  UPDATED_BY, UPDATED_DATE, SEQ_WORK_ID, JOB_DESC, TARGET_DATE, ACK_STATUS, ACK_COMMENTS) values  (SCI_DEPT_MESSAGE_SEQ.nextval,:CREATED_BY,:MESSAGE,:ASSIGNED_TO,null,null,:INSERTED_BY,:updated_by,sysdate,(select seq_work_id from SCI_WORKORDER_MASTER where job_desc = :work_order_ref) ,:job_desc,to_date(:target_date,'dd-MM-YYYY'),null,null )  ",
            [req.user, message, deptAssignedTo, req.user,req.user,jobDesc,jobDesc,targetDate], {autoCommit: true});

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

module.exports = bulletinService;
