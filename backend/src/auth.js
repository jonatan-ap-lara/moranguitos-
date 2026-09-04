const router=require('express').Router();
const c=require('../controllers/AuthController');
router.post('/register',c.register);
router.post('/login',c.login);
router.post('/google',c.googleLogin);
module.exports=router;