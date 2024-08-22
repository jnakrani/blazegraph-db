import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routes } from "./routing/routes";
import './assets/css/style.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={
              // route.protected ? (
              //   <PrivateRoute>{route.element}</PrivateRoute>
              // ) : (
              route.element
              // )
            }
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
