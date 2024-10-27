const companyDepartmentService = require('../services/CompanyDepartmentService');
const companyService = require('../services/CompanyService');
const userService = require('../services/UserService');

class CompanyDepartmentController {

    async create(req, res) {
        try {
            const company = await companyService.show(req.params.company_id);
            if(company==null)
                return res.status(404).json({ errors: [{ msg: 'Company not found' }] });
              
            if(req.body.parent_id)
                if((await companyDepartmentService.show(req.body.parent_id, company.id))==null)
                    return res.status(404).json({ errors: [{ msg: 'Parent department not found' }] });

            if((await userService.show(req.body.created_by))==null)
                return res.status(404).json({ errors: [{ msg: 'User not found' }] });
  
            const combinedData = {
                ...req.body,   // Data from the request body
                ...req.params  // Data from route parameters
            };

            const newCompanyDepartment = await companyDepartmentService.create(combinedData);

            res.status(201).json(newCompanyDepartment);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async show(req, res) {
        try {
            const departmentWithChildren = await companyDepartmentService.show(req.params.department_id, req.params.company_id);
    
            if (departmentWithChildren) {
                res.status(200).json(departmentWithChildren);
            } else {
                res.status(404).json({ error: 'Company Department not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
  
    async update(req, res) {
        try {
            const department = await companyDepartmentService.update(req.params.department_id, req.params.company_id, { name: req.body.name, company_id: req.params.company_id });

            if (department) {
                res.status(200).json(department);
            } else {
                return res.status(404).json({ errors: [{ msg: 'Company Department not found' }] });
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async deactivate(req, res) {
        try {
            const success = await companyDepartmentService.deactivate(req.params.department_id, req.params.company_id);

            if (success) {
                res.status(200).json({ message: 'Company Department successfully deactivated' });
            } else {
                return res.status(404).json({ errors: [{ msg: 'Company Department not found' }] });
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async delete(req, res) {
        try {
            const success = await companyDepartmentService.delete(req.params.department_id, req.params.company_id);

            if (success) {
                res.status(200).json({ message: 'Company Department deleted successfully' });
            } else {
                return res.status(404).json({ errors: [{ msg: 'Company Department not found or deactivated' }] });
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async activate(req, res) {
        try {
            const success = await companyDepartmentService.activate(req.params.department_id, req.params.company_id);

            if (success) {
                res.status(200).json({ message: 'Company Department successfully activated' });
            } else {
                return res.status(404).json({ errors: [{ msg: 'Company Department not found or deactivated' }] });
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = new CompanyDepartmentController();
