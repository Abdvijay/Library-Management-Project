import { IssueRecord, Book, Member } from "../models/index.js";

export const createIssue = async ({ bookId, memberId, dueDate }) => {
    const book = await Book.findByPk(bookId);

    if (!book) {
        const error = new Error("Book not found");
        error.statusCode = 404;
        throw error;
    }

    const member = await Member.findByPk(memberId);

    if (!member) {
        const error = new Error("Member not found");
        error.statusCode = 404;
        throw error;
    }

    if (book.availableCopies <= 0) {
        const error = new Error("Book is currently unavailable");
        error.statusCode = 400;
        throw error;
    }

    const existingIssue = await IssueRecord.findOne({
        where: {
            bookId,
            memberId,
            status: "ISSUED",
        },
    });

    if (existingIssue) {
        const error = new Error("This member already has this book issued");
        error.statusCode = 409;
        throw error;
    }

    const issueRecord = await IssueRecord.create({
        bookId,
        memberId,
        issueDate: new Date(),
        dueDate,
        status: "ISSUED",
    });

    await book.update({
        availableCopies: book.availableCopies - 1,
    });

    return issueRecord;
};

export const getAllIssues = async () => {
    return await IssueRecord.findAll({
        include: [
            {
                model: Book,
                as: "book",
                attributes: ["id", "title", "isbn"],
            },
            {
                model: Member,
                as: "member",
                attributes: ["id", "name", "email"],
            },
        ],
        order: [["createdAt", "DESC"]],
    });
};

export const getIssueById = async (issueId) => {
    const issue = await IssueRecord.findByPk(issueId, {
        include: [
            {
                model: Book,
                as: "book",
                attributes: ["id", "title", "isbn"],
            },
            {
                model: Member,
                as: "member",
                attributes: ["id", "name", "email"],
            },
        ],
    });

    if (!issue) {
        const error = new Error("Issue record not found");
        error.statusCode = 404;
        throw error;
    }

    return issue;
};

export const returnBook = async (issueId) => {
    const issue = await IssueRecord.findByPk(issueId);

    if (!issue) {
        const error = new Error("Issue record not found");
        error.statusCode = 404;
        throw error;
    }

    if (issue.status === "RETURNED") {
        const error = new Error("Book has already been returned");
        error.statusCode = 400;
        throw error;
    }

    const book = await Book.findByPk(issue.bookId);

    if (!book) {
        const error = new Error("Book not found");
        error.statusCode = 404;
        throw error;
    }

    await issue.update({
        returnDate: new Date(),
        status: "RETURNED",
    });

    await book.update({
        availableCopies: book.availableCopies + 1,
    });

    return issue;
};