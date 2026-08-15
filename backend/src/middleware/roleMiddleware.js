const roleMiddleware = (allowedRoles) => {
    return async (request, reply) => {
        if (!request.user) {
            return reply.code(401).send({
                success: false,
                message: "Unauthorized. Please login first.",
            });
        }

        if (!allowedRoles.includes(request.user.role)) {
            return reply.code(403).send({
                success: false,
                message: "You do not have permission to access this resource.",
            });
        }
    };
};

export default roleMiddleware;