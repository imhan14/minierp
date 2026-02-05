import jwt from 'jsonwebtoken';
import {verifyRole} from '../services/authService.js'

export const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: "You need to login!" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await verifyRole(decoded);
        if(!user || !user.is_active){
            return res.status(403).json({
                error:"Account not found!"
            });
        }
        req.users = {
            id:decoded.id,
            role_id:user.role_id
        }; 
        next();
    } catch (error) {
        res.status(403).json({ error: "Session expire or invalid!" });
    }
};
export const authorize = (allowedRoles) => {
    return (req, res, next) => {

        const userRoleId = req.users.role_id; 

        if (!allowedRoles.includes(userRoleId)) {
            return res.status(403).json({ 
                error: "You have not permission!" 
            });
        }

        next();
    };
};
