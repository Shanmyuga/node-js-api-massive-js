let db = require('../../db/dataBase');
const oracledb = require("oracledb");
let DropDown = require('../vo/dropdown');
let BackLogValueObject = require('../vo/backlogVo');
class BacklogService {

    static async delete(req) {
        let id = req.params.id;


        const result = await db.simpleExecute("delete from SCI_BACKLOG_MASTER where seq_backlog_id = :seq_backlog_id",[id],{ autoCommit: true });
        return result;
    }

    static async getOne(req) {
        let id = req.params.id;
        let resultArray = new Array();
        const result = await db.simpleExecute("select dept_id, epic_desc,stage_desc,user_story_id, user_story_task ,epic_status,workorder_ref,seq_work_id,seq_backlog_id from SCI_BACKLOG_MASTER where SEQ_BACKLOG_ID = :SEQ_BACKLOG_ID",[id]);

        result.rows.forEach((row) => {
            resultArray.push(new BackLogValueObject(row[0],row[1],row[2],row[3],row[4],row[5],row[6],row[7],row[8]));
        });
        return resultArray;
    }

    static async getDeptSprints(dept) {

        const result = await db.simpleExecute("select  SEQ_SPRINT_ID ,sprint_name  from SCI_SPRINT_MASTER where sysdate between sprint_start_date and sprint_end_Date  and sprint_dept = :dept union  select  SEQ_SPRINT_ID ,sprint_name  from SCI_SPRINT_MASTER where sysdate+7 between sprint_start_date and sprint_end_Date  and sprint_dept = :dept1 union  select  SEQ_SPRINT_ID ,sprint_name  from SCI_SPRINT_MASTER where sysdate+8 between sprint_start_date and sprint_end_Date  and sprint_dept = :dept2",[dept,dept,dept]
        );
        let droparray = new Array();

        result.rows.forEach((row,index) => {
            if(index <2) {
                droparray.push(new DropDown(row[1], row[0]));
            }
        });

        return droparray;
    }
    static async getDept(req) {

        const result = await db.simpleExecute("select distinct dept_id from SCI_STANDARD_EPIC_DATA where dept_id is not null"
        );
        let droparray = new Array();

        result.rows.forEach((row) => {
            droparray.push(new DropDown(row[0],row[0]));
        });
        return droparray;
    }

    static async getWorkOrders(req) {

        const result = await db.simpleExecute("select job_Desc ,seq_work_id from sci_workorder_master where word_order_Type = 'Fermenter' and wo_status = 'Y'"
        );
        let droparray = new Array();
        const gbp = new DropDown({ label: 'GBP', value: 'British Pounds' });
        result.rows.forEach((row) => {
            droparray.push(new DropDown(row[0],row[1]));
        });
        return droparray;
    }

