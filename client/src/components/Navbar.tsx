import { FaSearch } from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-white/50 shadow-md">
      <div className="text-[#3f28d9] text-3xl font-extrabold">SyncCanvas</div>

      <div className="flex-1 flex justify-center">
        <div className="flex items-center w-full max-w-md border border-gray-300 px-3 py-2">
          <FaSearch className="text-indigo-600 mr-2" />

          <input
            type="text"
            placeholder="Search boards"
            className="w-full outline-none font-bold placeholder:font-normal text-indigo-600"
          />
        </div>
      </div>

      <div className="flex items-center">
        <img
          src="https://i.pravatar.cc/40"
          alt="avatar"
          className="w-10 h-10 rounded-full border"
        />
      </div>
    </nav>
  );
};

export default Navbar;
