const companyService = require('../services/CompanyService');
const userService = require('../services/UserService');

class CompanyController {

    async paginated(req, res) {
        try {
            const { search, sortField, sortOrder, page, pageSize, filterBy } = req.query;
            
            const companyList = await companyService.paginated({ search, sortField, sortOrder, page, pageSize, filterBy });
        
            res.status(200).json(companyList);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    
    async create(req, res) {
        try {
            if ((await userService.show(req.body.created_by)) == null)
                return res.status(404).json({ error: 'User not found' }); 

            const newCompany = await companyService.create(req.body);

            res.status(201).json(newCompany);

        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async show(req, res) {
        try {
            const company = await companyService.show(req.params.company_id);

            if (company) {
                res.status(200).json(company);
            } else {
                res.status(404).json({ error: 'Company not found' });
            }
        } catch (error) {
            if (!res.headersSent) {
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    }

  
    async update(req, res) {
        try {
            if ((await userService.show(req.body.created_by)) == null)
                return res.status(404).json({ error: 'User not found' }); 

            const company = await companyService.update(req.params.company_id, req.body);

            if (company) {
                res.status(200).json(company);
            } else {
                res.status(404).json({ error: 'Company not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async deactivate(req, res) {
        try {
            const success = await companyService.deactivate(req.params.company_id);

            if (success) {
                res.status(200).json({ message: 'Company successfully deactivated' });
            } else {
                res.status(404).json({ error: 'Company not found' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async delete(req, res) {
        try {
            const success = await companyService.delete(req.params.company_id);

            if (success) {
                res.status(200).json({ message: 'Company deleted successfully' });
            } else {
                res.status(404).json({ error: 'Company not found or not soft deleted' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async activate(req, res) {
        try {
            const success = await companyService.activate(req.params.company_id);

            if (success) {
                res.status(200).json({ message: 'Company successfully activated' });
            } else {
                res.status(404).json({ error: 'Company not found or not was not soft deleted' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

module.exports = new CompanyController();