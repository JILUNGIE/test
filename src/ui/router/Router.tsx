import { createHashRouter } from "react-router";

import Layout from "../pages/Layout";
import Home from "../pages/Home";
import Wrieless from "../pages/Wrieless";
import Update from "../pages/Update";

const router = createHashRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/home",
        element: <Home />,
      },
      {
        path: "/wireless",
        element: <Wrieless />,
      },
    ],
  },
  {
    path: "/check-update",
    element: <Update />,
  },
]);

export default router;
