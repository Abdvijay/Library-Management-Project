import { Member, IssueRecord, Book } from "../models/index.js";

export const getAllMembers = async () => {
    const members = await Member.findAll({
        attributes: ["id", "name", "email", "role", "createdAt"],
        order: [["createdAt", "DESC"]],
    });

    return members;
};

export const getMemberById = async (memberId) => {
    const member = await Member.findByPk(memberId, {
        attributes: ["id", "name", "email", "role", "createdAt"],
    });

    if (!member) {
        const error = new Error("Member not found");
        error.statusCode = 404;
        throw error;
    }

    return member;
};

export const getMemberIssues = async (memberId) => {
    const member = await Member.findByPk(memberId);

    if (!member) {
        const error = new Error("Member not found");
        error.statusCode = 404;
        throw error;
    }

    const issues = await IssueRecord.findAll({
        where: {
            memberId,
        },
        include: [
            {
                model: Book,
                as: "book",
                attributes: ["id", "title", "isbn", "category"],
            },
        ],
        order: [["createdAt", "DESC"]],
    });

    return issues;
};