import { Book, Author, Member, IssueRecord } from "../models/index.js";
import { updateOverdueIssues } from "./issueService.js";

export const getDashboardStats = async () => {
    await updateOverdueIssues();
    const [totalBooks, totalAuthors, totalMembers, activeIssues] = await Promise.all([
        Book.count(),
        Author.count(),
        Member.count({
            where: {
                role: "MEMBER",
            },
        }),
        IssueRecord.count({
            where: {
                status: "ISSUED",
            },
        }),
    ]);

    const books = await Book.findAll({
        attributes: ["totalCopies", "availableCopies"],
    });

    const totalCopies = books.reduce((sum, book) => sum + Number(book.totalCopies), 0);

    const availableCopies = books.reduce((sum, book) => sum + Number(book.availableCopies), 0);

    const overdueIssues = await IssueRecord.count({
        where: {
            status: "OVERDUE",
        },
    });

    return {
        totalBooks,
        totalAuthors,
        totalMembers,
        activeIssues,
        overdueIssues,
        totalCopies,
        availableCopies,
        issuedCopies: totalCopies - availableCopies,
    };
};