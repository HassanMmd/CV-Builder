import "./Pages.css"
import React, { useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth"
import { useNavigate, Route, Routes } from "react-router-dom";
import Education from "./Education";

function EditEducation(props) {
    const firebaseConfig = {
        apiKey: "AIzaSyBJZM6jHx6kumiBnxZsrLdmqCdUYfioWyA",
        authDomain: "cv-builder-327dd.firebaseapp.com",
        databaseURL: "https://cv-builder-327dd.firebaseio.com",
        projectId: "cv-builder-327dd",
        storageBucket: "cv-builder-327dd.appspot.com",
        messagingSenderId: "455887527081",
        appId: "1:455887527081:web:15ce6381008f0163",
        measurementId: "G-GZPVRSB54N"
    };

    const app = initializeApp(firebaseConfig);
    let auth = getAuth(app);

    const navigate = useNavigate();

    const [load, setLoad] = React.useState(null);
    const [id, setId] = React.useState("");
    const [isReady, setIsReady] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [error, setError] = React.useState(null);
    const [role, setRole] = React.useState("");
    const [company, setCompany] = React.useState("");
    const [freelance, setFreelance] = React.useState(false);
    const [start_date, setStart_date] = React.useState("");
    const [end_date, setEnd_date] = React.useState("");
    const [details, setDetails] = React.useState("");
    const [formData, setFormData] = React.useState({
        "id": props.info.id,
        "name": props.info.name,
        "school": props.info.school,
        "country": props.info.country,
        "start_date": props.info.start_date,
        "end_date": props.info.end_date
    });

    const editData = async (e) => {
        console.log(`wwwwwwwwwwwwwwwwwwwwwwwwwwwwww`)
        e.preventDefault();
        console.log(`before ${props.info}`)
        setMessage("Submiting...")

        if (auth.currentUser == null) {
            await signInAnonymously(auth)
        }
        return auth.currentUser.getIdToken().then(async token => {
            console.log(token)
            await fetch(`https://us-central1-cv-builder-327dd.cloudfunctions.net/api/education/${props.info.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(formData),
                }
            ).then((response) => {
                if (response.ok) {
                    console.log(`Okkkkkkkkkkkkkkkkkkkkkk ${props.info}`)
                    setMessage("Success")
                    return response
                }
                else if (!response === 200) {
                    console.log(`nooooooooooooooooooooooo ${props.info}`)
                    throw Error('Could not fetch the data')
                }
            }).catch(err => {
                setMessage(err.message)
            })
            navigate("/Education", {replace:true});
            refreshPage();
        })
    }

    function refreshPage() {
        window.location.reload();
      }
    console.log(formData)
    console.log("11111111111111111111111111111111")
    console.log("3333333333333")
    console.log(load)
    console.log(error)
    console.log(freelance)


    function changeHandler(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <div>
             <div className="card .bg-body mb-3" >
        <div className="card-title-edit">
            <h1>Edit</h1>
        </div>
        <form onSubmit={editData}>
                            <label htmlFor="name">Your Education</label>
                            <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={changeHandler} required></input>
                            <label htmlFor="school">School/University</label>
                            <input type="text" className="form-control" id="school" name="school" value={formData.school} onChange={changeHandler} required></input>
                            <label htmlFor="country">Country</label>
                            <input type="text" className="form-control" id="country" name="country" value={formData.country} onChange={changeHandler} required></input>
                            <label htmlFor="startDate">start_date</label>
                            <input type="date" className="form-control" id="startDate" name="start_date" value={formData.start_date} onChange={changeHandler} required></input>
                            <label htmlFor="endDate">end_date</label>
                            <input type="date" className="form-control" id="endDate" name="end_date" value={formData.end_date} onChange={changeHandler} required></input>
                <button type="submit" className="btn-submit btn btn-success">Save</button>
                {message && <div className="message">{message}</div>}
            </form>
            <Routes>
                <Route path="/Education" element={<Education />}></Route>
            </Routes>
    </div>


        </div>

    );
}

export default EditEducation;