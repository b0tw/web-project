const connection = require('./connection');
const Deliverable = require('./deliverable');
const Team = require('./team');
const User = require('./user');
const Jury = require('./jury');
const Session = require('./session');
const UserTeam = require('./userteam');
const UserJury = require('./userjury');

Team.belongsToMany(User, { through: UserTeam });
Team.hasMany(Deliverable);
Team.hasOne(Jury);

User.belongsToMany(Team, { through: UserTeam });
User.hasMany(Session, { foreignKey: 'user_id' });
User.belongsToMany(Jury, {through: UserJury});

Jury.belongsToMany(User, {through: UserJury});
Jury.belongsTo(Team);

module.exports = {
  connection: connection,
  Deliverable: Deliverable,
  Team: Team,
  User: User,
  Jury: Jury,
  Session: Session,
  UserTeam: UserTeam,
  UserJury: UserJury
};
