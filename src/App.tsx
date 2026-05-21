import "./App.css";
import { BrowserRouter as Router, useLocation, useRoutes, Navigate } from "react-router-dom";
import routes from "~react-pages";
import MainLayout from "./layouts/mainlayout";
import { Suspense } from "react";
import { Spin, Typography } from "antd";
import useNetworkStatus from "./hooks/useNetworkStatus";
import NetworkError from "./views/errors/NetworkError";
import NotFound from "./views/errors/404";

const { Text } = Typography;

const Loader = () => (
  <div
    style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      gap: "12px",
    }}
  >
    <Text strong>Easy Testing is loading...</Text>
    <Spin size="large" />
  </div>
);

function App() {

  const location = useLocation();
  const isOnline = useNetworkStatus();

  const authData = localStorage.getItem("auth");

  let isAuthenticated = false;

  if (authData) {
    try {
      const parsedAuth = JSON.parse(authData);

      isAuthenticated =
        parsedAuth?.Response_Status === "Success" &&
        parsedAuth?.Response_Code === "200";
    } catch (error) {
      isAuthenticated = false;
    }
  }

  const element = useRoutes([
    ...routes,
    { path: "*", element: <NotFound /> },
  ]);

  const cleanPath = location.pathname.replace(/\/+$/, "");

  const noLayoutRoutes = ["/login", "/signup", "/forgot-password"];

  if (!isAuthenticated && !noLayoutRoutes.includes(cleanPath)) {
    return <Navigate to="/login" replace />;
  }

  if (isAuthenticated && cleanPath === "/login") {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      {!isOnline ? (
        <NetworkError />
      ) : (
        <Suspense fallback={<Loader />}>
          {noLayoutRoutes.includes(cleanPath) ? (
            element
          ) : (
            <MainLayout>{element}</MainLayout>
          )}
        </Suspense>
      )}
    </>
  );
}

export default function Root() {
  return (
    <Router>
      <App />
    </Router>
  );
}