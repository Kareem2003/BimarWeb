import { useRoutes } from "react-router-dom";
import ProtectedRoute from "./helpers/ProtectedRoute";
import TestScreen from "./pages/Test";
// import DefaultLayout from "./DefaultLayout";

const Routers = () => {
  return useRoutes([
    { path: "/", element: <TestScreen /> },
    // { path: "login", element: <Login /> },
    // { path: "forgetPassword", element: <ForgetPassword /> },
    // {
    //   path: "/",
    //   element: (
    //     <ProtectedRoute>
    //       <DefaultLayout />
    //     </ProtectedRoute>
    //   ),
    //   children: [
    //     {
    //       index: true,
    //       element: <Dashboard />,
    //     },
    //     { path: "dashboard", element: <Dashboard /> },
    //     {
    //       path: "people",
    //       children: [
    //         { path: "", element: <People /> },
    //         { path: "import-form", element: <PeopleImportForm /> },
    //         { path: "form", element: <PeopleForm /> },
    //         {
    //           path: "import",
    //           element: <GeneralImport />,
    //         },
    //       ],
    //     },
    //   ],
    // },
  ]);
};

export default Routers;
