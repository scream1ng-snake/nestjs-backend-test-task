'use strict';

const { DataType } = require("sequelize-typescript");

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('users', {
      uuid: {
        type: DataType.UUID, 
        unique: true, 
        primaryKey: true, 
        defaultValue: DataType.UUIDV4 
      },
      email: {
        type: DataType.STRING(100), 
        allowNull: false
      },
      password: {
        type: DataType.STRING(100), 
        allowNull: false
      },
      nickname: {
        type: DataType.STRING(30), 
        allowNull: false
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
