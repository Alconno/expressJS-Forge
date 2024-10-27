const { makeConnection } = require('../config/db.config');
const CompanyDepartmentRepository = require('../repositories/CompanyDepartmentRepository');

class CompanyDepartmentService {
    constructor() {
        this.db = null;
        this.companyDepartmentRepository = null;
        this.initialized = false;
    }

    async init() {
        if (!this.initialized) {
            this.db = await makeConnection();
            this.companyDepartmentRepository = new CompanyDepartmentRepository(this.db.company_departments, this.db.view_company_departments);
            this.initialized = true;
        }
    }

    async withInitialization(fn, ...args) {
        await this.init();
        return fn(...args);
    }

    async create(departmentData) {
        return this.withInitialization(async () => {
            const newDepartment = await this.companyDepartmentRepository.create({
                name: departmentData.name,
                company_id: departmentData.company_id,
                created_by: departmentData.created_by,
                parent_id: departmentData.parent_id,
            });
            return newDepartment;
        });
    }

    async show(department_id, company_id) {
        return this.withInitialization(async () => {
            const department = await this.companyDepartmentRepository.show(department_id, company_id);
            return department;
        });
    }

    async update(departmentId, company_id, updatedData) {
        return this.withInitialization(async () => {
            const department = await this.companyDepartmentRepository.update(departmentId, company_id, updatedData);
            return department;
        });
    }
    

    async deactivate(departmentId, company_id) {
        return this.withInitialization(async () => {
            return await this.companyDepartmentRepository.deactivate(departmentId, company_id);
        });
    }

    async delete(departmentId, company_id) {
        return this.withInitialization(async () => {
            return await this.companyDepartmentRepository.delete(departmentId, company_id);
        });
    }

    async activate(departmentId, company_id) {
        return this.withInitialization(async () => {
            return await this.companyDepartmentRepository.activate(departmentId, company_id);
        });
    }
}

module.exports = new CompanyDepartmentService();
