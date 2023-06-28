const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/EmployeeController');

router.get('/', employeeController.getEmployees);
router.post('/', employeeController.createEmployee);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;
