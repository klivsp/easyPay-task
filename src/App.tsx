import { ToastContainer } from "react-toastify";
import "./App.css";
import NavigationBar from "./components/custom_components/navigation-bar.component";
import AppRoutes from "./routes/routes";
import { ThemeProvider } from "./components/ui/theme-provider";

function App() {
  return (
    <div className="min-h-screen overflow-y-auto">
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <NavigationBar className={"mb-8"} />
        <AppRoutes />
        <ToastContainer />
      </ThemeProvider>
    </div>
  );
}

export default App;
