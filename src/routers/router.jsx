import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import Home from "../web/Home.jsx";
import Search from "../web/Search.jsx";
import ServiceDetail from "../web/ServiceDetail.jsx";
import Contact from "../web/Contact.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />,
      },
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "dich-vu",
        element: <Search />,
      },
      {
        path: "dich-vu/:slug",
        element: <ServiceDetail />,
      },
      {
        path: "lien-he",
        element: <Contact />,
      },
      {
        path: "*",
        element: <Navigate to="/home" replace />,
      },
    ],
  },
]);

export default router;