    static async getWorkOrdersInBacklog(req) {

        const result = await db.simpleExecute("select job_Desc ,seq_work_id from sci_workorder_master where word_order_Type = 'Fermenter' and wo_status = 'Y' and seq_work_id in (select seq_work_id from sci_backlog_master where epic_status = 'BKLOG')"
        );
        let droparray = new Array();
        const gbp = new DropDown({ label: 'GBP', value: 'British Pounds' });
        result.rows.forEach((row) => {
            droparray.push(new DropDown(row[0],row[1]));
        });
        return droparray;
    }
    static async getAll(req, page, pageSize) {
        let active = req.query.active || 'epic_desc';

        const order = req.query.order || 'desc';
        let searchByDept = req.body.searchByDept || req.query.searchByDept;
        let searchByDesc = req.body.searchByDesc || req.query.searchByDesc;
        let searchByWork = req.body.searchByWork || req.query.searchByWork;
        let searchByTaskDesc = req.body.searchByTaskDesc || req.query.searchByTaskDesc;
        let searchByWorkDesc = req.body.searchByWorkDesc || req.query.searchByWorkDesc;
        let searchByStageDesc = req.body.searchByStageDesc || req.query.searchByStageDesc;
        let searchByStatus = req.body.searchByStatus || req.query.searchByStatus;
        const newPage = (page - 1) * pageSize;
        let searchByDeptParam = '%' + searchByDept + '%';
        if (searchByDeptParam === undefined) {
            searchByDeptParam = '%%';
        }

        let searchByDescParam = '%' + searchByDesc + '%';
        if (searchByDescParam === undefined) {
            searchByDescParam = '%%';
        }

        let searchByWorkDescParam = '%' + searchByWorkDesc + '%';
        if (searchByWorkDescParam === undefined) {
            searchByWorkDescParam = '%%';
        }
        let searchByWorkParam = '%' + searchByWork + '%';
        if (searchByWorkParam === undefined) {
            searchByWorkParam = '%%';
        }
        let searchByStageDescParam = '%' + searchByStageDesc + '%';
        if (searchByStageDescParam === undefined) {
            searchByStageDescParam = '%%';
        }
        let searchByTaskDescParam = '%' + searchByTaskDesc + '%';
        if (searchByTaskDescParam === undefined) {
            searchByTaskDescParam = '%%';
        }
        let resultArray = new Array();
        let query = 'select ab.dept_id ,ab.epic_desc,ab.stage_desc, ab.user_story_id,ab.user_story_task ,ab.epic_status ,ab.workorder_ref,ab.seq_work_id,ab.seq_backlog_id ,SPRINT_COUNT,REFERENCE_EPICS from  (select rownum as rn ,dept_id,epic_desc, stage_desc, user_story_id,user_story_task,epic_status ,workorder_ref,seq_work_id,seq_backlog_id,(Select count(1) from sci_sprint_job_details jb where jb.seq_backlog_id = bm.seq_backlog_id ) as SPRINT_COUNT,REFERENCE_EPICS from SCI_BACKLOG_MASTER bm where epic_status =:search0 and  dept_id like :search1 and epic_desc like :search2 and seq_work_id like :search3  and workorder_ref like :search4 and ( stage_desc like :search5 or stage_Desc is null) and user_story_task like :search6 order by ' + active + ' ' + order + ' ) ab where ab.rn between :startlimit and :endlimit ';
        console.log(query);
        const result = await db.simpleExecute(query, [searchByStatus, searchByDeptParam, searchByDescParam, searchByWorkParam, searchByWorkDescParam,searchByStageDescParam, searchByTaskDescParam,newPage, parseInt(newPage) + parseInt(pageSize)]
        );
        result.rows.forEach((row) => {
            {
                resultArray.push(new BackLogValueObject(row[0], row[1], row[2], row[3], row[4], row[5], row[6], row[7], row[8], row[9], row[10],row[11]));
            }
        });
            return resultArray;
        }


    static async getAllCount(req) {

        let searchByStatus = req.body.searchByStatus || req.query.searchByStatus;
        let searchByDept = req.body.searchByDept || req.query.searchByDept;
        let searchByDesc = req.body.searchByDesc || req.query.searchByDesc;
        let searchByWork = req.body.searchByWork || req.query.searchByWork;
        let searchByWorkDesc = req.body.searchByWorkDesc || req.query.searchByWorkDesc;
        let searchByDeptParam = '%'+searchByDept+'%';
        if (searchByDeptParam === undefined) {searchByDeptParam = '%%';}

        let searchByDescParam = '%'+searchByDesc+'%';
        if (searchByDescParam === undefined) {searchByDescParam = '%%';}
        let searchByWorkDescParam = '%'+searchByWorkDesc+'%';
        if (searchByWorkDescParam === undefined) {searchByWorkDescParam = '%%';}
        let searchByWorkParam = '%'+searchByWork+'%';
        if (searchByWorkParam === undefined) {searchByWorkParam = '%%';}
        let result = await db.simpleExecute("select count(1) from sci_backlog_master where epic_status =:search0 and  dept_id like :search1 and epic_desc like :search2 and seq_work_id like :search3  and workorder_ref like :search4",[searchByStatus,searchByDeptParam,searchByDescParam,searchByWorkParam,searchByWorkDescParam]);
        let total = result.rows[0][0];
        return total;
    }

