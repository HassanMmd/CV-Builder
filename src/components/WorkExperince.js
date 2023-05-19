import "./Pages.css"
import React, { useEffect } from "react";
import WorkCard from "./Cards/WorkCard"
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth"


function WorkExperince() {

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
    const [info, setInfo] = React.useState([]);
    const [formData, setFormData] = React.useState({
        "id":id,
        "role": role,
        "company": company,
        "freelance": freelance,
        "start_date": start_date,
        "end_date": end_date,
        "details": details,
        "freelance":freelance,
        "current":true,
        "remote":false
    });


    const addData = async (e) => {
        e.preventDefault();
        setMessage("Submiting...")

        if (auth.currentUser == null) {
            await signInAnonymously(auth)
        }
        return auth.currentUser.getIdToken().then(async token => {
            console.log(token)
            await fetch("https://us-central1-cv-builder-327dd.cloudfunctions.net/api/experience",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(formData),
                }
            ).then((response) => {
                if (response.ok) {
                    setMessage("Success")
                    return response
                }
                else if (!response === 200) {
                    throw Error('Could not fetch the data')
                }
            }).catch(err => {
                setMessage(err.message)
            })
            getData();
            restForm();

        })
    }

    function restForm() {
        formData.role = ""
        formData.company = ""
        formData.start_date = ""
        formData.end_date = ""
        formData.details = ""
    }

    const getData = async () => {
        setIsReady(false)
        if (auth.currentUser == null) {
            await signInAnonymously(auth)
        }
        return auth.currentUser.getIdToken().then(async token => {
            console.log(token)
            await fetch("https://us-central1-cv-builder-327dd.cloudfunctions.net/api/experience",
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                }
            )
                .then((response) => {
                    if (!response.ok) {
                        throw Error('Could not fetch the data')

                    }
                    else if (response.ok) {
                        return response.json()
                    }
                })
                .then((data) => {
                    setIsReady(true)
                    return setInfo(data)
                })
                .catch(err => {
                    setError(err.message)
                })
            setMessage("")
        });
    }


    React.useEffect(() => {
        getData();
    }, [])

    console.log(formData)
    console.log("11111111111111111111111111111111")
    console.log(info)
    console.log("3333333333333")
    console.log(load)
    console.log(error)
    console.log(freelance)


    function changeHandler(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <div>
            <hr />
             <div className="title">
                <h1>Work Experience</h1>
            </div>
            <section>
                <div>
                    <article className="services services1">
                        <h2>your Skills:</h2>
                        {!isReady && <div className="loading">Loading...</div>}
                        <div className="info-list">
                            {error && <div className="error">{error}</div>}
                            {info.map(
                                (e) => {
                                    return (
                                        <WorkCard
                                            info={e}
                                            getData={getData} />
                                    )
                                })}
                        </div>
                    </article>
                </div>
                <div>
                    <article className="services services2">
                        <h2>Add your Skills:</h2>
                        <form onSubmit={addData}>
                            <label htmlFor="role" >Role</label>
                            <input type="text" className="form-control" id="role" name="role" value={formData.role} onChange={changeHandler} required maxLength={20}></input>
                            <label htmlFor="company">Company</label>
                            <input type="text" className="form-control" id="company" name="company" value={formData.company} onChange={changeHandler} required maxLength={20}></input>
                            <label htmlFor="startDate">Start_date</label>
                            <input type="date" className="form-control" id="startDate" name="start_date" value={formData.start_date} onChange={changeHandler} required></input>
                            <label htmlFor="endDate">End_date</label>
                            <input type="date" className="form-control" id="endDate" name="end_date" value={formData.end_date} onChange={changeHandler} required></input>
                            <label htmlFor="details" >Details</label>
                            <textarea className="form-control" id="details" name="details" value={formData.details} onChange={changeHandler} required maxLength={50}></textarea>
                            <button type="submit" className="btn-submit btn btn-success">Submit</button>
                            {message && <div className="message">{message}</div>}
                        </form>
                    </article>
                </div>
            </section>
        </div>

    );
}

export default WorkExperince;