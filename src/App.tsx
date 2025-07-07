import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import { AlterarStatusCartao } from "./screens/AlterarStatusCartao/AlterarStatusCartao";
import { AlterarMatricula } from "./screens/AlterarMatricula/AlterarMatricula";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/alterar-status-cartao" replace />,
  },
  {
    path: "/alterar-status-cartao",
    element: <AlterarStatusCartao />,
  },
  {
    path: "/alterar-matricula",
    element: <AlterarMatricula />,
  },
]);

export const App = () => {
  return <RouterProvider router={router} />;
};