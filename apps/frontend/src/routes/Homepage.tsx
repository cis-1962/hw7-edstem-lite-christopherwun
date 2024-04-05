import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import Modal from 'simple-react-modal'
import Navbar from '../components/Navbar';
import '../app.css';
import PostList from '../components/PostList';
import PostBody from '../components/PostBody';

export default function Homepage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null) 
  const [focusedPost, setFocusedPost] = useState(null)

  const [showModal, setShowModal] = useState(false)
  const [question, setQuestion] = useState('')

  // check if user is logged in, making sure to pass the proper authorization headers
  useEffect(() => {
    fetch('http://localhost:8000/api/account/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    }).then((res) => {
      if (res.status === 200) {
        res.json().then((data) => {
          setUser(data.username)
        })
      } else if (res.status === 401) {
        setUser(null)
      } else {
        // eslint-disable-next-line no-alert 
        alert(`User fetch failed: ${  res.statusText}`)
      }
    })
  }, [user])

  function logout() {
    fetch('http://localhost:8000/api/account/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    }).then((res) => {
      if (res.status === 200) {
        setUser(null)
      }
    })
  }

  function sendPost() {
    fetch('http://localhost:8000/api/questions/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        questionText: question
      })
    }).then((res) => {
      if (res.status === 201) {
        setQuestion('')
        setShowModal(false)
      } else {
        // alert the user if the post failed
        // allow alert and string concat (disable prettier for this line)
        // eslint-disable-next-line no-alert 
        alert(`Post failed: ${  res.statusText}`)
      }
    })
  }

  return (
    <div className="homepage">
      {/* Modal should appear on top of everything */}
      <Modal 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        className="modal"
        style={{background: 'grey', opacity: '0.9'}}
        >
        <div>
          <h2>Post a question</h2>
          <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} className="input"/>
          <button onClick={sendPost}>Post</button>
        </div>
      </Modal>
      {/* Topmost div for title + login/logout buttons*/}
      <Navbar user={user} logout={logout} toLogin={() => navigate('/login')} />

      {/* Main div for post button (if logged in), posts */}
      <div className="main">
        {/* Left div for list of posts and post button */}
        <PostList user={user} makePost={() => setShowModal(true)} setFocusedPost={setFocusedPost} />

        {/* Right div for actual post body and answer button */}
        <PostBody focusedPost={focusedPost} setFocusedPost={setFocusedPost} user={user} />

      </div>
    </div>
  )
}