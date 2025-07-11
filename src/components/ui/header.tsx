import logoValeshop from '../../imgs/logo_valeShop.png';

export const Header = (): JSX.Element => {
  return (
    <header className="w-full h-[100px] bg-gradient-to-r from-[#004075] to-[#00569E] flex items-center px-4">
      <img
        className="h-[80px] object-contain"
        alt="Vale Shop Logo"
        src={logoValeshop}
      />
      <div className='flex items-center ml-4 flex-col w-full'>
        <h1 className="text-white text-3xl font-bold ml-4">
          Sistema de Formulários
        </h1>
        <p className='text-white text-2xl ml-4'>Gerador de CSV</p>
      </div>

    </header>
  );
}