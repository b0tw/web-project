const context = require('../entities/database/context');
const security = require('../entities/settings').security;
const bcrypt = require('bcrypt');

(async() =>
{
  await context.connection.authenticate();
  await context.connection.sync({ force: true });

  let existingProjects = await context.Project.findAll({ include: context.Deliverable });
  existingProjects.forEach(async p =>
  {
    p.removeDeliverables(p.Deliverable);
    await p.save();
  });

  let existingTeams = await context.Team.findAll({ include: context.Project });
  existingTeams.forEach(async t =>
  {
    t.removeProjects(t.Project);
    await t.save();
  });

  let existingUsers = await context.User.findAll({ include: [ context.Team, context.Project] });
  existingUsers.forEach(async u =>
  {
    u.removeTeams(u.Team);
    u.removeProjects(u.Project);
    u.removeSessions(u.Session);
    await u.save();
  });

  await context.Deliverable.destroy({ truncate: true });
  await context.Project.destroy({ truncate: { cascade: true } });
  await context.Team.destroy({ truncate: { cascade: true } });
  await context.User.destroy({ truncate: { cascade: true } });

  let hash = await bcrypt.hash('abc123', security.saltRounds);
  let users = await context.User.bulkCreate([
    {
      username: 'jdoe',
      surname: 'Doe',
      name: 'John',
      password: hash,
      is_professor: 1
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
      is_professor: 1
    }
  ]);

  let teams = await context.Team.bulkCreate([
    {
      name: '[object Object]'
    },
    {
      name: 'Pacmen'
    }
  ]);
  
  let middle = Math.ceil(users.length / 2),
    firstHalf = users.splice(0, middle),
    secondHalf = users.splice(middle);

  for(let user of firstHalf)
  {
    if(user.is_professor == 0)
    {
      user.setTeams([teams[0]]);
      await user.save();
    }
  }

  for(let user of secondHalf)
  {
    if(user.is_professor == 0)
    {
      user.setTeams([teams[1]]);
      await user.save();
    }
  }

  let projects = await context.Project.bulkCreate([
    {
      name: 'Anonymous Grading'
    },
    {
      name: 'Web Game'
    },
    {
      name: 'Hotel Management'
    },
  ]);
  projects.forEach(async p =>
  {
    p.setTeam(teams[Math.round(Math.random() * teams.length)]);
    await p.save();
  });

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

  projects[0].setDeliverables([deliverables[0]]);
  await projects[0].save()
  projects[1].setDeliverables([deliverables[1]]);
  await projects[1].save()
  projects[2].setDeliverables([deliverables[2], deliverables[3]]);
  await projects[2].save()
})();
