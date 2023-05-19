import "./NavBar.css"
import { Route, Routes, Link } from "react-router-dom";
import WorkExperince from "./components/WorkExperince"
import Education from "./components/Education"
import Languages from "./components/Languages"
import Contact from "./components/Contact"
import PersonalInfo from "./components/PersonalInfo"
import CreateCV from "./components/CreateCV"
import React from "react";

function NavBar() {
    const [underLine1, setUnderLine1] = React.useState({
        textDecoration: "none"
    })
    const [underLine2, setUnderLine2] = React.useState({
        textDecoration: "none"
    })
    const [underLine3, setUnderLine3] = React.useState({
        textDecoration: "none"
    })
    const [underLine4, setUnderLine4] = React.useState({
        textDecoration: "none"
    })
    const [underLine5, setUnderLine5] = React.useState({
        textDecoration: "none"
    })

    function Checked1() {
        setUnderLine1({ textDecoration: "underline" })
        setUnderLine2({ textDecoration: "none" })
        setUnderLine3({ textDecoration: "none" })
        setUnderLine4({ textDecoration: "none" })
        setUnderLine5({ textDecoration: "none" })


    }
    function Checked2() {
        setUnderLine2({ textDecoration: "underline" })
        setUnderLine1({ textDecoration: "none" })
        setUnderLine3({ textDecoration: "none" })
        setUnderLine4({ textDecoration: "none" })
        setUnderLine5({ textDecoration: "none" })
    }
    function Checked3() {
        setUnderLine3({ textDecoration: "underline" })
        setUnderLine1({ textDecoration: "none" })
        setUnderLine2({ textDecoration: "none" })
        setUnderLine4({ textDecoration: "none" })
        setUnderLine5({ textDecoration: "none" })
    }
    function Checked4() {
        setUnderLine4({ textDecoration: "underline" })
        setUnderLine1({ textDecoration: "none" })
        setUnderLine2({ textDecoration: "none" })
        setUnderLine3({ textDecoration: "none" })
        setUnderLine5({ textDecoration: "none" })
    }
    function Checked5() {
        setUnderLine5({ textDecoration: "underline" })
        setUnderLine1({ textDecoration: "none" })
        setUnderLine2({ textDecoration: "none" })
        setUnderLine3({ textDecoration: "none" })
        setUnderLine4({ textDecoration: "none" })
    }
    return (
        <div>
            <nav>
                <Link onClick={Checked1} style={underLine1} to="/PersonalInfo/" className="nav-item">Personal Info</Link>
                <Link onClick={Checked2} style={underLine2} to="/WorkExperince/" className="nav-item">Work Experience</Link>
                <Link onClick={Checked3} style={underLine3} to="/Education/" className="nav-item">Education</Link>
                <Link onClick={Checked4} style={underLine4} to="/Languages/" className="nav-item">Languages</Link>
                <Link onClick={Checked5} style={underLine5} to="/Contact/" className="nav-item">Contact Me</Link>
            </nav>
            <Routes>
                <Route path="*" element={<CreateCV />}></Route>
                <Route path="/PersonalInfo//*" element={<PersonalInfo />}></Route>
                <Route path="/WorkExperince//*" element={<WorkExperince />}></Route>
                <Route path="/Education//*" element={<Education />}></Route>
                <Route path="/Languages//*" element={<Languages />}></Route>
                <Route path="/Contact//*" element={<Contact />}></Route>
            </Routes>
        </div>
    );
}

export default NavBar;