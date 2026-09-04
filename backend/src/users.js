const router=require('express').Router(); const auth=require('../middleware/Auth');
const User=require('../models/User');
router.get('/me',auth,async(req,res)=>{const u=await User.findById(req.userId).select('-password'); if(!u)return res.status(404).json({message:'Usuário não encontrado'}); res.json(u);});
router.put('/me',auth,async(req,res)=>{const u=await User.findByIdAndUpdate(req.userId,{name:req.body.name,businessName:req.body.businessName},{new:true}).select('-password'); res.json(u);});
module.exports=router;