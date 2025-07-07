export const Header = (): JSX.Element => {
  return (
    <header className="w-full h-[100px] bg-gradient-to-r from-[#004075] to-[#00569E] flex items-center px-4">
      <img
        className="h-[80px] object-contain"
        alt="Vale Shop Logo"
        src="../public/logo_valeshop.png"
      />
    </header>
  );
}