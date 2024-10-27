const { Op } = require('sequelize');

class UserRepository {

  UserModel = {};

  constructor(UserModel) {
    this.UserModel = UserModel;
  }

  async paginated({ search, sortField, sortOrder, page, pageSize, filterBy }) {
    const offset = page&&pageSize? (page - 1) * pageSize : 1;
    sortOrder = sortOrder ? sortOrder : 'desc';
    sortField = sortField ? sortField : 'first_name';

    // Build the where clause based on the search criteria
    const whereClause = search
        ? {
            [Op.or]: [
                { email: { [Op.iLike]: `%${search}%` } },
                { first_name: { [Op.iLike]: `%${search}%` } },
                { last_name: { [Op.iLike]: `%${search}%` } },
            ],
        }
        : {};

    // Include or exclude soft-deleted records based on filterBy
    if (filterBy === 'deleted') {
        whereClause.deleted_at = { [Op.ne]: null };
    } else if (filterBy === 'notDeleted' || !filterBy) {
        whereClause.deleted_at = null;
    }

    // Add logic to fetch users from the database based on the provided options, search, and pagination
    return await this.UserModel.findAll({
        where: whereClause ? whereClause : "",
        order: [[sortField, sortOrder === 'desc' ? 'DESC' : 'ASC']],
        limit: pageSize?pageSize:10,
        offset: offset,
        paranoid: filterBy&&filterBy=='notDeleted',
    });
  }

  async create({ email, first_name, last_name, password }) {
    return await this.UserModel.create({
      email,
      first_name,
      last_name,
      password,
    });
  }

  async show(user_id) {
    const user = await this.UserModel.findOne({
      where: { id: user_id },
      paranoid: false, // To include soft-deleted records
    });

    return user;
  }

  async update(user_id, {email, first_name, last_name}){
      const user = await this.UserModel.findOne({ where: { id: user_id } });

      if(user){
        if (email !== undefined) user.email = email;
        if (first_name !== undefined) user.first_name = first_name;
        if (last_name !== undefined) user.last_name = last_name;

        await user.save();
      }

      return user;
  }

  async deactivate(user_id) {
    const user = await this.UserModel.findOne({
        where: { id: user_id, deleted_at: null },
    });

    if (!user) {
        return false; // user not found
    }

    await user.destroy();
    return true;
  }

  async delete(user_id) {
    const user = await this.UserModel.findOne({
        where: { id: user_id, deleted_at: { [Op.ne]: null } },
        paranoid: false,
    });

    if (!user) {
        // User not found or not soft-deleted
        return false; // or throw an error if you prefer
    }

    await user.destroy({ force: true });
    return true;
  }


  async activate(user_id){
    const [affectedRowsCount, affectedRows] = await this.UserModel.update(
      { deleted_at: null },
      {
        where: { id: user_id, deleted_at: { [Op.ne]: null } },
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
  
  module.exports = UserRepository;