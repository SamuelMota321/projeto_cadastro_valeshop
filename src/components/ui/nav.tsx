import { ChevronRightIcon } from "lucide-react";
import { Link } from "react-router-dom";

export const Nav = (): JSX.Element => {
  const menuItems = [
    {
      text: "Alterar status do cartão",
      link: "/alterar-status-cartao",
      active: true,
    },
    { text: "Alterar usuário", link: "#", hasArrow: true },
    { text: "Alterar matrícula", link: "#" },
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
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`mx-4 mb-1 ${item.active
              ? "bg-white rounded-lg shadow-sm"
              : ""
              }`}
          >
            <Link
              to={item.link}
              className={`flex items-center justify-between px-4 py-3 text-sm transition-colors ${item.active
                ? "text-black font-normal font-sans"
                : "text-black hover:bg-gray-200 rounded-lg font-sans"
                }`}
            >
              <span className="text-left">{item.text}</span>
              {item.hasArrow && (
                <ChevronRightIcon className="w-4 h-4 ml-2" />
              )}
            </Link>
          </div>
        ))}
      </div>
    </nav>
  )
}