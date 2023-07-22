import { BrowserRouter, Routes, Route } from "react-router-dom";
import SolarSystemScene from "./SolarSystemMain";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SolarSystemScene />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
