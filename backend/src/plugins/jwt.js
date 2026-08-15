import fp from "fastify-plugin";
import jwt from "@fastify/jwt";
import "dotenv/config";

const jwtPlugin = async (app) => {
    await app.register(jwt, {
        secret: process.env.JWT_SECRET,
        sign: {
            expiresIn: process.env.JWT_EXPIRES_IN || "1d",
        },
    });
};

export default fp(jwtPlugin);