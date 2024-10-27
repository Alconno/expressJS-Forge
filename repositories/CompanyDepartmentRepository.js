const { Op } = require('sequelize');

class CompanyDepartmentRepository {

  CompanyDepartmentModel = {};
  CompanyDepartmentViewModel = {};

  constructor(CompanyDepartmentModel) {
    this.CompanyDepartmentModel = CompanyDepartmentModel;
    this.CompanyDepartmentViewModel = this.CompanyDepartmentViewModel;
  }

  async create({ name, company_id, created_by, parent_id }) {
    if(parent_id != null){
      if(!(await this.show(parent_id, company_id)))
        throw new Error("Parent department must be under same company.");
    }

    return await this.CompanyDepartmentModel.create({
      name, 
      company_id,
      created_by,
      parent_id,
    });
  }

  async show(department_id, company_id) {
    const department = await this.CompanyDepartmentModel.findOne({
        where: { id: department_id, company_id: company_id },
        paranoid: false,
    });

    if (!department) {
        return null;
    }

    const children = await this.CompanyDepartmentModel.findAll({
        where: { parent_id: department_id, company_id, company_id },
        paranoid: false,
    });

    const childrenWithHierarchy = await Promise.all(
        children.map(async (child) => {
            const childHierarchy = await this.show(child.id, company_id);
            return childHierarchy;
        })
    );

    department.dataValues.children = childrenWithHierarchy;
    return department;
}



  async update(department_id, company_id, updatedData) {
    const department = await this.CompanyDepartmentModel.findOne({ where: { id: department_id, company_id:company_id } });

    if (department) {
        // Update only the properties present in updatedData
        Object.assign(department, updatedData);

        await department.save();
    }

    return department;
  }

  async deactivate(department_id, company_id) {
    const department = await this.CompanyDepartmentModel.findOne({
        where: { id: department_id, deleted_at: null, company_id:company_id },
    });

    if (!department) {
        return false; // department not found
    }

    await department.destroy();
    return true;
  }

  async delete(department_id, company_id) {
    const department = await this.CompanyDepartmentModel.findOne({
        where: { id: department_id, deleted_at: { [Op.ne]: null }, company_id:company_id },
        paranoid: false,
    });

    if (!department) {
        // Department not found or not soft-deleted
        return false;
    }

    await department.destroy({ force: true });
    return true;
  }

  async activate(department_id, company_id){
    const [affectedRowsCount, affectedRows] = await this.CompanyDepartmentModel.update(
      { deleted_at: null },
      {
        where: { id: department_id, deleted_at: { [Op.ne]: null }, company_id:company_id },
        returning: true,
        paranoid: false,
      }
    );
  
    if (affectedRowsCount === 0 || !affectedRows || affectedRows.length === 0) {
      return false;
    }
  
    return true
  }

}
  
module.exports = CompanyDepartmentRepository;
