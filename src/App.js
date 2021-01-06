import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase'
import { makeStyles } from '@material-ui/core/styles';
import { Modal, Button, Input } from "@material-ui/core"
import ImageUpload from './ImageUpload';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    // border: '2px solid #000',
    // boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [posts, setposts] = useState([])
  const [open, setOpen] = useState(false)
  const [modalStyle] = React.useState(getModalStyle);
  const [username, setusername] = useState('')
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [user, setuser] = useState(null)
  const [opensignin, setopensignin] = useState(false)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in
        console.log(authUser)
        setuser(authUser)
      } else {
        setuser(null)
      }
    })

    return () => {
      unsubscribe()
    }

  }, [user, username])
  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setposts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })))
    })
  }, [])

  const handleSignUp = (e) => {
    e.preventDefault()

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((Error) => alert(Error.message))

    setOpen(false)

  }

  const handlesignin = (e) => {
    e.preventDefault()
    auth.signInWithEmailAndPassword(email, password)
      .catch((Error) => alert(Error.message))

    setopensignin(false)
  }

  return (
    <div className="app">


      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img className="" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" />
            <form className="app__signup">
              <Input placeholder="Username" type='text' value={username} onChange={(e) => setusername(e.target.value)} />
              <Input placeholder="Email" type='email' value={email} onChange={(e) => setemail(e.target.value)} />
              <Input placeholder="Password" type='password' value={password} onChange={(e) => setpassword(e.target.value)} />
              <Button onClick={handleSignUp} type='submit'>Sign Up</Button>
            </form>
          </center>
        </div>
      </Modal>

      <Modal
        open={opensignin}
        onClose={() => setopensignin(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <center>
            <img className="" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" />
            <form className="app__signup">
              <Input placeholder="Email" type='email' value={email} onChange={(e) => setemail(e.target.value)} />
              <Input placeholder="Password" type='password' value={password} onChange={(e) => setpassword(e.target.value)} />
              <Button onClick={handlesignin} type='submit'>Sign In</Button>
            </form>
          </center>
        </div>
      </Modal>

      <div className="app__header">
        <img className="app__headerimage" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" alt="" />

        {user ?
          <Button onClick={() => auth.signOut()}>Logout</Button> :
          <div className="app__auth">
            <Button onClick={() => setOpen(true)}>Sign Up 🚪🚪🚪</Button>
            <Button onClick={() => setopensignin(true)}>Sign In 🔑🔑🔑</Button>
          </div>
        }

      </div>

      <div className="app__posts">
        {
          posts.map(({ id, post }) => (
            // <Post key post={} />
            <Post user={user} key={id} postid={id} username={post.username} caption={post.caption} image={post.image} />
          ))
        }
      </div>

      {user?.displayName ? <ImageUpload username={user.displayName} /> : <h3>You need to login to upload 🔒🔒🔒</h3>}

    </div>
  );
}

export default App;
