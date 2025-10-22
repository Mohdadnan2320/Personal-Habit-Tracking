const Router = require('express').Router;
const controller = require('../controllers/authController');

const router = Router();

router.post('/register', controller.register);
router.post('/login', controller.login);

module.exports = router;
