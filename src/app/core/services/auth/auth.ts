export * from "./auth.facade";
export * from "../../models/auth.model";
export * from "./auth-api.service";
export * from "./auth.state";

// Backwards-compatibility alias so existing imports don't break during transition
import { AuthFacade } from "./auth.facade";
export { AuthFacade as AuthService };
