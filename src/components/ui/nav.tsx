import { ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export const Nav = (): JSX.Element => {
  const location = useLocation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const menuItems = [
    {
      text: "Alterar status do cartão",
      link: "/alterar-status-cartao",
    },
    {
      text: "Alterar usuário",
      link: "#",
      hasArrow: true,
      submenu: [
        { text: "Alterar dados bancários", link: "/alterar-dados-bancarios" },
        { text: "Alterar referência", link: "/alterar-referencia" },
        { text: "Cadastrar usuário", link: "/cadastrar-usuario" },
      ],
    },
    { text: "Alterar matrícula", link: "/alterar-matricula" },
    { text: "Novo Cadastro de referência", link: "#" },
    { text: "Cadastro Motorista", link: "#" },
    { text: "Cadastro Veículo", link: "#" },
    { text: "Crédito de valores para cartão", link: "#" },
    { text: "Crédito em cartão e cadastro de usuário", link: "#" },
    { text: "Estorno de débito", link: "#" },
    { text: "Novo usuário e novo crédito", link: "#" },
  ];

  const isSubmenuActive = (submenu: any[] | undefined) => {
    return submenu?.some(item => location.pathname === item.link);
  }

  return (
    <nav className="w-[280px] bg-[#E5E5E5] min-h-[700px]">
      <div className="py-4">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.link || (item.submenu && isSubmenuActive(item.submenu));
          return(
            <div
              key={index}
              className="relative mx-4 mb-1"
              onMouseEnter={() => item.submenu && setIsUserMenuOpen(true)}
              onMouseLeave={() => item.submenu && setIsUserMenuOpen(false)}
            >
              <div
                className={`flex items-center justify-between px-4 py-3 text-sm transition-colors cursor-pointer ${
                  isActive
                    ? "bg-white rounded-lg shadow-sm"
                    : "hover:bg-gray-200 rounded-lg"
                }`}
              >
                <span className={`text-left text-black font-normal font-sans`}>
                  {item.text}
                </span>
                {item.hasArrow && (
                  <ChevronRightIcon className="w-4 h-4 ml-2" />
                )}
              </div>

              {item.submenu && isUserMenuOpen && (
                <div 
                  className="absolute left-[95%] w-[250px] bg-white rounded-lg shadow-lg z-10 top-1/2 -translate-y-1/2"
                >
                  <div className="py-2">
                    {item.submenu.map((subItem, subIndex) => {
                       const isSubActive = location.pathname === subItem.link;
                      return (
                        <Link
                          key={subIndex}
                          to={subItem.link}
                          className={`block px-4 py-2 text-sm ${
                            isSubActive 
                              ? "text-blue-600 font-semibold" 
                              : "text-black hover:bg-gray-100"
                          }`}
                        >
                          {subItem.text}
                        </Link>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* This is a fallback link for mobile or non-hover devices */}
              {!item.submenu && (
                <Link to={item.link} className="absolute inset-0" />
              )}
            </div>
          )}
        )}
      </div>
    </nav>
  );
};