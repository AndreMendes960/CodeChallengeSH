'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Book extends Model {
  }

  Book.init({
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    goodreads_book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    best_book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    work_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isbn: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isbn13: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    authors: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    original_publication_year: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    original_title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    language_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    average_rating: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    ratings_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    work_ratings_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    work_text_reviews_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ratings_1: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ratings_2: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ratings_3: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ratings_4: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ratings_5: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    small_image_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'Book',
    tableName: 'Books',
  });

  Book.associate = (models) => {
    Book.hasOne(models.Reservation, { foreignKey: 'bookId', as: 'reservations' });
  };

  return Book;
};