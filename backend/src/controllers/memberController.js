import { getAllMembers, getMemberById, getMemberIssues } from "../services/memberService.js";

export const getMembers = async (request, reply) => {
    try {
        const members = await getAllMembers();

        return reply.code(200).send({
            success: true,
            data: members,
        });
    } catch (error) {
        request.log.error(error);

        return reply.code(500).send({
            success: false,
            message: "Unable to fetch members",
        });
    }
};

export const getMember = async (request, reply) => {
    try {
        const { id } = request.params;

        if (request.user.role === "MEMBER" && Number(request.user.id) !== Number(id)) {
            return reply.code(403).send({
                success: false,
                message: "You can only access your own profile",
            });
        }

        const member = await getMemberById(id);

        return reply.code(200).send({
            success: true,
            data: member,
        });
    } catch (error) {
        request.log.error(error);

        return reply.code(error.statusCode || 500).send({
            success: false,
            message: error.statusCode ? error.message : "Unable to fetch member",
        });
    }
};

export const getMemberIssuesController = async (request, reply) => {
    try {
        const { id } = request.params;

        if (request.user.role === "MEMBER" && Number(request.user.id) !== Number(id)) {
            return reply.code(403).send({
                success: false,
                message: "You can only access your own issue history",
            });
        }

        const issues = await getMemberIssues(id);

        return reply.code(200).send({
            success: true,
            data: issues,
        });
    } catch (error) {
        request.log.error(error);

        return reply.code(error.statusCode || 500).send({
            success: false,
            message: error.statusCode ? error.message : "Unable to fetch member issues",
        });
    }
};