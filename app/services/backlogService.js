let db = require('../../db/dataBase');
const oracledb = require("oracledb");
let DropDown = require('../vo/dropdown');
let BackLogValueObject = require('../vo/backlogVo');
class epicService {

    static async delete(req) {
        let id = req.params.id;
        let client = {
            id: id,
            deleted_at: new Date()
        }

        const result = await db.connection.execute("delete from sc")
        return result;
    }

    static async getOne(req) {
        let id = req.params.id;
        let resultArray = new Array();
        const result = await db.connection.execute("select dept_id, epic_id,epic_desc,user_story_id, user_story_task  from sci_standard_epic_Data where user_Story_id = :user_story_id",[id]);

        result.rows.forEach((row) => {
            resultArray.push(new BackLogValueObject(row[0],row[1],row[2],row[3],row[4]));
        });
        return resultArray;
    }

    static async getDeptWorkorder(dept) {

        const result = await db.connection.execute("select epic_desc||'-'|| stage_desc|| '-' || user_story_task ,user_Story_id from SCI_STANDARD_EPIC_DATA where dept_id = :epic_dept",[dept]
        );
        let droparray = new Array();

        result.rows.forEach((row) => {
            droparray.push(new DropDown(row[0],row[1]));
        });
        return droparray;
    }
    static async getDept(req) {

        const result = await db.connection.execute("select distinct dept_id from SCI_STANDARD_EPIC_DATA where dept_id is not null"
        );
        let droparray = new Array();

        result.rows.forEach((row) => {
            droparray.push(new DropDown(row[0],row[0]));
        });
        return droparray;
    }

    static async getWorkOrders(req) {

        const result = await db.connection.execute("select job_Desc ,seq_work_id from SCIGEN.sci_workorder_master where word_order_Type = 'Fermenter' and wo_status = 'Y'"
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
        let searchByDept = req.body.searchByDept || req.query.searchByDept;
        let searchByDesc = req.body.searchByDesc || req.query.searchByDesc;
        let searchByWork = req.body.searchByWork || req.query.searchByWork;
        const newPage = (page -1) * pageSize;
        let searchByDeptParam = '%'+searchByDept+'%';
        if (searchByDeptParam === undefined) {searchByDeptParam = '%%';}

        let searchByDescParam = '%'+searchByDesc+'%';
        if (searchByDescParam === undefined) {searchByDescParam = '%%';}
        let searchByWorkParam = '%'+searchByWork+'%';
        if (searchByWorkParam === undefined) {searchByWorkParam = '%%';}
        let resultArray = new Array();

        const result = await db.connection.execute("select ab.dept_id ,ab.epic_desc, ab.user_story_id,ab.user_story_task ,ab.epic_status ,ab.workorder_ref,ab.seq_work_id from  (select rownum as rn ,dept_id,epic_desc, user_story_id,user_story_task,epic_status ,workorder_ref,seq_work_id from SCI_BACKLOG_MASTER  where dept_id like :search1 and user_story_task like :search2 and seq_work_id like :search3 ) ab where ab.rn between :startlimit and :endlimit ",[searchByDeptParam,searchByDescParam,searchByWorkParam,newPage,parseInt(newPage) +parseInt(pageSize)]
        );
        result.rows.forEach((row) => {
            resultArray.push(new BackLogValueObject(row[0],row[1],row[2],row[3],row[4],row[5],row[6],row[7]));
        });
        return resultArray;
    }

    static async getAllCount() {
        let result = await db.connection.execute("select count(1) from sci_backlog_master");
        let total = result.rows[0][0];
        return total;
    }

    static async save(req, id) {

        console.log(req.user);
        let dept_id = req.body.dept_id;
        let workOrderDesc = req.body.workOrder_desc;

        let standardEpicId = req.body.standard_epic_id;

        standardEpicId.forEach(row => {
            db.connection.execute("delete from sci_backlog_master where DEPT_ID=:dept_id and user_story_id =:story_id",[dept_id,row],{autoCommit:true});
            db.connection.execute("    INSERT INTO \"SCIGENICS\".\"SCI_BACKLOG_MASTER\" (          seq_backlog_id,          dept_id,          user_story_task_desc,          epic_desc,          user_story_id,          created_date,          created_by,          epic_status,          updated_by,          updated_date,          workorder_ref     ,seq_work_id ) VALUES (          sci_backlog_master_seq.NEXTVAL,          :dept_id,          (select epic_desc||'-'|| stage_desc|| '-' || user_story_task  from SCI_STANDARD_EPIC_DATA where user_Story_id = :user_Story_id),        (select epic_desc from SCI_STANDARD_EPIC_DATA where user_Story_id = :user_Story_id),          :user_story_id,          sysdate,         :logged_in_user,         'BKLOG',           :logged_in_user,        sysdate,          :work_order_ref,          (select seq_work_id from SCI_WORKORDER_MASTER where job_desc = :work_order_ref)      )",
                [dept_id,row,row,row,req.user,req.user,workOrderDesc,workOrderDesc] ,{ autoCommit: true });
        });

        return true;
    }

}

module.exports = epicService;