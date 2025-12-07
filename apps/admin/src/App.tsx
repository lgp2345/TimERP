import { useRoutes } from "react-router-dom";

function AppRoutes() {
  const element = useRoutes([
    {
      path: "/",
      element: <div className="p-4">TimERP Admin</div>,
    },
  ]);
  return element;
}

export default function App() {
  return <AppRoutes />;
}


