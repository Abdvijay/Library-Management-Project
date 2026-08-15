import bcrypt from "bcrypt";
import { Member } from "../models/index.js";

export const registerMember = async ({ name, email, password }) => {
    const existingMember = await Member.findOne({
        where: { email },
    });

    if (existingMember) {
        const error = new Error("Email already registered");
        error.statusCode = 409;
        throw error;
    }

    if (password.length < 6) {
        const error = new Error("Password must be at least 6 characters");
        error.statusCode = 400;
        throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const member = await Member.create({
        name,
        email,
        password: hashedPassword,
        role: "MEMBER",
    });

    return {
        id: member.id,
        name: member.name,
        email: member.email,
        role: member.role,
    };
};

export const loginMember = async ({ email, password, jwt }) => {
    const member = await Member.findOne({
        where: { email },
    });

    if (!member) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, member.password);

    if (!isPasswordValid) {
        const error = new Error("Invalid email or password");
        error.statusCode = 401;
        throw error;
    }

    const token = jwt.sign({
        id: member.id,
        email: member.email,
        role: member.role,
    });

    return {
        user: {
            id: member.id,
            name: member.name,
            email: member.email,
            role: member.role,
        },
        token,
    };
};

export const getCurrentMember = async (memberId) => {
    const member = await Member.findByPk(memberId, {
        attributes: ["id", "name", "email", "role"],
    });

    if (!member) {
        const error = new Error("Member not found");
        error.statusCode = 404;
        throw error;
    }

    return member;
};