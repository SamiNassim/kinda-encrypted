import { HashRouter, Route } from "react-router-dom";
import PreventBackNavigation from "./components/prevent-back-navigation";
import { Routes } from "react-router-dom";
import EncryptPage from "./pages/encrypt-page";
import HomePage from "./pages/home-page";
import DecryptPage from "./pages/decrypt-page";

function App() {
  return (
    <HashRouter basename="/">
      <PreventBackNavigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/encrypt" element={<EncryptPage />} />
        <Route path="/decrypt" element={<DecryptPage />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
