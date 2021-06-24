const authController = require('./controllers/api/authController');
const clientController = require('./controllers/api/clientController');
const userController = require('./controllers/api/userController');
const epicController = require('./controllers/api/epicController');
const backlogController = require('./controllers/api/backlogController');
const sprintController  = require('./controllers/api/sprintController');
module.exports = function (app) {
    app.use('/api/auth',               authController);
    app.use('/api/user',               userController);
    app.use('/api/client',             clientController);
    app.use('/api/epic',             epicController);
    app.use('/api/backlog',             backlogController);
    app.use('/api/sprint',             sprintController);
}
