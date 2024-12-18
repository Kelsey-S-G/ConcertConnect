import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import Concerts from "./pages/Concerts";
import Favorites from "./pages/Favorites";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Dashboard from ".pages/admin/Dashboard";
import ConcertContextProvider from "./context/ConcertContextProvider";
import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/concerts",
        element: <Concerts />,
      },
      {
        path: "/favorites",
        element: <Favorites />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
    ],
  },
]);

function App() {
  return (
    <ConcertContextProvider>
      <RouterProvider router={router} />
    </ConcertContextProvider>
  );
}

export default App;
