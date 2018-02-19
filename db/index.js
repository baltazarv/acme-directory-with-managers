const conn = require('./conn');
const { Sequelize } = conn;
const Employee = require('./Employee');

const sync = function() {
  return conn.sync({ force: true });
};

const data = [
  { email: 'james@hb.com' },
  { email: 'dave@yahoo.com' },
  { email: 'superman@aol.com' },
  { email: 'amir@gmail.com' }
];

const seed = () => {
  return Promise.all(data.map(employee => {
    return Employee.create(employee);
  }))
  .then(([james, david, cc, amir]) => {
    // cc.setManager(david);
    // david.setManager(james);
    // amir.setManager(james);

    james.setManages(david);
    james.setManages(amir);
    david.setManages(cc);
  });
};

module.exports = {
  sync,
  seed,
  models: {
    Employee
  }
};
