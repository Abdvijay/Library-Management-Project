import { createIssue, getAllIssues, getIssueById, returnBook } from "../services/issueService.js";

export const createIssueController = async (request, reply) => {
    try {
        const { bookId, memberId, dueDate } = request.body;

        if (!bookId || !memberId || !dueDate) {
            return reply.code(400).send({
                success: false,
                message: "Book ID, member ID and due date are required",
            });
        }

        const issue = await createIssue({
            bookId,
            memberId,
            dueDate,
        });

        return reply.code(201).send({
            success: true,
            message: "Book issued successfully",
            data: issue,
        });
    } catch (error) {
        request.log.error(error);

        return reply.code(error.statusCode || 500).send({
            success: false,
            message: error.statusCode ? error.message : "Unable to issue book",
        });
    }
};

export const getIssues = async (request, reply) => {
    try {
        const issues = await getAllIssues();

        return reply.code(200).send({
            success: true,
            data: issues,
        });
    } catch (error) {
        request.log.error(error);

        return reply.code(500).send({
            success: false,
            message: "Unable to fetch issue records",
        });
    }
};

export const getIssue = async (request, reply) => {
    try {
        const { id } = request.params;

        const issue = await getIssueById(id);

        return reply.code(200).send({
            success: true,
            data: issue,
        });
    } catch (error) {
        request.log.error(error);

        return reply.code(error.statusCode || 500).send({
            success: false,
            message: error.statusCode ? error.message : "Unable to fetch issue record",
        });
    }
};

export const returnBookController = async (request, reply) => {
    try {
        const { id } = request.params;

        const issue = await returnBook(id);

        return reply.code(200).send({
            success: true,
            message: "Book returned successfully",
            data: issue,
        });
    } catch (error) {
        request.log.error(error);

        return reply.code(error.statusCode || 500).send({
            success: false,
            message: error.statusCode ? error.message : "Unable to return book",
        });
    }
};