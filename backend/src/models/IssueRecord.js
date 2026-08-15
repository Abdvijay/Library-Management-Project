import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const IssueRecord = sequelize.define(
    "IssueRecord",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        bookId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        memberId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        issueDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },

        dueDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },

        returnDate: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },

        status: {
            type: DataTypes.ENUM("ISSUED", "RETURNED", "OVERDUE"),
            allowNull: false,
            defaultValue: "ISSUED",
        },
    },
    {
        tableName: "issue_records",
        timestamps: true,
        underscored: true,
    }
);

export default IssueRecord;