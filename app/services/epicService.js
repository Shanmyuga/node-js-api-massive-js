let db = require('../../db/dataBase');
const oracledb = require("oracledb");
let DropDown = require('../vo/dropdown');
let EpicValueObject = require('../vo/epicValueObject');
class epicService {

    static async delete(req) {
        let id = req.params.id;
        let client = {
            id: id,
            deleted_at: new Date()
        }

        const result = await db.simpleExecute("delete from sc")
        return result;
    }

    static async getOne(req) {
        let id = req.params.id;
        let resultArray = new Array();
        const result = await db.simpleExecute("select dept_id, epic_id,epic_desc,user_story_id, user_story_task  from sci_standard_epic_Data where user_Story_id = :user_story_id",[id]);

        result.rows.forEach((row) => {
            resultArray.push(new EpicValueObject(row[0],row[1],row[2],row[3],row[4]));
        });
        return resultArray;
    }

    static async getTaskByEpic(epicId) {

        const result = await db.simpleExecute("select epic_desc||'-'|| stage_desc|| '-' || user_story_task ,user_Story_id from SCI_STANDARD_EPIC_DATA where epic_id = :epic_id",[epicId]
        );
        let droparray = new Array();

        result.rows.forEach((row) => {
            droparray.push(new DropDown(row[0],row[1]));
        });
        return droparray;
    }

