let express = require('express');
let router = express.Router();
let asyncHandler = require('../../utils/asyncHandler');
let bulletinService = require('../../services/bulletinService');
let {authJwt} = require('../../middlewares/authMiddleware');

router.get(
    '/find/:id',
    authJwt(),
    asyncHandler(async (req, res) => {
        const result = await bulletinService.getOne(req);

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
        const result = await bulletinService.getAll(req, page, pageSize);

        if (result.length === 0) {
            res.send({success:false, message:res.__('api.client.get.empty')});
        } else {
            let total = await sprintService.getAllCount();
            res.send({success: true, data: result, total: total, pageSize, page: page});
        }
    })
);









router.post(
    '/save',
    authJwt(),
    asyncHandler(async (req, res) => {


        let errors = req.validationErrors();

        if (errors) {
            res.send({
                success: false,
                message: res.__('api.client.fields.empty')
            });
        } else {
            const id = req.body.id;

            const result = await bulletinService.save(req, id);

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
        const result = await bulletinService.delete(req);

        if (result!==null) {
            res.send({success: true, message: res.__('api.client.delete.succes')});
        } else {
            res.send({success: false, message: res.__('api.client.delete.error')});
        }
    })
);

module.exports = router;
