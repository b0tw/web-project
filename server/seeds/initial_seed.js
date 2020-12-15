const context = require('../entities/database/context');
const fs = require('fs');
const path = require('path');
const security = JSON.parse(fs.readFileSync(path.resolve('appsettings.json')))
  .security;
const bcrypt = require('bcrypt');
const {exit} = require('process');

context.connection.authenticate().then(() =>
  bcrypt.hash('abc123', security.saltRounds, (err, hash) =>
  {
    if(err)
    {
      throw err;
    }

    context.Deliverable.destroy({ truncate: true });
    context.Project.destroy({ truncate: true });
    context.Jury.destroy({ truncate: true });
    context.User.destroy({ truncate: true });
    context.Team.destroy({ truncate: true });

    context.User.bulkCreate([
      {
        surname: 'Doe',
        name: 'John',
        password: hash,
        is_professor: 1
      },
      {
        surname: 'Sue',
        name: 'Mary',
        password: hash,
        is_professor: 0
      },
      {
        surname: 'Black',
        name: 'Jack',
        password: hash,
        is_professor: 0
      },
      {
        surname: 'Parker',
        name: 'Johanna',
        password: hash,
        is_professor: 1
      }
    ]);

    context.Team.bulkCreate([
      {
        name: '[object Object]'
      },
      {
        name: 'Pacmen'
      }
    ]).then(teams => context.User.findAll({ is_professor: 0 }).then(users =>
    {
      let middle = Math.ceil(users.length / 2),
        firstHalf = users.splice(0, middle),
        secondHalf = users.splice(middle);

      for(let user of firstHalf)
      {
        user.setTeams([teams[0]]);
        user.save();
      }

      for(let user of secondHalf)
      {
        user.setTeams([teams[1]]);
        user.save();
      }
    }));
  })).catch(error => console.log(`Could not connect to the database: ${error}`));
