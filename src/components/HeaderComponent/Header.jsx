export default function Header({ onMenuClick }) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16  text-[#6750A4] flex items-center px-4 shadow-md z-20">
      <button className="lg:hidden mr-4" onClick={onMenuClick}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <h1 className="text-lg font-bold">TEEPEE V3</h1>
    </header>
  );
}