    static async getEpicByDepts(dept) {

        const result = await db.simpleExecute("select distinct epic_desc ,epic_id from SCI_STANDARD_EPIC_DATA where dept_id = :epic_dept",[dept]
        );
        let droparray = new Array();

        result.rows.forEach((row) => {
            droparray.push(new DropDown(row[0],row[1]));
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
    static async getAll(req, page, pageSize) {
        let active = req.query.active || 'id';
        const order = req.query.order || 'desc';
        let search = req.body.search || req.query.search;
        const newPage = (page -1) * pageSize;
        let searchParam = '%'+search+'%';
        if (search === undefined) {search = '%%';}
        let resultArray = new Array();

        const result = await db.simpleExecute("select ab.dept_id,ab.epic_id ,ab.epic_desc, ab.user_story_id,ab.user_story_task from  (select rownum as rn ,dept_id,epic_id ,epic_desc, user_story_id,user_story_task from sci_Standard_epic_Data  where (dept_id like :search1 or user_story_id like :search2 or epic_desc like :search3)  ) ab where ab.rn between :startlimit and :endlimit ",[searchParam,searchParam,searchParam,newPage,parseInt(newPage) +parseInt(pageSize)]
        );
        result.rows.forEach((row) => {
            resultArray.push(new EpicValueObject(row[0],row[1],row[2],row[3],row[4]));
        });
        return resultArray;
    }

    static async getAllCount() {
        let result = await db.simpleExecute("select count(1) from sci_Standard_epic_Data");
        let total = result.rows[0][0];
        return total;
    }

    static async save(req, id) {

        console.log(req.user);
      let dept_id = req.body.dept_id;
      let workOrderDesc = req.body.workOrder_desc;

      let standardEpicId = req.body.standard_epic_id;

        standardEpicId.forEach(row => {
            db.simpleExecute("delete from sci_backlog_master where DEPT_ID=:dept_id and user_story_id =:story_id",[dept_id,row],{autoCommit:true});
            db.simpleExecute("    INSERT INTO \"SCIGENICS\".\"SCI_BACKLOG_MASTER\" (          seq_backlog_id,          dept_id,          user_story_task,          epic_desc,          user_story_id,          created_date,          created_by,          epic_status,          updated_by,          updated_date,          workorder_ref     ,seq_work_id ) VALUES (          sci_backlog_master_seq.NEXTVAL,          :dept_id,          (select epic_desc||'-'|| stage_desc|| '-' || user_story_task  from SCI_STANDARD_EPIC_DATA where user_Story_id = :user_Story_id),        (select epic_desc from SCI_STANDARD_EPIC_DATA where user_Story_id = :user_Story_id),          :user_story_id,          sysdate,         :logged_in_user,         'BKLOG',           :logged_in_user,        sysdate,          :work_order_ref,          (select seq_work_id from SCI_WORKORDER_MASTER where job_desc = :work_order_ref)      )",
                [dept_id,row,row,row,req.user,req.user,workOrderDesc,workOrderDesc] ,{ autoCommit: true });

        });

        return true;
    }

    static async saveCustom(req, id) {

        console.log(req.user);
        let dept_id = req.body.dept_id;
        let workOrderDesc = req.body.workOrder_desc;
        let user_story_id = req.body.custom_user_story_id;
        let user_story_desc = req.body.custom_user_story_desc;
        let standardEpicId = req.body.standard_epic_id;


            db.simpleExecute("delete from sci_backlog_master where DEPT_ID=:dept_id and user_story_id =:story_id",[dept_id,user_story_id],{autoCommit:true});
            db.simpleExecute("    INSERT INTO \"SCIGENICS\".\"SCI_BACKLOG_MASTER\" (          seq_backlog_id,          dept_id,          user_story_task,          epic_desc,          user_story_id,          created_date,          created_by,          epic_status,          updated_by,          updated_date,          workorder_ref     ,seq_work_id ) VALUES (          sci_backlog_master_seq.NEXTVAL,          :dept_id,        :user_story_task_desc,        (select distinct epic_desc from SCI_STANDARD_EPIC_DATA where epic_id = :epic_id),          :user_story_id,          sysdate,         :logged_in_user,         'BKLOG',           :logged_in_user,        sysdate,          :work_order_ref,          (select seq_work_id from SCI_WORKORDER_MASTER where job_desc = :work_order_ref)      )",
                [dept_id,user_story_desc,standardEpicId,user_story_id,req.user,req.user,workOrderDesc,workOrderDesc] ,{ autoCommit: true });



        return true;
    }

    static async saveAll(req, id) {

        console.log(req.user);

        let workOrderDesc = req.body.workOrder_desc;



        
        db.simpleExecute(" insert into SCI_BACKLOG_MASTER (SEQ_BACKLOG_ID, DEPT_ID, USER_STORY_TASK, EPIC_DESC, USER_STORY_ID, CREATED_DATE, CREATED_BY, EPIC_STATUS, UPDATED_BY, UPDATED_DATE, WORKORDER_REF, SEQ_WORK_ID,SUMMARY_ID,MILESTONE)      (select SCI_BACKLOG_MASTER_SEQ.nextval ,    DEPT_ID,  nvl(USER_STORY_TASK,'NA'),  EPIC_DESC,  USER_STORY_ID,      sysdate,  :CREATED_BY,  'BKLOG',  :updated_by,  sysdate,:job_Dec,  (select seq_work_id from SCI_WORKORDER_MASTER where job_Desc = :jobdesc) ,summary_id ,milestone   from SCI_STANDARD_EPIC_DATA st where USER_STORY_ID not in (select USER_STORY_ID from SCI_BACKLOG_MASTER bm where bm.workorder_ref = :workorder_ref)) ",
            [req.user,req.user,workOrderDesc,workOrderDesc,workOrderDesc] ,{ autoCommit: true });

        db.simpleExecute(" insert into SCI_WORKORDER_MILESTONE (SEQ_WORK_MILE_ID, MILESTONE,  SEQ_WORK_ID,   UPDATED_BY, UPDATED_DATE ) (select SCI_WORKORDER_MILESTONE_SEQ.nextval,a.milestone, (select seq_work_id from SCI_WORKORDER_MASTER where job_Desc = :jobdesc) ,'system',sysdate from (select distinct milestone from sci_project_milestone_tasks) a ) ",
            [workOrderDesc] ,{ autoCommit: true });

        return true;
    }
}

module.exports = epicService;