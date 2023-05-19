import { Route, Routes, Link, useNavigate } from "react-router-dom";
import React from "react";

function CreateCV (){
        const navigate = useNavigate();

        function nav(){
            navigate("/PersonalInfo", {replace:true});
        }


    return (
        <div className="create">
            <h1>Nice to See you here</h1>
            <button className="btn-submit btn btn-success"  onClick={nav}>Click here to start Creating Your CV</button>
            <Routes>
                <Route path="/PersonalInfo" element={<CreateCV />}></Route>
                </Routes>
        </div>

    )
}

export default CreateCV;