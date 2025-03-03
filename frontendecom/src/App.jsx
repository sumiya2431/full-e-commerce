import { BrowserRouter as Router } from "react-router-dom";
import RoutesComponent from "./routes"; 
import "./index.css"; 
function App() {
  return (
    <Router>
      <RoutesComponent />
    </Router>
  );
}

export default App;
