import { ToastContainer } from "react-toastify";
import "./App.css";
import NavigationBar from "./components/custom_components/navigation-bar.component";
import AppRoutes from "./routes/routes";

function App() {
  return (
    <div className="min-h-screen overflow-y-auto">
      <NavigationBar className={"mb-8"} />
      <AppRoutes />
      <ToastContainer />
    </div>
  );
}

export default App;
