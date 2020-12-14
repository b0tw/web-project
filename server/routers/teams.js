const express = require('express')
const router = express.Router();

router.get('/get',(req,res)=>{
    res.status(400)
})

router.post('/add',(req,res)=>{
    res.status(400)
})

router.put('/update',(req,res)=>{
    res.status(400)
})

module.exports = router