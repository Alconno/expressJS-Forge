const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class CompanyDepartment extends Model {
        static associate(models) {
            // Define the association to the Company model
            CompanyDepartment.belongsTo(models.Company, {
                foreignKey: 'company_id',
                onDelete: 'CASCADE', // Set onDelete to 'CASCADE'
                hooks: true,
            });
        }
    }
    CompanyDepartment.init(
        {
            id: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            company_id: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            parent_id: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            created_by: {
                type: DataTypes.UUID,
                allowNull: true,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize.NOW,
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: sequelize.NOW,
            },
            archived_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            deleted_at: {
                type: DataTypes.DATE,
                allowNull: true,
            },
      
        },
        {
            sequelize,
            modelName: "company_department",
            tableName: "company_departments",
            timestamps: true,
            paranoid:true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            deletedAt: "deleted_at",
        }
    );
    return CompanyDepartment;
};
