const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {}
  User.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    first_name: {
        type: DataTypes.STRING,
    },
    last_name: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
    },
    otp_secret: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    google_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    github_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    linkedin_id: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    locale: {
        type: DataTypes.STRING(5),
        allowNull: true,
    },
    timezone: {
        type: DataTypes.STRING(64),
        allowNull: true,
    },
    city_country: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    location: {
        type: DataTypes.GEOGRAPHY('POINT', 4326),
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    dob: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    workplace: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
        allowNull: false,
        defaultValue: [],
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    disability: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    about: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    email_verified_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    notifications_read_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    talent_onboarding_done: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    company_onboarding_done: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    culture_clan: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    culture_adhocracy: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    culture_hierarchy: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    culture_market: {
        type: DataTypes.FLOAT,
        allowNull: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    profile_picture: {
        type: DataTypes.JSONB,
        allowNull: true,
    },
    cover_picture: {
        type: DataTypes.JSONB,
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
    deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    deactivate_message: {
        type: DataTypes.STRING,
    },
    privacy_mode: {
        type: DataTypes.STRING,
    },
    tsq: {
        type: DataTypes.STRING,
    },
    freeze_message: {
        type: DataTypes.STRING,
    },
    admin_actions: {
        type: DataTypes.TEXT,
    },
  }, {
    sequelize,
    modelName: "user",
    tableName: "users",
    timestamps: true,
    paranoid:true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  });

  return User;
};