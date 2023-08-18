import { roles } from "../../Middleware/auth.middleware.js";

export const rolesOfThisEndPoint = {
    create:[roles.User],
    show:[roles.Admin]
}