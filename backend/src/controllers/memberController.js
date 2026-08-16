import { createMember, getAllMembers, getMemberById, getMemberIssues, updateMember, deleteMember } from "../services/memberService.js";

export const createMemberController = async (request, reply) => {
    try {
        const { name, email, password, role } = request.body;

        if (!name || !email || !password) {
            return reply.code(400).send({
                success: false,
                message: "Name, email and password are required",
            });
        }

        if (password.length < 6) {
            return reply.code(400).send({
                success: false,
                message: "Password must be at least 6 characters",
            });
        }

        const member = await createMember({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
            role: role || "MEMBER",
        });

        return reply.code(201).send({
            success: true,
            message: "Member created successfully",
            data: member,
        });
    } catch (error) {
        request.log.error(error);

        return reply.code(error.statusCode || 500).send({
            success: false,
            message: error.statusCode ? error.message : "Unable to create member",
        });
    }
};

export const updateMemberController = async (request, reply) => {
    try {
        const { id } = request.params;

        const member = await updateMember(Number(id), request.body);

        return reply.code(200).send({
            success: true,
            data: member,
            message: "Member updated successfully",
        });
    } catch (error) {
        request.log.error(error);

        return reply.code(error.statusCode || 500).send({
            success: false,
            message: error.message || "Unable to update member",
        });
    }
};

export const deleteMemberController = async (request, reply) => {
    try {
        const { id } = request.params;

        await deleteMember(Number(id));

        return reply.code(200).send({
            success: true,
            message: "Member deleted successfully",
        });
    } catch (error) {
        request.log.error(error);

        return reply.code(error.statusCode || 500).send({
            success: false,
            message: error.message || "Unable to delete member",
        });
    }
};

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