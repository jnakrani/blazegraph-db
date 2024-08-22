import SettingsPage from "../pages/SettingsPage";
import UploadPage from "../pages/UploadPage";

export const routes = [
  {
    id: 1,
    path: "/",
    element: <SettingsPage />,
  },
  {
    id: 2,
    path: "/upload",
    element: <UploadPage />,
  },
];
