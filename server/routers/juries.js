const express = require('express')
const router = express.Router();
const apiError = require('../entities/api-error');

//router.use(authMiddleware());

router.post('/add', async (req, res) =>{
    project_id = req.body.project_id
    user_id = req.body.user_id
    grade = req.body.grade
    if (grade < 0 || grade > 10)
        {
            res.status(200).send({"message": "Inavlid grade entered. Grade should be withing 0 and 10"})
        }
    if (Math.log(grade) * Math.LOG10E + 1 > 3)
        {
            res.status(200).send({"message": "Invalid grade entered. Grade has too many decimals."})
        }
    date_graded = req.body.date_graded

    let jury = {
        project_id,
        user_id,
        grade,
        date_graded
    }

    res.status(200).send(jury)
})

router.put('/edit/:id', async (req, res) =>{
    user_id = req.params.user_id
    // TODO: Learn how to do a select query
})