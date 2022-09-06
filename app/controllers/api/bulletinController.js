let express = require('express');
let router = express.Router();
const path = require('path');
const multer  = require('multer');
let asyncHandler = require('../../utils/asyncHandler');
let bulletinService = require('../../services/bulletinService');
let {authJwt} = require('../../middlewares/authMiddleware');
let DropDown = require('../../vo/dropdown');
const fs = require('fs')

const imageStorage = multer.diskStorage({
    destination: 'images', // Destination to store image
    filename: (req, file, cb) => {
        let poslength = file.originalname.indexOf(".");
        let length = file.originalname.length;

        cb(null, file.originalname.substr(0,poslength) + '_' + Date.now() + path.extname(file.originalname))
        // file.fieldname is name of the field (image), path.extname get the uploaded file extension
    }
});

const imageUpload = multer({
    storage: imageStorage,
    limits: {
        fileSize: 1000000   // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb) {
      /*  if (!file.originalname.match(/\.(png|jpg)$/)) {     // upload only png and jpg format
            return cb(new Error('Please upload a Image'))
        }*/
        cb(undefined, true)
    }
})

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
    '/open/:id',
    authJwt(),
    asyncHandler(async (req, res) => {
        const result = await bulletinService.getFileName(req);

       const dropDown  = result[0];

        console.log(dropDown._label);
        res.download('images/'+dropDown._label);

       /* if (result.length === 0) { res.send({success:false, message:res.__('api.client.get.error')}); }
        else { res.send({success: true, data: dropDown}); }*/
    })
);

router.post(
    '/edit',
    authJwt(),
    asyncHandler(async (req, res) => {
        req.checkBody('ack_message').trim().notEmpty();
        req.checkBody('seq_dept_mess_id').trim().notEmpty();

        let errors = req.validationErrors();

        if (errors) {
            res.send({
                success: false,
                message: res.__('api.client.fields.empty')
            });
        } else {
            const id = req.body.id;
            console.log("body " + id);
            const result = await bulletinService.updateBulletin(req, id);

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
    '/close',
    authJwt(),
    asyncHandler(async (req, res) => {

        req.checkBody('seq_dept_mess_id').trim().notEmpty();

        let errors = req.validationErrors();

        if (errors) {
            res.send({
                success: false,
                message: res.__('api.client.fields.empty')
            });
        } else {
            const id = req.body.id;

            const result = await bulletinService.closeBulleting(req, id);

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
router.get(
    '/load/:id',
    authJwt(),
    asyncHandler(async (req, res) => {
        const result = await bulletinService.getBulletinMessage(req);

        if (result.length === 0) { res.send({success:false, message:res.__('api.client.get.error')}); }
        else { res.send({success: true, data: result}); }

        /* if (result.length === 0) { res.send({success:false, message:res.__('api.client.get.error')}); }
         else { res.send({success: true, data: dropDown}); }*/
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
            let total = await bulletinService.getAllCount();
            res.send({success: true, data: result, total: total, pageSize, page: page});
        }
    })
);









router.post(
    '/save',
    authJwt()
    ,imageUpload.single('test'),
    asyncHandler(async (req ,res) => {
        if (req.file) {

        console.log(req.file.filename);
        console.log(req.file);
    }
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
