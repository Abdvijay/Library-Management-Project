import { Book, Member, Author, IssueRecord } from "../models/index.js";
import { Op } from "sequelize";

export const getDashboardStats = async () => {
    const totalBooks = await Book.count();

    const availableBooks = await Book.count({
        where: {
            availableCopies: {
                [Op.gt]: 0,
            },
        },
    });

    const totalMembers = await Member.count({
        where: {
            role: "MEMBER",
        },
    });

    const totalAuthors = await Author.count();

    const activeIssues = await IssueRecord.count({
        where: {
            status: "ISSUED",
        },
    });

    const overdueIssues = await IssueRecord.count({
        where: {
            status: "OVERDUE",
        },
    });

    return {
        totalBooks,
        availableBooks,
        totalMembers,
        totalAuthors,
        activeIssues,
        overdueIssues,
    };
};