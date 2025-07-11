import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import { AlterarStatusCartao } from "./screens/AlterarStatusCartao";
import { CadastrarUsuario } from "./screens/CadastrarUsuario";
import { AlterarReferencia } from "./screens/AlterarReferenciaUsuario";
import { AlterarMatricula } from "./screens/AlterarMatricula";
import { CadastrarAlterarDadosBancarios } from "./screens/CadastrarAlterarDadosBancarios";
import { NovoCadastroReferencia } from "./screens/NovoCadastroReferencia";
import { CadastrarMotorista } from "./screens/CadastrarMotorista";
import { CadastrarVeiculo } from "./screens/CadastrarVeiculo";
import { CreditoCartao } from "./screens/CreditoCartao";
import { CadastroCartao } from "./screens/CadastroCartao";
import { EstornoDebito } from "./screens/EstornoDebito";
import { NovoCartaoNovoUsuario } from "./screens/NovoCartaoNovoUsuario";


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
  {
    path: "/cadastrar-motorista",
    element: <CadastrarMotorista />,
  },
  {
    path: "/cadastrar-veiculo",
    element: <CadastrarVeiculo />,
  },
  {
    path: "/credito-cartao",
    element: <CreditoCartao />,
  },
  {
    path: "/cadastro-cartao",
    element: <CadastroCartao />,
  },
  {
    path: "/estorno-debito",
    element: <EstornoDebito />,
  },
  {
    path: "/novo-usuario-novo-credito",
    element: <NovoCartaoNovoUsuario />,
  },
]);

export const App = () => {
  return <RouterProvider router={router} />;
};