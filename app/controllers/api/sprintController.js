let express = require('express');
let router = express.Router();
let asyncHandler = require('../../utils/asyncHandler');
let sprintService = require('../../services/sprintService');
let {authJwt} = require('../../middlewares/authMiddleware');

router.get(
    '/find/:id',
    authJwt(),
    asyncHandler(async (req, res) => {
        const result = await sprintService.getOne(req);

        if (result.length === 0) { res.send({success:false, message:res.__('api.client.get.error')}); }
        else { res.send({success: true, data: result}); }
    })
);

router.get(
    '/all',
    authJwt(),
    asyncHandler(async (req, res) => {
        const page = req.body.page || req.query.page || 1;
        const pageSize = req.body.pageSize || req.query.pageSize || 10;
        const result = await sprintService.getAll(req, page, pageSize);

        if (result.length === 0) {
            res.send({success:false, message:res.__('api.client.get.empty')});
        } else {
            let total = await sprintService.getAllCount();
            res.send({success: true, data: result, total: total, pageSize, page: page});
        }
    })
);


router.get(
    '/dept/all',
    // authJwt(),
    asyncHandler(async (req, res) => {
        const result = await epicService.getDept(req);

        if (result.length === 0) { res.send({success:false, message:res.__('api.epic.get.error')}); }
        else { res.send({success: true, data: result}); }
    })
);

router.get(
    '/dept/sprint',
    authJwt(),
    asyncHandler(async (req, res) => {
        const result = await sprintService.getDeptSprints(req.query.dept);

        if (result.length === 0) { res.send({success:false, message:res.__('api.epic.get.error')}); }
        else { res.send({success: true, data: result}); }
    })
);


router.get(
    '/name/all',
    authJwt(),
    asyncHandler(async (req, res) => {
        const result = await sprintService.getSprintDataByName(req.query.sprintName);

        if (result.length === 0) { res.send({success:false, message:res.__('api.epic.get.error')}); }
        else { res.send({success: true, data: result}); }
    })
);
router.get(
    '/workorder/all',
    authJwt(),
    asyncHandler(async (req, res) => {
        const result = await epicService.getWorkOrders(req);

        if (result.length === 0) { res.send({success:false, message:res.__('api.epic.get.error')}); }
        else { res.send({success: true, data: result}); }
    })
);

router.get(
    '/story/comments/:id',
    authJwt(),
    asyncHandler(async (req, res) => {
        const result = await sprintService.getStoryComments(req);

        if (result.length === 0) { res.send({success:false, message:res.__('api.epic.get.error')}); }
        else { res.send({success: true, data: result}); }
    })
);

router.get(
    '/users/all',
    authJwt(),
    asyncHandler(async (req, res) => {
        const result = await sprintService.getUsers(req);

        if (result.length === 0) { res.send({success:false, message:res.__('api.epic.get.error')}); }
        else { res.send({success: true, data: result}); }
    })
);
router.post(
    '/save',
    authJwt(),
    asyncHandler(async (req, res) => {
        req.checkBody('seq_sprint_job_id').trim().notEmpty();
        req.checkBody('seq_backlog_id').trim().notEmpty();

        let errors = req.validationErrors();

        if (errors) {
            res.send({
                success: false,
                message: res.__('api.client.fields.empty')
            });
        } else {
            const id = req.body.id;

            const result = await sprintService.save(req, id);

            if (result) {
                res.send({
                    success: true,
                    message: res.__((id ? 'api.client.update.success' : 'api.client.save.success'))
                });
            } else {
                res.send({
                    success: false,
                    message: res.__((id ? 'api.client.update.error' : 'api.client.save.error'))
                });
            }
        }
    })
);

router.post(
    '/updateBkLog',
    authJwt(),
    asyncHandler(async (req, res) => {
        req.checkBody('seq_sprint_job_id').trim().notEmpty();


        let errors = req.validationErrors();

        if (errors) {
            res.send({
                success: false,
                message: res.__('api.client.fields.empty')
            });
        } else {
            const id = req.body.id;

            const result = await sprintService.updateSprintToBackLog(req, id);

            if (result) {
                res.send({
                    success: true,
                    message: res.__((id ? 'api.client.update.success' : 'api.client.save.success'))
                });
            } else {
                res.send({
                    success: false,
                    message: res.__((id ? 'api.client.update.error' : 'api.client.save.error'))
                });
            }
        }
    })
);


router.post(
    '/closeStory',
    authJwt(),
    asyncHandler(async (req, res) => {
        req.checkBody('seq_sprint_job_id').trim().notEmpty();


        let errors = req.validationErrors();

        if (errors) {
            res.send({
                success: false,
                message: res.__('api.client.fields.empty')
            });
        } else {
            const id = req.body.id;

            const result = await sprintService.updateStoryToComplete(req, id);

            if (result) {
                res.send({
                    success: true,
                    message: res.__((id ? 'api.client.update.success' : 'api.client.save.success'))
                });
            } else {
                res.send({
                    success: false,
                    message: res.__((id ? 'api.client.update.error' : 'api.client.save.error'))
                });
            }
        }
    })
);


router.post(
    '/saveSprint',
    authJwt(),
    asyncHandler(async (req, res) => {
        req.checkBody('seq_sprint_id').trim().notEmpty();
        req.checkBody('seq_backlog_id').trim().notEmpty();

        let errors = req.validationErrors();

        if (errors) {
            res.send({
                success: false,
                message: res.__('api.baclog.fields.empty')
            });
        } else {
            const id = req.body.id;
            console.log("body " + id);
            const result = await backLogService.saveSprint(req, id);

            if (result) {
                res.send({
                    success: true,
                    message: res.__((id ? 'api.client.update.success' : 'api.client.save.success'))
                });
            } else {
                res.send({
                    success: false,
                    message: res.__((id ? 'api.client.update.error' : 'api.client.save.error'))
                });
            }
        }
    })
);
router.delete(
    '/delete/:id',
    authJwt(),
    asyncHandler(async (req, res, next) => {
        const result = await backLogService.delete(req);

        if (result!==null) {
            res.send({success: true, message: res.__('api.client.delete.succes')});
        } else {
            res.send({success: false, message: res.__('api.client.delete.error')});
        }
    })
);

module.exports = router;
