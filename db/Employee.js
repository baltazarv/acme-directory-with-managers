const conn = require('./conn');
const { Sequelize } = conn;

const Employee = conn.define('employee', {
  email: Sequelize.STRING
}, {
  getterMethods: {
    emailLocalPart: function() {
      if (this.email) return this.email.split('@')[0];
    },
    emailDomain: function() {
      if (this.email) return this.email.split('@')[1];
    }
  }
});

// Employee.belongsTo(Employee, { as: 'manager' });
Employee.hasMany(Employee, { as: 'manages', foreignKey: 'managerId' });

Employee.managerCount = function() {
  let count = 0;
  return Employee.findAll({
    include: [{
      model: Employee, as: 'manages'
    }]
  })
  .then(employees => {
    employees.forEach((employee) => {
      if (employee.manages.length) {
        count++;
      }
    });
    return count;
  });
};

module.exports = Employee;

