import ForumSection from "./components/forum_section";
import LandingSection from "./components/landing_section";
import NewArrivalSection from "./components/new_arrival_section";

const LandingPage = () => {
    return ( 
        <div>
            <LandingSection/>
            <NewArrivalSection/>
            <ForumSection/>
        </div>
    );
}
 
export default LandingPage;