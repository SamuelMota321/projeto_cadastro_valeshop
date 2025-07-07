import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import { AlterarStatusCartao } from "./screens/AlterarStatusCartao";
import { AlterarMatricula } from "./screens/AlterarMatricula";
import { CadastrarUsuario } from "./screens/CadastrarUsuario";
import { AlterarReferencia } from "./screens/AlterarReferenciaUsuario"
import { CadastrarAlterarDadosBancarios } from "./screens/CadastrarAlterarDadosBancarios";
import { NovoCadastroReferencia } from "./screens/NovoCadastroReferencia";


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
  {
    path: "/cadastrar-usuario",
    element: <CadastrarUsuario />,
  },
  {
    path: "/alterar-referencia",
    element: <AlterarReferencia />,
  },
  {
    path: "/alterar-dados-bancarios",
    element: <CadastrarAlterarDadosBancarios />,
  },
  {
    path: "/novo-cadastro-referencia",
    element: <NovoCadastroReferencia />,
  },
]);

export const App = () => {
  return <RouterProvider router={router} />;
};