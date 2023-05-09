import { createRoot } from "react-dom/client";
import App from "./main";
import "../src/App.css";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
