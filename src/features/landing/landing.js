import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import ForumSection from "./components/forum_section";
import LandingSection from "./components/landing_section";
import NewArrivalSection from "./components/new_arrival_section";

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
    <div>
      <div id="landing">
        <LandingSection />
      </div>
      <div id="new">
        <NewArrivalSection />
      </div>
      <div id="forum">
        <ForumSection />
      </div>
    </div>
  );
};

export default LandingPage;
