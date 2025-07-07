import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { AlterarStatusCartao } from "./screens/AlterarStatusCartao/AlterarStatusCartao";

const router = createBrowserRouter([
  {
    path: "/*",
    element: <AlterarStatusCartao />,
  },
]);

export const App = () => {
  return <RouterProvider router={router} />;
};
