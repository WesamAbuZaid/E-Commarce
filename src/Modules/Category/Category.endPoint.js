import { roles } from "../../Middleware/auth.middleware.js";

export const rolesOfThisEndPoint = {
    create:[roles.Admin,roles.User]
}