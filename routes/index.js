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
  Employee.findOrCreate({
    where: { email: req.body.email }
  })
  .spread((employee, wasCreated) => {
    if (req.body.managerId) {
      employee.managerId = req.body.managerId;
      employee.save();
    }
  })
  .then(() => res.redirect('/employees'))
  .catch((error) => {
    res.locals.path = '/error';
    res.render('error', { error });
  });
});

router.put('/employees/:id', (req, res, next) => {
  Employee.findById(req.params.id)
  .then(employee => {
    if ((req.body.managerId) == -1) {
      employee.managerId = null;
    } else {
      Object.assign(employee, req.body);
    }
    employee.save();
  })
  .then(() => res.redirect('/employees'))
  .catch(next);
});

router.delete('/employees/:id', (req, res, next) => {
  Employee.findById(req.params.id)
  .then(employee => {
    employee.destroy();
  })
  .then(() => res.redirect('/employees'))
  .catch(next);
});

module.exports = router;
