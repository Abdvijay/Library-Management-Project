import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Author = sequelize.define(
    "Author",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        name: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },

        bio: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        tableName: "authors",
        timestamps: true,
        underscored: true,
    }
);

export default Author;