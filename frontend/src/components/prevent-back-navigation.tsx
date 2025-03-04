import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PreventBackNavigation = () => {
  const location = useLocation();

  useEffect(() => {
    const blockBackNavigation = () => {
      window.history.pushState(null, "", window.location.href);
    };

    // Push initial state
    blockBackNavigation();

    // Listen for back/forward navigation
    window.addEventListener("popstate", blockBackNavigation);

    return () => {
      window.removeEventListener("popstate", blockBackNavigation);
    };
  }, [location]);

  return null;
};

export default PreventBackNavigation;
