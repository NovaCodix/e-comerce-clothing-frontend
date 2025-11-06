import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top of the document when route changes.
    // Use instant behavior so the content appears immediately at the top.
    try {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      // Also set a small timeout in case some transitions need to settle
      const t = setTimeout(() => window.scrollTo({ top: 0, left: 0, behavior: "auto" }), 50);
      return () => clearTimeout(t);
    } catch (e) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
