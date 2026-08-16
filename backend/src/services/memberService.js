import bcrypt from "bcrypt";
import { Member, IssueRecord, Book } from "../models/index.js";

export const getAllMembers = async () => {
    const members = await Member.findAll({
        attributes: ["id", "name", "email", "role", "createdAt"],
        order: [["createdAt", "DESC"]],
    });

    return members;
};

export const createMember = async ({ name, email, password, role = "MEMBER" }) => {
    const existingMember = await Member.findOne({
        where: { email },
    });

    if (existingMember) {
        const error = new Error("A member with this email already exists");

        error.statusCode = 409;

        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const member = await Member.create({
        name,
        email,
        password: hashedPassword,
        role,
    });

    return {
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role,
        createdAt: member.createdAt,
    };
};

export const updateMember = async (memberId, memberData) => {
    const member = await Member.findByPk(memberId);

    if (!member) {
        const error = new Error("Member not found");
        error.statusCode = 404;
        throw error;
    }

    if (memberData.name !== undefined) {
        member.name = memberData.name;
    }

    if (memberData.email !== undefined) {
        member.email = memberData.email;
    }

    await member.save();

    return member;
};

export const deleteMember = async (memberId) => {
    const member = await Member.findByPk(memberId);

    if (!member) {
        const error = new Error("Member not found");
        error.statusCode = 404;
        throw error;
    }

    const issueCount = await IssueRecord.count({
        where: {
            memberId,
        },
    });

    if (issueCount > 0) {
        const error = new Error("Cannot delete member because borrowing history exists.");

        error.statusCode = 400;
        throw error;
    }

    await member.destroy();

    return true;
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