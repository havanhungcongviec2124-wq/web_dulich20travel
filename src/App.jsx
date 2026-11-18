import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { setHolidays } from "./lib/pricing";

const App = () => {
  const { pathname, hash } = useLocation();
  const holidays = useSelector((s) => s.content?.data?.info?.holidays);

  useEffect(() => {
    if (Array.isArray(holidays)) setHolidays(holidays);
  }, [holidays]);

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.slice(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer variant={pathname === "/home" ? "full" : "inner"} />
    </div>
  );
};

export default App;
