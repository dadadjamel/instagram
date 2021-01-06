import React, { Component, useState } from 'react';
import { Input, Button, StepIcon } from "@material-ui/core"
import { storage, db } from './firebase'
import firebase from 'firebase'
import './imageuploader.css'

const ImageUpload = ({ username }) => {
    const [caption, setcaption] = useState('')
    const [image, setimage] = useState(null)
    const [progress, setprogress] = useState(0)
    // const [url,seturl] = useState('')

    const handlechange = (e) => {
        if (e.target.files[0]) {
            setimage(e.target.files[0])
        }
    }

    const handleupload = () => {
        const uploadtask = storage.ref(`images/${image.name}`).put(image)
        uploadtask.on(
            "state_changed",
            (snapshot) => {
                // progress func
                const progress = Math.round(snapshot.bytesTransferred / snapshot.totalBytes * 100)
                setprogress(progress)
            },
            (error) => {
                console.log(error)
                alert(error.message)
            },
            () => {
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        db.collection("posts").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            image: url,
                            username: username
                        })
                        setprogress(0)
                        setimage(null)
                        setcaption('')
                    })
            }
        )
    }

    return (
        <div className="imageuploader">
            <progress className='imageuploader__progress' value={progress} max="100" />
            <Input placeholder='Caption here...' type="text" value={caption} onChange={(e) => setcaption(e.target.value)} />
            <input onChange={handlechange} type='file' />
            <Button onClick={handleupload} >Upload 👍👍</Button>
        </div>
    );
}

export default ImageUpload;