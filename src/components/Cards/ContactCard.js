import "./Card.css"
import React from "react";
import { initializeApp } from "firebase/app";
import {getAuth, signInAnonymously} from "firebase/auth"
import { Route, Routes, Link, useNavigate } from "react-router-dom";
import EditContact from "../EditContact";

function Card(props) {

    const [isClicked,setIsClicked] =React.useState(false)
    const [message, setMessage] = React.useState("");

    const navigate = useNavigate();

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
    const deleteData = async (e) => {
        e.preventDefault();
        setMessage("Submiting...")

            if(auth.currentUser==null){
             await signInAnonymously(auth)
            }
               return auth.currentUser.getIdToken().then(async token=>{
                console.log(token)
       await  fetch(`https://us-central1-cv-builder-327dd.cloudfunctions.net/api/contact/${props.info.id}`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            }
        ).then((response) =>{
            if(response.ok){
             setMessage("Success")
            return response
            }
            else if (!response===200){
             throw Error('Could not fetch the data')
            }
           }).catch(err=>{
             setMessage(err.message)
           })
           props.getData()
        })}

    const app = initializeApp(firebaseConfig);
    let auth = getAuth(app);

    function nav(){
        setIsClicked(true);
        navigate("/Contact/EditContact", {replace:true});
    }

    return (
        <div className="card .bg-body mb-3" >
           {!isClicked &&  <div className="delete-edit">
                <button onClick={nav} className="edit-btn">Edit</button>
                <button onClick={deleteData} className="delete-btn">Delete</button>
            </div>}
            <div className="card-body">
                <h5 className="card-title">{props.info.data}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{props.info.type}</h6>
            </div>
            {isClicked && <Routes>
                <Route path="EditContact" element={<EditContact info={props.info} />}></Route>
            </Routes>}
        </div>
    );
}

export default Card;