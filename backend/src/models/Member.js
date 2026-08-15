import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Member = sequelize.define(
    "Member",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },

        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        role: {
            type: DataTypes.ENUM("MEMBER", "LIBRARIAN"),
            allowNull: false,
            defaultValue: "MEMBER",
        },
    },
    {
        tableName: "members",
        timestamps: true,
        underscored: true,
    }
);

export default Member;