const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const requireRole = (role) => async (req, res, next) => {
    const member = await prisma.projectMember.findUnique({
        where: {
            userId_projectId: {
                userId: req.user.id,
                projectId: req.params.id
            }
        }
    });
    if (!member || (role === 'ADMIN' && member.role !== 'ADMIN'))
        return res.status(403).json({ error: 'Forbidden' });
    req.membership = member;
    next();
};

module.exports = { requireRole };