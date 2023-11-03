import { useSelector } from "react-redux";
import { Redirect, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.user);
  let location = useLocation();
  if (!user.name) {
    return <Redirect to="/" state={{ from: location }} replace />;
  }
  return children;
};

export default ProtectedRoute;
