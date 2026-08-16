import { getDashboardStats } from "../services/dashboardService.js";

export const getDashboardStatsController = async (request, reply) => {
    try {
        const stats = await getDashboardStats();

        return reply.code(200).send({
            success: true,
            data: stats,
        });
    } catch (error) {
        request.log.error(error);

        return reply.code(500).send({
            success: false,
            message: "Unable to fetch dashboard statistics",
        });
    }
};