    static async save(req, id) {

        console.log(req.user);
        let dept_id = req.body.dept_id;
        let workOrderDesc = req.body.workOrder_desc;

        let standardEpicId = req.body.standard_epic_id;

        standardEpicId.forEach(row => {
            d
            db.simpleExecute("delete from sci_backlog_master where DEPT_ID=:dept_id and user_story_id =:story_id",[dept_id,row],{autoCommit:true});
            db.simpleExecute("    INSERT INTO \"SCIGENICS\".\"SCI_BACKLOG_MASTER\" (          seq_backlog_id,          dept_id,          user_story_task_desc,          epic_desc,          user_story_id,          created_date,          created_by,          epic_status,          updated_by,          updated_date,          workorder_ref     ,seq_work_id ) VALUES (          sci_backlog_master_seq.NEXTVAL,          :dept_id,          (select epic_desc||'-'|| stage_desc|| '-' || user_story_task  from SCI_STANDARD_EPIC_DATA where user_Story_id = :user_Story_id),        (select epic_desc from SCI_STANDARD_EPIC_DATA where user_Story_id = :user_Story_id),          :user_story_id,          sysdate,         :logged_in_user,         'BKLOG',           :logged_in_user,        sysdate,          :work_order_ref,          (select seq_work_id from SCI_WORKORDER_MASTER where job_desc = :work_order_ref)      )",
                [dept_id,row,row,row,req.user,req.user,workOrderDesc,workOrderDesc] ,{ autoCommit: true });
        });

        return true;
    }
    static async saveSprint(req, id) {


        let seq_sprint_id = req.body.seq_sprint_id;
        let seq_backlog_id = req.body.seq_backlog_id;


           const result =  await db.simpleExecute("select seq_sprint_id from SCI_SPRINT_JOB_DETAILS where SEQ_SPRINT_ID=:seq_sprint_id and seq_backlog_id = :seq_backlog_id",[seq_sprint_id,seq_backlog_id]);
           if(result.rows.length > 0) {
               db.simpleExecute("update SCI_SPRINT_JOB_DETAILS set user_task_status = 'IN_SPRINT' where SEQ_SPRINT_ID = :seq_sprint_id and seq_backlog_id = :seq_backlog_id  ",[seq_sprint_id,seq_backlog_id],{autocommit:true});

           }
           else {
               db.simpleExecute("insert into  SCI_SPRINT_JOB_DETAILS( SEQ_SPRINT_JOB_ID, SEQ_SPRINT_ID, SEQ_BACKLOG_ID, INSERTED_DATE, INSERTED_BY, USER_TASK_STATUS, ASSIGNED_TO, UPDATED_BY,updated_date,SPRINT_NAME) values (SCI_SPRINT_JOB_DETAILS_SEQ.nextval,:SEQ_SPRINT_NO,:SEQ_BACKLOG_ID,sysdate,:INSERTED_BY,'IN_SPRINT',null,:UPDATED_BY,sysdate,(select sprint_name from sci_sprint_master where seq_Sprint_id = :seq_Sprint))",[seq_sprint_id,seq_backlog_id,req.user,req.user,seq_sprint_id],{autoCommit:true});
               db.simpleExecute(" Insert into SCI_SPRINT_STORY_COMMENTS (SEQ_STORY_RM_ID, SEQ_SPRINT_JOB_ID, USER_COMMENTS, SEQ_BACKLOG_ID, UPDATED_BY, UPDATED_DATE, ASSIGNED_TO) values ( SCI_SPRINT_STORY_COMMENT_SEQ.nextval , (select max(SEQ_SPRINT_JOB_ID) from SCI_SPRINT_JOB_DETAILS jd where jd.SEQ_BACKLOG_ID=:bklogId ),:USER_COMMENTS,:SEQ_BACKLOG_ID,:USER_data,sysdate ,:ASSIGNED_TO)   ",
                   [ seq_backlog_id,"ADDED TO SPRINT BY THE SPRINT UPDATE", seq_backlog_id, req.user,null], {autoCommit: true});

           }
            db.simpleExecute("update SCI_BACKLOG_MASTER set EPIC_STATUS = 'IN_SPRINT' ,updated_by = :updated_by,updated_date = sysdate where seq_backlog_id = :seq_backlog_id ",
                [req.user,seq_backlog_id] ,{ autoCommit: true });


        return true;
    }
}

module.exports = BacklogService;
