import { ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Modal } from "./modal";

export const Nav = (): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

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
        { text: "Cadastrar/Alterar dados bancários", link: "/alterar-dados-bancarios" },
        { text: "Alterar referência", link: "/alterar-referencia" },
        { text: "Cadastrar usuário", link: "/cadastrar-usuario" },
      ],
    },
    { text: "Alterar matrícula", link: "/alterar-matricula" },
    { text: "Novo Cadastro de referência", link: "/novo-cadastro-referencia" },
    { text: "Cadastro Motorista", link: "/cadastrar-motorista" },
    { text: "Cadastro Veículo", link: "/cadastrar-veiculo" },
    { text: "Crédito de valores para cartão", link: "/credito-cartao", opensModal: true },
    { text: "Cadastro de cartão", link: "/cadastro-cartao", opensModal: true },
    { text: "Estorno de débito", link: "/estorno-debito" },
    { text: "Novo usuário e novo crédito", link: "/novo-usuario-novo-credito" },
  ];

  const isSubmenuActive = (submenu: any[] | undefined) => {
    return submenu?.some(item => location.pathname === item.link);
  }

  const handleSim = () => {
    navigate('/credito-cartao');
    setModalOpen(false);
  };

  const handleNao = () => {
    navigate('/cadastro-cartao');
    setModalOpen(false);
  };

  const handleMenuClick = (item: any) => {
    if (item.opensModal) {
      setModalOpen(true);
    }
  };

  return (
    <>
      <nav className="w-[280px] bg-[#E5E5E5] min-h-[700px]">
        <div className="py-4">
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.link || (item.submenu && isSubmenuActive(item.submenu));

            // Define o conteúdo do item de menu para evitar repetição
            const menuItemContent = (
              <div
                className={`flex items-center justify-between px-4 py-3 text-sm transition-colors cursor-pointer ${isActive
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
            );

            return (
              <div
                key={index}
                className="relative mx-4 mb-1"
                onMouseEnter={() => item.submenu && setIsUserMenuOpen(true)}
                onMouseLeave={() => item.submenu && setIsUserMenuOpen(false)}
              >
                {item.opensModal ? (
                  <div onClick={() => handleMenuClick(item)}>
                    {menuItemContent}
                  </div>
                ) : (
                  <Link to={item.link}>
                    {menuItemContent}
                  </Link>
                )}

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
                            className={`block px-4 py-2 text-sm ${isSubActive
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
              </div>
            )
          }
          )}
        </div>
      </nav>

      <Modal
        isOpen={isModalOpen}
        onSim={handleSim}
        onNao={handleNao}
      />
    </>
  );
};