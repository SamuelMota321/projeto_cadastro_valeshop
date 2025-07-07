import { ChevronRightIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const Nav = (): JSX.Element => {
  const location = useLocation();

  const menuItems = [
    {
      text: "Alterar status do cartão",
      link: "/alterar-status-cartao",
    },
    { text: "Alterar usuário", link: "#" }, // Removido o hasArrow
    { text: "Alterar matrícula", link: "/alterar-matricula" },
    { text: "Novo Cadastro de refereferência", link: "#" },
    { text: "Cadastro Motorista", link: "#" },
    { text: "Cadastro Veículo", link: "#" },
    { text: "Crédito de valores para cartão", link: "#" },
    { text: "Crédito em cartão e cadastro de usuário", link: "#" },
    { text: "Estorno de débito", link: "#" },
    { text: "Novo usuário e novo crédito", link: "#" },
  ];
  return (
    <nav className="w-[280px] bg-[#E5E5E5] min-h-[700px]">
      <div className="py-4">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.link;
          return(
            <div
              key={index}
              className={`mx-4 mb-1 ${
                isActive ? "bg-white rounded-lg shadow-sm" : ""
              }`}
            >
              <Link
                to={item.link}
                className={`flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                  isActive
                    ? "text-black font-normal font-sans"
                    : "text-black hover:bg-gray-200 rounded-lg font-sans"
                }`}
              >
                <span className="text-left">{item.text}</span>
                {item.link === '/alterar-usuario' && ( // Lógica para a seta, se necessário
                  <ChevronRightIcon className="w-4 h-4 ml-2" />
                )}
              </Link>
            </div>
          )}
        )}
      </div>
    </nav>
  );
};