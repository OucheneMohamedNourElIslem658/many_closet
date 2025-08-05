import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import LandingSection from "./components/landing_section";
import NewArrivalSection from "./components/new_arrival_section";
import { Helmet } from "react-helmet";

const LandingPage = () => {
  const location = useLocation();

  useEffect(() => {
    let sectionId = "";

    switch (location.pathname) {
      case "/":
        sectionId = "landing";
        break;
      case "/new":
        sectionId = "new";
        break;
      case "/contact":
        sectionId = "forum";
        break;
      default:
        sectionId = "landing";
    }

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.pathname]);

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Helmet>
        <title>Many Closet</title>
        <meta name="description" content="Welcome to our online store!" />
        <meta name="keywords" content="store, online, shopping, many closet" />
      </Helmet>
      <div id="landing" style={{ minHeight: "100vh" }}>
        <LandingSection />
      </div>
      <div id="new">
        <NewArrivalSection />
      </div>
    </div>
  );
};

export default LandingPage;
