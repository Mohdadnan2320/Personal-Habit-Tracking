const Router = require('express').Router;
const auth = require('../middleware/auth');
const controller = require('../controllers/habitController');

const router = Router();

router.use(auth);

router.post('/', controller.createHabit);
router.get('/', controller.getHabits);
router.get('/:id', controller.getHabit);
router.put('/:id', controller.updateHabit);
router.delete('/:id', controller.deleteHabit);

router.post('/:id/track', controller.trackHabit);
router.get('/:id/history', controller.getHabitHistory);

module.exports = router;
