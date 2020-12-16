const connection = require('./connection');
const Deliverable = require('./deliverable');
const Project = require('./project');
const Team = require('./team');
const User = require('./user');
const Jury = require('./jury');
const Session = require('./session');


Project.belongsTo(Team, { foreignKey: 'team_id' });
Project.belongsToMany(User, { through: Jury });
Project.hasMany(Deliverable);

Team.hasOne(Project, { foreignKey: 'project_id' });
Team.belongsToMany(User, { through: 'UserTeams' });

User.belongsToMany(Team, { through: 'UserTeams' });
User.belongsToMany(Project, { through: Jury });
User.hasMany(Session, { foreignKey: 'user_id' });

module.exports = {
  connection: connection,
  Deliverable: Deliverable,
  Project: Project,
  Team: Team,
  User: User,
  Jury: Jury,
  Session: Session
};
