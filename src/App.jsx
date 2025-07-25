import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import FCFS from "./pages/FCFS";
import SJF from "./pages/SJF";
import RoundRobin from "./pages/RoundRobin";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/fcfs" element={<FCFS />} />
        <Route path="/sjf" element={<SJF />} />
        <Route path="/roundrobin" element={<RoundRobin />} />
      </Routes>
    </div>
  );
};

export default App;
