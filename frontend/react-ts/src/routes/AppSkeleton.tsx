import { AuthProvider } from "../middleware/authContext";
import UseRoutes from "./Routes";

const AppSkeleton = () => {
    return (
        <AuthProvider>
            <UseRoutes></UseRoutes>
        </AuthProvider>
)};

export default AppSkeleton