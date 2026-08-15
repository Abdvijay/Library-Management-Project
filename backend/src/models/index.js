import Member from "./Member.js";
import Book from "./Book.js";
import Author from "./Author.js";
import BookAuthor from "./BookAuthor.js";
import IssueRecord from "./IssueRecord.js";

// Member ↔ IssueRecord
Member.hasMany(IssueRecord, {
    foreignKey: "memberId",
    as: "issueRecords",
});

IssueRecord.belongsTo(Member, {
    foreignKey: "memberId",
    as: "member",
});

// Book ↔ IssueRecord
Book.hasMany(IssueRecord, {
    foreignKey: "bookId",
    as: "issueRecords",
});

IssueRecord.belongsTo(Book, {
    foreignKey: "bookId",
    as: "book",
});

// Book ↔ Author
Book.belongsToMany(Author, {
    through: BookAuthor,
    foreignKey: "bookId",
    otherKey: "authorId",
    as: "authors",
});

Author.belongsToMany(Book, {
    through: BookAuthor,
    foreignKey: "authorId",
    otherKey: "bookId",
    as: "books",
});

export { Member, Book, Author, BookAuthor, IssueRecord };