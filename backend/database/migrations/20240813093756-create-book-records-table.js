'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Books', {
      book_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      goodreads_book_id : {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      best_book_id : {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      work_id : {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      isbn : {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isbn13 : {
        type: Sequelize.STRING,
        allowNull: false,
      },
      authors: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      original_publication_year : {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      original_title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      language_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      average_rating: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      ratings_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      work_ratings_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      work_text_reviews_count	: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ratings_1	: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ratings_2	: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ratings_3	: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ratings_4	: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ratings_5	: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      small_image_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      image_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Books');
  }
};
