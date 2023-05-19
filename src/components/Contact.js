import React from "react";
import ContactCard from "./Cards/ContactCard"
import "./Pages.css"
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth"


function Contact() {
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
  const [isReady, setIsReady] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState(null);
  const [data, setData] = React.useState("");
  const [type, setType] = React.useState("EMAIL");
  const [info, setInfo] = React.useState([]);
  const [formData, setFormData] = React.useState({
    "id": id,
    "data": data,
    "type": type
  });

  const addData = async (e) => {
    e.preventDefault();
    setMessage("Submiting...")
    if (auth.currentUser == null) {
      await signInAnonymously(auth)
    }
    return auth.currentUser.getIdToken().then(async token => {
      console.log(token)
      await fetch("https://us-central1-cv-builder-327dd.cloudfunctions.net/api/contact",
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
    formData.data = ""
    formData.type = ""
  }


  const getData = async () => {
    setIsReady(false)
    if (auth.currentUser == null) {
      await signInAnonymously(auth)
    }
    return await auth.currentUser.getIdToken().then(async token => {
      console.log(token)
      await fetch("https://us-central1-cv-builder-327dd.cloudfunctions.net/api/contact",
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
        <h1>Contact</h1>
      </div>

      <section>
        <div>
          <article className="services services1">
            <h2>your Information:</h2>
            {!isReady && <div className="loading">Loading...</div>}
            <div className="info-list">
              {error && <div className="error">{error}</div>}
              {info.map(
                (e) => {
                  return (<div>
                    <ContactCard
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
            <h2>Add your Information:</h2>

            <form onSubmit={addData}>
              <label htmlFor="data">Your {formData.type}</label>
              <input type="text" className="form-control" id="data" name="data" value={formData.data} onChange={changeHandler} required></input>
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
              <button type="submit" className="btn-submit btn btn-success">Submit</button>
              {message && <div className="message">{message}</div>}
            </form>
          </article>
        </div>
      </section>
    </div>

  );
}
export default Contact;