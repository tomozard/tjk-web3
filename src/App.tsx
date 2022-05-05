import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Market from "./pages/Market";
import Collections from "./pages/Collections";
import Faucet from "./pages/Faucet";
import MyAppbar from "./components/MyAppbar";

function App() {
  return (
    <>
      <MyAppbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="market" element={<Market />} />
        <Route path="collections" element={<Collections />} />
        <Route path="faucet" element={<Faucet />} />
      </Routes>
    </>
  );
}

export default App;
