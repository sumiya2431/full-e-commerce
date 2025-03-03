import { BrowserRouter as Router } from "react-router-dom";
import RoutesComponent from "./routes"; // Ensure the file name matches exactly
import "./index.css"; // Ensure this file exists

function App() {
  return (
    <Router>
      <RoutesComponent />
    </Router>
  );
}

export default App;
