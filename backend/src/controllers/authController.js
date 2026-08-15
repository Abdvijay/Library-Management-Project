import { registerMember, loginMember, getCurrentMember } from "../services/authService.js";

export const register = async (request, reply) => {
    try {
        const { name, email, password } = request.body;

        if (!name || !email || !password) {
            return reply.code(400).send({
                success: false,
                message: "Name, email and password are required",
            });
        }

        const member = await registerMember({
            name,
            email,
            password,
        });

        return reply.code(201).send({
            success: true,
            message: "Registration successful",
            data: member,
        });
    } catch (error) {
        request.log.error(error);

        return reply.code(error.statusCode || 500).send({
            success: false,
            message: error.statusCode ? error.message : "Unable to register member",
        });
    }
};

export const login = async (request, reply) => {
    try {
        // console.log("JWT available:", !!request.server.jwt);
        const { email, password } = request.body;

        if (!email || !password) {
            return reply.code(400).send({
                success: false,
                message: "Email and password are required",
            });
        }

        const result = await loginMember({
            email,
            password,
            jwt: request.server.jwt,
        });

        return reply.code(200).send({
            success: true,
            message: "Login successful",
            data: result,
        });
    } catch (error) {
        request.log.error(error);

        return reply.code(error.statusCode || 500).send({
            success: false,
            message: error.statusCode ? error.message : "Unable to login",
        });
    }
};

export const getMe = async (request, reply) => {
    try {
        const member = await getCurrentMember(request.user.id);

        return reply.code(200).send({
            success: true,
            data: member,
        });
    } catch (error) {
        request.log.error(error);

        return reply.code(error.statusCode || 500).send({
            success: false,
            message: error.statusCode ? error.message : "Unable to get member details",
        });
    }
};