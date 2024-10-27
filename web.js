const express = require('express');
const userController = require('./controllers/UserController');
const { validateUserRequest } = require('./Validations/UserValidation');
const companyController = require('./controllers/CompanyController');
const { validateCompanyRequest } = require('./Validations/CompanyValidation');
const companyDepartmentController = require('./controllers/CompanyDepartmentController');
const { validateDepartmentRequest } = require('./Validations/DepartmentValidation');

const app = express();
const port = 3000;
 
app.use(express.json());

// Define routes using UserController methods
app.get('/api/users', validateUserRequest('paginated'), userController.paginated);
app.post('/api/users', validateUserRequest('create'), userController.create);
app.get('/api/users/:user_id', validateUserRequest('show'), userController.show);
app.put('/api/users/:user_id', validateUserRequest('update'), userController.update);
app.patch('/api/users/:user_id/deactivate', validateUserRequest('deactivate'), userController.deactivate);
app.patch('/api/users/:user_id/activate', validateUserRequest('activate'), userController.activate);
app.delete('/api/users/:user_id', validateUserRequest('delete'), userController.delete);


// Define routes using CompanyController methods
app.get('/api/companies', validateCompanyRequest('paginated'), companyController.paginated);
app.post('/api/companies', validateCompanyRequest('create'), companyController.create);
app.get('/api/companies/:company_id', validateCompanyRequest('show'), companyController.show);
app.put('/api/companies/:company_id', validateCompanyRequest('update'), companyController.update);
app.patch('/api/companies/:company_id/deactivate', validateCompanyRequest('deactivate'), companyController.deactivate);
app.patch('/api/companies/:company_id/activate', validateCompanyRequest('activate'), companyController.activate);
app.delete('/api/companies/:company_id', validateCompanyRequest('delete'), companyController.delete);


// Define routes using CompanyDepartmentController methods
app.post('/api/companies/:company_id/departments', validateDepartmentRequest('create'), companyDepartmentController.create);
app.get('/api/companies/:company_id/departments/:department_id', validateDepartmentRequest('show'), companyDepartmentController.show);
app.put('/api/companies/:company_id/departments/:department_id', validateDepartmentRequest('update'), companyDepartmentController.update);
app.patch('/api/companies/:company_id/departments/:department_id/deactivate', validateDepartmentRequest('deactivate'), companyDepartmentController.deactivate);
app.patch('/api/companies/:company_id/departments/:department_id/activate', validateDepartmentRequest('activate'), companyDepartmentController.activate);
app.delete('/api/companies/:company_id/departments/:department_id', validateDepartmentRequest('delete'), companyDepartmentController.delete);


const server = app.listen(port);

module.exports = server;
