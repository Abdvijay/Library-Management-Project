import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const BookAuthor = sequelize.define(
    "BookAuthor",
    {
        bookId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: "books",
                key: "id",
            },
        },

        authorId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: "authors",
                key: "id",
            },
        },
    },
    {
        tableName: "book_authors",
        timestamps: false,
        underscored: true,
    }
);

export default BookAuthor;