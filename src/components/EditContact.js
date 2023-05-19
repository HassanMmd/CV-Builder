import "./Pages.css"
import React, { useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth"
import { useNavigate, Route, Routes } from "react-router-dom";
import Contact from "./Contact";

function EditContact(props) {
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
        "data": props.info.data,
        "type": props.info.type
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
            await fetch(`https://us-central1-cv-builder-327dd.cloudfunctions.net/api/contact/${props.info.id}`,
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
            navigate("/Contact", {replace:true});
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
              <label htmlFor="data">Your {formData.type}</label>
              <input type="text" className="form-control" id="data" name="data" value={formData.data} onChange={changeHandler} ></input>
              <label htmlFor="type">Via</label>
              <select className="form-select" id="type" name="type" value={formData.type} onChange={changeHandler} >
                <option>EMAIL</option>
                <option>PHONE</option>
                <option>LINKED_IN</option>
                <option>GITHUB</option>
                <option>WEBSITE</option>
                <option>PORTFOLIO</option>
                <option>LINK</option>
              </select>
                <button type="submit" className="btn-submit btn btn-success">Save</button>
                {message && <div className="message">{message}</div>}
            </form>
            <Routes>
                <Route path="/Contact" element={<Contact />}></Route>
            </Routes>
    </div>


        </div>

    );
}

export default EditContact;