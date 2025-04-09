import BottomNav from "../../commun/components/bottom_nav";
import ForumSection from "./components/forum_section";
import LandingSection from "./components/landing_section";
import NewArrivalSection from "./components/new_arrival_section";

const LandingPage = () => {
    return ( 
        <div>
            <LandingSection/>
            <NewArrivalSection/>
            <ForumSection/>
            <BottomNav/>
        </div>
    );
}
 
export default LandingPage;