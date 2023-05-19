import React from "react";
import PersonalCard from "./Cards/PersonalCard"
import "./Pages.css"
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth"

function PersonalInfo() {
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
  const auth = getAuth(app);

  const [id, setId] = React.useState("");
  const [isReady, setIsReady] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [message, setMessage] = React.useState("");
  const [name, setName] = React.useState("");
  const [role, setRole] = React.useState("");
  const [brief, setBrief] = React.useState("");
  const [info, setInfo] = React.useState(null);
  const [formData, setFormData] = React.useState({
    "id": id,
    "name": name,
    "role": role,
    "brief": brief
  });
  const addData = async (e) => {
    e.preventDefault();
    setMessage("Submiting...")

    if (auth.currentUser == null) {
      await signInAnonymously(auth)
    }
    return auth.currentUser.getIdToken().then(async token => {
      console.log(token)
      await fetch("https://us-central1-cv-builder-327dd.cloudfunctions.net/api/personal",
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
    formData.role = ""
    formData.brief = ""
  }
  async function getToken() {
    if (auth.currentUser == null) {
      await signInAnonymously(auth).then(e => console.log(e))
    }
    return await auth.currentUser.getIdToken();
  }
  const getData = async () => {
    let idToken;
    setIsReady(false)
    await getToken().then((token) => {
      idToken = token
    })
    console.log(`tttttttttttttttttttttttt ${idToken}`)
    await fetch("https://us-central1-cv-builder-327dd.cloudfunctions.net/api/personal",
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
      }
    )
      .then((response) => {
        console.log(response)
        if (!response.ok) {
          throw Error('Could not fetch the data')

        }
        else if (response.ok) {
          setIsReady(true)
          if (response) {
            setInfo(null)
            console.log(` info ${info}`)
          }
          return response.json()
        }
      })
      .then((data) => {
        console.log(`data ${data}`)
        setIsReady(true)
        console.log(` info ${info}`)
        return setInfo(data)
      })
      .catch(err => {
        setError(err.message)
      })
    setMessage("")
  }
  React.useEffect(() => {
    getData();
  }, [])
  console.log(formData)
  console.log("11111111111111111111111111111111")
  console.log(` info2 ${info}`)
  console.log("22222222222222222222222")
  function changeHandler(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }
  return (
    <div>
      <hr />
      <div className="title">
        <h1>Personal Information</h1>
      </div>
      <section>
        <div>
          <article className="services services1">
            <h2>your Information:</h2>
            {!isReady && <div className="loading">Loading...</div>}
            <div className="info-list">
              {info && <PersonalCard
                information={info}
                getData={getData} />}
            </div>
          </article>
        </div>
        <div>
          <article className="services services2">
            <h2>Add your Information:</h2>

            <form onSubmit={addData}>
              <label htmlFor="name">Name</label>
              <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={changeHandler} required></input>
              <label htmlFor="role">Role</label>
              <input type="text" className="form-control" id="role" name="role" value={formData.role} onChange={changeHandler} required></input>
              <label htmlFor="brief">Brief</label>
              <input type="text" className="form-control" id="brief" name="brief" value={formData.brief} onChange={changeHandler} required></input>
              <button disabled={info}  type="submit" className="btn-submit btn btn-success">Submit</button>
              {message && <div className="message">{message}</div>}
            </form>
          </article>
        </div>
      </section>
    </div>
  );
}
export default PersonalInfo;