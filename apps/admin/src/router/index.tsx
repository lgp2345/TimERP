import { Route, Routes } from "react-router-dom";
import LoginPage from "@/pages/loginPage";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<LoginPage />} path="/login" />
    </Routes>
  );
}

export default AppRoutes;
