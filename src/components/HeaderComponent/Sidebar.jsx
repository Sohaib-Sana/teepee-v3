import { useDispatch } from "react-redux";
import { NavLink, useRevalidator } from "react-router-dom";
import { logout } from "../../store/slices/authSlice";

export default function Sidebar({ isOpen, onToggle }) {
  const revalidator = useRevalidator();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
    revalidator.revalidate();
  };

  return (
    <>
      <aside
        className={`fixed top-14 left-0 h-full bg-gray-800 text-white transform
  ${isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64"}
  transition-transform duration-200 ease-in-out
  lg:translate-x-0 lg:static z-10 flex flex-col`}
      >
        <nav className="p-4 flex flex-col flex-grow">
          <ul className="space-y-2 flex-grow">
            <li>
              <NavLink to="/" end className={({ isActive }) => `block p-2 rounded ${isActive ? "bg-[#A07BEC]" : "hover:bg-gray-700"}`}>
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/papers" className={({ isActive }) => `block p-2 rounded ${isActive ? "bg-[#A07BEC]" : "hover:bg-gray-700"}`}>
                Papers
              </NavLink>
            </li>
          </ul>

          {/* Logout button pinned at the bottom */}
          <button onClick={handleLogout} className=" w-full p-2 mt-4 text-center text-red-500 hover:text-white rounded hover:bg-red-600">
            Logout
          </button>
        </nav>
      </aside>

      {/* Backdrop for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-0" onClick={onToggle} />}
    </>
  );
}
