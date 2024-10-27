const { Sequelize, DataTypes, Model } = require('sequelize');
require('dotenv').config();

const makeConnection = async () => {
  // Add the following lines to configure Sequelize with a custom logger
  const customLogger = (message, options) => {
    if (options.logging === 'error') {
      // Log only errors
      console.error(message);
    }
  };
  
  const databaseUrl = process.env.DATABASE_URL;

  // Create a Sequelize instance with the database URL
  const sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres', // Specify the dialect (e.g., postgres)
    define: {
      timestamps: true, // Enable timestamps
      paranoid: true,    // Enable soft deletes
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 20000,
      idle: 5000,
    },
    //logging: process.env.NODE_ENV === 'test' ? customLogger : console.log,
  });

  const db = {};
  db.Sequelize = Sequelize;
  db.sequelize = sequelize;
  db.users = require("../models/User")(sequelize, Model);
  db.companies = require("../models/Company")(sequelize, Model);
  db.company_departments = require("../models/CompanyDepartment")(sequelize, Model);
  db.view_company_departments = require("../models/CompanyDepartmentView")(sequelize, Model);

  return db;
};

module.exports = { makeConnection };
