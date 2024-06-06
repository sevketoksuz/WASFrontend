import { useNavigate } from "react-router-dom";
import { decodeUserToken } from "../api/authentication/AuthenticationApi.jsx";
import { useEffect } from "react";

const ManagerRouter = ({ element }) => {
  const navigate = useNavigate();
  const credentials = decodeUserToken();

  useEffect(() => {
    if (
      !credentials ||
      !credentials.roles ||
      (!credentials.roles.includes("MANAGER") &&
        !credentials.roles.includes("BOSS") &&
        !credentials.roles.includes("ADMIN"))
    ) {
      navigate("/");
    }
  }, [navigate, credentials]);

  return credentials &&
    credentials.roles &&
    (credentials.roles.includes("MANAGER") ||
      credentials.roles.includes("BOSS") ||
      credentials.roles.includes("ADMIN"))
    ? element
    : null;
};

export default ManagerRouter;
