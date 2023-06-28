import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import Dashboard from "./components/Dashboard";

function App() {
  const isLogged = window.localStorage.getItem("LoggedIn");

  return (
    <div className="App">
      <Router>
        {isLogged == "true" ? <Dashboard /> : <Login />}
        <Routes>
          <Route path="/forgotpwd" element={<ForgotPassword />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
