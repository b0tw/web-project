const connection = require('./connection');
const Deliverable = require('./deliverable');
const Project = require('./project');
const Team = require('./team');
const User = require('./user');
const Jury = require('./jury');
const Session = require('./session');
const UserTeam = require('./userteam');
const UserProject = require('./userproject');
const UserJury = require('./userjury');

Project.belongsTo(Team);
Project.belongsToMany(User, { through: UserProject });
Project.hasMany(Deliverable);
Project.hasOne(Jury);

Team.hasOne(Project);
Team.belongsToMany(User, { through: UserTeam });

User.belongsToMany(Team, { through: UserTeam });
User.belongsToMany(Project, { through: UserProject });
User.hasMany(Session, { foreignKey: 'user_id' });
User.belongsToMany(Jury, {through: UserJury});

Jury.belongsTo(Project);
Jury.belongsToMany(User, {through: UserJury});

module.exports = {
  connection: connection,
  Deliverable: Deliverable,
  Project: Project,
  Team: Team,
  User: User,
  Jury: Jury,
  Session: Session,
  UserTeam: UserTeam,
  UserProject: UserProject,
  UserJury: UserJury
};
