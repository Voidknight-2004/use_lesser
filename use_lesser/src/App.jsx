import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Goals from "./pages/goals";
import Timer from "./pages/Timer";
import Navbar from "./components/navbar";

function App() {
  return (
    <Router>
      <Navbar/>
      <div>
        <Routes>
          <Route path="/goals" element={<Goals />} />
          <Route path="/timer" element={<Timer/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
