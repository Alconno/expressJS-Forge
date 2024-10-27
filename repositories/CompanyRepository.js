const { Op } = require('sequelize');
const userService = require('../services/UserService');

class CompanyRepository {

    CompanyModel = {};

    constructor(CompanyModel) {
        this.CompanyModel = CompanyModel;
    }

    async paginated({ search, sortField, sortOrder, page, pageSize, filterBy }) {
        const offset = page&&pageSize? (page - 1) * pageSize : 1;
        sortOrder = sortOrder ? sortOrder : 'desc';
        sortField = sortField ? sortField : 'created_at';

        // Build the where clause based on the search criteria
        const whereClause = search
            ? {
                [Op.or]: [
                    { handle: { [Op.iLike]: `%${search}%` } },
                    { name: { [Op.iLike]: `%${search}%` } },
                    { website: { [Op.iLike]: `%${search}%` } },
                    { representative_first_name: { [Op.iLike]: `%${search}%` } },
                    { representative_last_name  : { [Op.iLike]: `%${search}%` } },
                ],
            }
            : {};

        // Include or exclude soft-deleted records based on filterBy
        if (filterBy === 'deleted') {
            whereClause.deleted_at = { [Op.ne]: null };
        } else if (filterBy === 'notDeleted' || !filterBy) {
            whereClause.deleted_at = null;
        }

        // Add logic to fetch companies from the database based on the provided options, search, and pagination
        return await this.CompanyModel.findAll({
            where: whereClause ? whereClause : "",
            order: [[sortField, sortOrder === 'desc' ? 'DESC' : 'ASC']],
            limit: pageSize?pageSize:10,
            offset: offset,
            paranoid: filterBy && filterBy == 'notDeleted',
        });
    }

    async create({ handle, name, website, country, created_by }) {
        const user = await userService.show(created_by);
        if(!user)return 0;
        return await this.CompanyModel.create({
            handle,
            name,
            website,
            country,
            created_by,
            representative_first_name: user.first_name,
            representative_last_name: user.last_name,
            representative_email: user.email,
        });
    }

    async show(company_id) {
        const company = await this.CompanyModel.findOne({
            where: { id: company_id },
            paranoid: false, // To include soft-deleted records
        });

        return company;
    }

    async update(company_id, { handle, name, website, country, }) {
        const company = await this.CompanyModel.findOne({ where: { id: company_id } });
        
        if(!company)
            return 0;

        company.handle = handle ? handle : company.handle;
        company.name = name ? name : company.name;
        company.website = website ? website : company.website;
        company.country = country ? country : company.country;

        await company.save();

        return company;
    }

    async deactivate(company_id) {
        const company = await this.CompanyModel.findOne({
            where: { id: company_id, deleted_at: null },
        });

        if (!company) {
            return false; // Company not found
        }

        await company.destroy();
        return true;
    }

    async delete(company_id) {
        const company = await this.CompanyModel.findOne({
            where: { id: company_id, deleted_at: { [Op.ne]: null } },
            paranoid: false,
        });

        if (!company) {
            return false; // Company not found or not soft deleted
        }

        await company.destroy({ force: true });
        return true;
    }

    async activate(company_id) {
        const [affectedRowsCount, affectedRows] = await this.CompanyModel.update(
            { deleted_at: null },
            {
                where: { id: company_id, deleted_at: { [Op.ne]: null } },
                returning: true,
                paranoid: false,
            }
        );

        if (affectedRowsCount === 0 || !affectedRows || affectedRows.length === 0) {
            return false; // Company not found or not soft deleted
        }

        return true;
    }
}

module.exports = CompanyRepository;
