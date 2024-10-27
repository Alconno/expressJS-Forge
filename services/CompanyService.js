const { makeConnection } = require('../config/db.config');
const CompanyRepository = require('../repositories/CompanyRepository');

class CompanyService {
    constructor() {
        this.db = null;
        this.companyRepository = null;
        this.initialized = false;
    }

    async init() {
        if (!this.initialized) {
            this.db = await makeConnection();
            this.companyRepository = new CompanyRepository(this.db.companies);
            this.initialized = true;
        }
    }

    async withInitialization(fn, ...args) {
        await this.init();
        return fn(...args);
    }

    async paginated({ search, sortField, sortOrder, page, pageSize, filterBy }) {
        return this.withInitialization(async () => {
            const companies = await this.companyRepository.paginated({
                search, sortField, sortOrder, page, pageSize, filterBy
            });
            return companies;
        });
    }

    async create(companyData) {
        return this.withInitialization(async () => {
            const newCompany = await this.companyRepository.create({
                handle: companyData.handle,
                name: companyData.name,
                website: companyData.website,
                country: companyData.country,
                created_by: companyData.created_by,
            });
            return newCompany;
        });
    }

    async show(companyId) {
        return this.withInitialization(async () => {
            const company = await this.companyRepository.show(companyId);
            return company;
        });
    }

    async update(companyId, { handle, name, website, country, /* add other fields as needed */ }) {
        return this.withInitialization(async () => {
            const updatedCompany = await this.companyRepository.update(companyId, {
                handle, name, website, country, /* add other fields as needed */
            });
            return updatedCompany;
        });
    }

    async deactivate(companyId) {
        return this.withInitialization(async () => {
            return await this.companyRepository.deactivate(companyId);
        });
    }

    async delete(companyId) {
        return this.withInitialization(async () => {
            return await this.companyRepository.delete(companyId);
        });
    }

    async activate(companyId) {
        return this.withInitialization(async () => {
            return await this.companyRepository.activate(companyId);
        });
    }
}

module.exports = new CompanyService();
