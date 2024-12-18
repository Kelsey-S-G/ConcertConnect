import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Layout = () => {
  return (
    <div>
      <main className="min-h-screen min-w-full container bg-gray-200">
        <Navbar />

        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;