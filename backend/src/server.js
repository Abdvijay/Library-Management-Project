import Fastify from "fastify";
import cors from "@fastify/cors";
import "dotenv/config";

import sequelize from "./config/database.js";
import "./models/index.js";

import jwtPlugin from "./plugins/jwt.js";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import authorRoutes from "./routes/authorRoutes.js";
import issueRoutes from "./routes/issueRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

const app = Fastify({logger: true,});

await app.register(cors, {origin: "true",
    methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
  ],
});
await app.register(jwtPlugin);
await app.register(authRoutes, {prefix: "/api/auth",});
await app.register(bookRoutes, {prefix: "/api/books"});
await app.register(authorRoutes, {prefix: "/api/authors"});
await app.register(issueRoutes, {prefix: "/api/issues"});
await app.register(memberRoutes, {prefix: "/api/members"});
await app.register(dashboardRoutes, {prefix: "/api/dashboard"});

app.get("/", async () => {
    return {
        success: true,
        message: "Library Management API is running",
    };
});


const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connection established successfully.");

        await sequelize.sync();
        console.log("Database tables synchronized successfully.");

        const port = Number(process.env.PORT) || 5000;

        await app.listen({
            port,
            host: "0.0.0.0",
        });
    } catch (error) {
        console.error("Unable to start server:", error);
        process.exit(1);
    }
};

startServer();