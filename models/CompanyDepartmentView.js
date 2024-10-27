const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class CompanyDepartmentView extends Model {}
    
    CompanyDepartmentView.init(
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
            path: {
                type: DataTypes.TEXT,
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
            modelName: "view_company_departments",
            tableName: "view_company_department",
            timestamps: true,
            paranoid:true,
            createdAt: "created_at",
            updatedAt: "updated_at",
            deletedAt: "deleted_at",
        }
    );
    return CompanyDepartmentView;
};
