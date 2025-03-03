import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Adminpage from "./pages/Adminpage";

function RoutesComponent() {
  return (
    <Routes>
      <Route path="/" element={<Signup />}/>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/admin" element={<Adminpage />} />
    </Routes>
  );
}

export default RoutesComponent;

