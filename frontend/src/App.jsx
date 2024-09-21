import { Fragment } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Fragment>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthForm />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<h1>Not Found!</h1>} />
        </Routes>
      </BrowserRouter>
    </Fragment>
  );
}

export default App;
