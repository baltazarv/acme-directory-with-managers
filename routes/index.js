const router = require('express').Router();
const db = require('../db');
const { Employee } = db.models;

router.use((req, res, next) => {
  Employee.count()
  .then(count => {
    res.locals.employeeCount = count;
  })
  .then(() => {
    return Employee.managerCount();
  })
  .then(managerCount => {
    res.locals.managerCount = managerCount;
    next();
  });
});

// see json with manager/employee association
router.get('/managers', (req, res, next) => {
  Employee.findAll({
    include: [{
      model: Employee, as: 'manages'
    }]
  })
  .then(managers => {
    res.send(managers);
  });
});

router.get('/', (req, res, next) => {
  res.render('index', {  });
});

router.get('/employees', (req, res, next) => {
  Employee.findAll({
    include: [{
      model: Employee, as: 'manages'
    }]
  })
  .then(employees => {
    // res.locals.employeeCount = results.count;
    res.render('employees', { employees });
  })
  .catch(next);
});

router.post('/employees', (req, res, next) => {
  console.log(req.body);
  Employee.findOrCreate({
    where: { email: req.body.email }
  })
  .spread((employee, wasCreated) => {
    // console.log(employee, wasCreated);
    if (req.body.managerId) {
      employee.managerId = req.body.managerId;
      employee.save();
    }
    // res.send(employee);
  })
  .then(() => res.redirect('/employees'));
});

module.exports = router;
