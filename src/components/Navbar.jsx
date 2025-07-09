import { Link } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Optional: Close dropdown if user clicks outside
  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center w-full relative">
      <h1 className="text-xl font-bold text-blue-600">AlgoGantt</h1>

      <ul className="flex gap-6 items-center text-gray-700 font-medium relative">
        <li>
          <Link to="/" className="hover:text-blue-500">Home</Link>
        </li>

        <li className="relative">
          <button
            onClick={handleDropdownToggle}
            className="hover:text-blue-500 focus:outline-none"
          >
            Algorithms ▾
          </button>

          {dropdownOpen && (
            <ul className="absolute left-1/2 transform -translate-x-1/2 top-10 bg-white shadow-xl rounded-md border py-2 w-56 z-50">
              <li><Link to="/fcfs" className="block px-4 py-2 hover:bg-gray-100">FCFS</Link></li>
              <li><Link to="/sjf" className="block px-4 py-2 hover:bg-gray-100">SJF</Link></li>
              <li><Link to="/roundrobin" className="block px-4 py-2 hover:bg-gray-100">Round Robin</Link></li>
              <li><Link to="/priority" className="block px-4 py-2 hover:bg-gray-100">Priority Scheduling</Link></li>
              {/* Add more algorithms here */}
            </ul>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
