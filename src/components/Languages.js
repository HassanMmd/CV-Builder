import React from "react";
import LanguageCard from "./Cards/LanguageCard"
import "./Pages.css"
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, getIdToken } from "firebase/auth"

function Languages() {
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
  const [isReady, setIsReady] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [message, setMessage] = React.useState("");
  const [level, setLevel] = React.useState(0);
  const [start_date, setStart_date] = React.useState("");
  const [end_date, setEnd_date] = React.useState("");
  const [details, setDetails] = React.useState("");
  const [info, setInfo] = React.useState([]);
  const [formData, setFormData] = React.useState({
    "id": id,
    "name": name,
    "level": level
  });

  const addData = async (e) => {
    e.preventDefault();
    setMessage("Submiting...")

    if (auth.currentUser == null) {
      await signInAnonymously(auth)
    }
    return auth.currentUser.getIdToken().then(async token => {
      console.log(token)
      await fetch("https://us-central1-cv-builder-327dd.cloudfunctions.net/api/language",
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
    formData.level = 0
  }
  const getData = async () => {
    setIsReady(false)
    if (auth.currentUser == null) {
      await signInAnonymously(auth).then((e) => console.log(e.user.auth))
    }
    return await auth.currentUser.getIdToken().then(async (token) => {
      console.log(token)
      await fetch("https://us-central1-cv-builder-327dd.cloudfunctions.net/api/language",
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
  function changeHandlerSelcet(e) {
    setFormData({ ...formData, [e.target.name]: parseInt(e.target.value) })
  }

  console.log(formData)
  return (
    <div>
      <hr />
      <div className="title">
        <h1>Languages</h1>
      </div>
      <section>
        <div>
          <article className="services services1">
            <h2>your Languages:</h2>
            {!isReady && <div className="loading">Loading...</div>}
            <div className="info-list">
              {error && <div className="error">{error}</div>}
              {info.map(
                (e) => {
                  return (<div>
                    <LanguageCard
                      info={e}
                      getData={getData} />
                  </div>
                  )
                })}
            </div>
          </article>
        </div>
        <div>
          <article className="services services2">
            <h2>Add your Language:</h2>

            <form onSubmit={addData}>
              <label htmlFor="name">Language</label>
              <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={changeHandler} required></input>
              <label htmlFor="level">Your Level</label>
              <select typeof="select" className="form-select" id="level" name="level" value={formData.level} onChange={changeHandlerSelcet} >
                <option value={0}>Beginner</option>
                <option value={1}>Intermediate</option>
                <option value={2}>Advanced</option>
                <option value={3}>Fluent</option>
              </select>
              <button type="submit" className="btn-submit btn btn-success">Submit</button>
              {message && <div className="message">{message}</div>}
            </form>
          </article>
        </div>
      </section>
    </div>

  );
}
export default Languages;