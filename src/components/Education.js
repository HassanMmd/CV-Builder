import React from "react";
import EducationCard from "./Cards/EducationCard"
import "./Pages.css"
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth"

function Education() {
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


    const [id, setId] = React.useState("");
    const [name, setName] = React.useState("");
    const [school, setSchool] = React.useState("");
    const [isReady, setIsReady] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [error, setError] = React.useState(null);
    const [country, setCountry] = React.useState("");
    const [start_date, setStart_date] = React.useState("");
    const [end_date, setEnd_date] = React.useState("");
    const [info, setInfo] = React.useState([]);
    const [formData, setFormData] = React.useState({
        "id": id,
        "name": name,
        "school": school,
        "country": country,
        "start_date": start_date,
        "end_date": end_date
    });


    const addData = async (e) => {
        e.preventDefault();
        setMessage("Submiting...")

        if (auth.currentUser == null) {
            await signInAnonymously(auth)
        }
        return auth.currentUser.getIdToken().then(async token => {
            console.log(token)
            await fetch("https://us-central1-cv-builder-327dd.cloudfunctions.net/api/education",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(formData),
                }
            )
                .then((response) => {
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
        });
    }


    function restForm() {
        formData.name = ""
        formData.school = ""
        formData.country = ""
        formData.start_date = ""
        formData.end_date = ""
    }

    const getData = async () => {
        setIsReady(false)
        if (auth.currentUser == null) {
            await signInAnonymously(auth)
        }
        return auth.currentUser.getIdToken().then(async token => {
            console.log(token)
            await fetch("https://us-central1-cv-builder-327dd.cloudfunctions.net/api/education",
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


    function changeHandler(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <div>
            <hr />
            <div className="title">
                <h1>Education</h1>
            </div>
            <section>
                <div>
                    <article className="services services1">
                        <h2>your Education:</h2>
                        {!isReady && <div className="loading">Loading...</div>}
                        <div className="info-list">
                            {error && <div className="error">{error}</div>}
                            {info.map(
                                (e) => {
                                    return (<div>
                                        <EducationCard
                                            info={e}
                                            getData={getData}
                                        />
                                    </div>

                                    )
                                })}
                        </div>

                    </article>
                </div>
                <div>
                    <article className="services services2">
                        <h2>Add your Education:</h2>

                        <form onSubmit={addData}>
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
                            <button type="submit" className="btn-submit btn btn-success">Submit</button>
                            {message && <div className="message">{message}</div>}
                        </form>
                    </article>
                </div>
            </section>
        </div>

    );
}
export default Education;