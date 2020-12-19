const express = require('express')
const router = express.Router();
const apiError = require('../entities/api-error');
const { User, Team } = require('../entities/database/context');
const Jury = require('../entities/database/jury');

//router.use(authMiddleware());

router.post('/', async (req, res) =>{
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

router.put('/:id', async (req, res) =>{
    USER_ID = req.user_id
    PROJECT_ID = req.body.project_id
    new_grade = req.body.new_grade
    var today = new Date();
    maximum_day_difference = 3

    const jury = await Jury.findOne({ where: { user_id: USER_ID, project_id: PROJECT_ID} })

    if (jury == null){
        return res.status(400).send({ message: "No user was found to be jury for this project."})
    }
    else {
        const day_difference = Math.ceil(Math.abs((today - jury.date_graded) / (1000 * 60 * 60 * 24)));
        if (day_difference > maximum_day_difference){
            return res.status(400).send({"message": "Date cannot be modified after "+ maximum_day_difference +" days have passed from the original grading." })
        }
        else {
            jury.grade = new_grade;
            await jury.save();
            return res.status(200).send({"message": "Date changed succesfully."})
        }
    }


});

module.exports = router