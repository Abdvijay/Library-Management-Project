import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Book = sequelize.define(
    "Book",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        title: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },

        isbn: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true,
        },

        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        category: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },

        totalCopies: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },

        availableCopies: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },

        publishedYear: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    {
        tableName: "books",
        timestamps: true,
        underscored: true,
    }
);

export default Book;