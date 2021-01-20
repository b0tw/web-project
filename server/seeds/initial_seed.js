const context = require('../entities/database/context');
const security = require('../entities/settings').security;
const bcrypt = require('bcrypt');

(async () => {
  await context.connection.authenticate();
  context.connection.options.logging = console.log;

  await context.connection.query('SET FOREIGN_KEY_CHECKS = 0', null, {raw: true});
  await context.connection.sync({ force: true });
  await context.connection.query('SET FOREIGN_KEY_CHECKS = 1', null, {raw: true});

  let hash = await bcrypt.hash('abc123', security.saltRounds);
  let users = await context.User.bulkCreate([
    {
      username: 'jdoe',
      surname: 'Doe',
      name: 'John',
      password: hash,
      is_professor: 0
    },
    {
      username: 'msue',
      surname: 'Sue',
      name: 'Mary',
      password: hash,
      is_professor: 0
    },
    {
      username: 'jblack',
      surname: 'Black',
      name: 'Jack',
      password: hash,
      is_professor: 0
    },
    {
      username: 'jparker',
      surname: 'Parker',
      name: 'Johanna',
      password: hash,
      is_professor: 0
    }
    ,
    {
      username: 'awhite',
      surname: 'White',
      name: 'Andrew',
      password: hash,
      is_professor: 1
    }
    ,
    {
      username: 'jsnow',
      surname: 'Snow',
      name: 'John',
      password: hash,
      is_professor: 1
    }
  ]);

  let teams = await context.Team.bulkCreate([
    {
      name: '[object Object]',
      project_name: 'Anonymous Grading'
    },
    {
      name: 'Pacmen',
      project_name: 'Hotel Management'
    }
  ]);

  users[0].setTeams(teams[0]);
  await users[0].save();
  users[1].setTeams(teams[0]);
  await users[1].save();
  users[2].setTeams(teams[1]);
  await users[2].save();
  users[3].setTeams(teams[1]);
  await users[3].save();

  let deliverables = await context.Deliverable.bulkCreate([
    {
      title: 'Design architecture',
      description: 'Create the architecture design for the project.',
      url: null
    },
    {
      title: 'Add login functionality',
      description: 'Create and handle logins for users.',
      url: null
    },
    {
      title: 'Define database models',
      description: 'Design and implement the database models.',
      url: null
    },
    {
      title: 'Manage tenants',
      description: 'Create ORM object to manage tenants',
      url: null
    },
  ]);

  teams[0].setDeliverables([deliverables[0], deliverables[1]]);
  await teams[0].save();
  teams[1].setDeliverables([deliverables[2], deliverables[3]])
  await teams[1].save();

  let juries = await context.Jury.bulkCreate([
    {
      total_grade: 0
    },
    {
      total_grade: 0
    },
  ])
  teams[0].setJury(juries[0]);
  await teams[0].save();
  teams[1].setJury(juries[1]);
  await teams[1].save();

  juries[0].setUsers([ users[2], users[3] ]);
  await juries[0].save();
  juries[1].setUsers([ users[0], users[1] ]);
  await juries[1].save();

  // one of the rows will not update
  // i think it has something to do with the async
  let deadline = new Date();
  deadline.setDate(deadline.getDate() + 1);

  await context.UserJury.update({
    grade: 10,
    deadline: new Date()
  },
    {
      where: {
        UserId: 3,
        JuryId: 1
      }
  });
  await context.UserJury.update({
    grade: 8,
    deadline: deadline
  },
    {
      where: {
        UserId: 1,
        JuryId: 2
      }
  });
  await context.UserJury.update({
    grade: 7,
    deadline: deadline
  },
    {
      where: {
        UserId: 2,
        JuryId: 2
      }
  });
  // weird fix but no time
  await context.UserJury.update({
    grade: 7,
    deadline: deadline
  },
    {
      where: {
        UserId: 2,
        JuryId: 2
      }
  });
  await context.UserJury.update({
    grade: 9,
    deadline: deadline
  },
    {
      where: {
        UserId: 4,
        JuryId: 1
      }
  });
})();
