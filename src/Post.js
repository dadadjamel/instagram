import React, { Component, useState, useEffect } from 'react';
import './Post.css'
import { Avatar, Input, Button } from "@material-ui/core"
import { db } from './firebase'
import firebase from 'firebase'


const Post = ({ user, username, caption, image, postid }) => {
    const [comments, setcomments] = useState([])
    const [comment, setcomment] = useState('')

    useEffect(() => {
        let unsubscribe
        if (postid) {
            unsubscribe = db.collection('posts').doc(postid).collection('comments').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
                setcomments(snapshot.docs.map(doc => doc.data()))
            })
        }

        return () => {
            unsubscribe()
        }

    }, [postid])

    const postcomment = (e) => {
        e.preventDefault()
        db.collection('posts').doc(postid).collection('comments').add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
        setcomment('')
    }

    return (
        <div className="post">

            <div className="post__header" >
                <Avatar className="post__avatar" alt={username} src="/static/images/avatar/1.jpg" />
                <h3>{username}</h3>
            </div>

            <img className="post__image"
                src={image} />
            <h4 className="post__text"><strong>{username} :</strong>{caption}</h4>
            <div className='post__comments' >
                {
                    comments.map(comment => (
                        <p>
                            <strong>{comment.username}</strong>: {comment.text}
                        </p>
                    ))
                }
            </div>

            {user && (
                <form className='post__commentbox' >
                    <Input className='post__input' placeholder='write comment here' value={comment} onChange={(e) => setcomment(e.target.value)} />
                    <Button className='post__button' disabled={!comment} type='submit' onClick={postcomment} >Post</Button>
                </form>
            )}

        </div>
    );
}

export default Post;