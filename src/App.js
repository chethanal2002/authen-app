import React, { useState } from 'react';
import './App.css';
import { v4 as uuid } from 'uuid'; // Import uuid properly

function App() {
  const [image, setImage] = useState('');
  const [uploadResultMessage, setUploadResultMessage] = useState('Please upload an image to authenticate');
  const [visitorName, setVisitorName] = useState('placeholder.jpeg');
  const [isAuth, setAuth] = useState(false);

  function sendImage(e) {
    e.preventDefault();
    setVisitorName(image.name);
    const visitorImageName = uuid();
    fetch(`https://44er32shuj.execute-api.us-east-1.amazonaws.com/dev/images-visitors/${visitorImageName}.jpeg`, {
      method: 'PUT',
      headers: {
        'mode': 'cors', // Consider removing or setting to 'cors' depending on server config
        'Content-Type': 'image/jpeg'
      },
      body: image
    }).then(async () => {
      const response = await authenticate(visitorImageName);
      if (response.Message === 'Success') {
        setAuth(true);
        setUploadResultMessage(`Hi ${response['firstName']} ${response['lastName']}!`);
      } else {
        setAuth(false);
        setUploadResultMessage('Authentication failed. This person is not a student.');
      }
    }).catch(error => {
      setAuth(false);
      setUploadResultMessage('There is an error. Please try again.');
      console.error(error);
    });
  }

  async function authenticate(visitorImageName) {
    const requestUrl = `https://44er32shuj.execute-api.us-east-1.amazonaws.com/dev/student?` + new URLSearchParams({
      objectKey: `${visitorImageName}.jpeg`
    });
    try {
      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json', // Fix typo: 'application.json' -> 'application/json'
          "Access-Control-Allow-Origin":"*",
          "Access-Control-Allow-Credentials":"true",
          "Access-Control-Allow-Methods":"GET,HEAD,OPTIONS,POST,PUT",
          "Access-Control-Allow-Headers": "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers"
      
        }
      });
      return await response.json();
    } catch (error) {
      console.error(error);
      throw new Error('Failed to authenticate');
    }
  }

  return (
    <div className="App">
      <h2>Authentication System</h2>
      <form onSubmit={sendImage}>
        <input type='file' name='image' onChange={e => setImage(e.target.files[0])} />
        <button type='submit'>Authenticate</button> {/* Fix: 'onSubmit' -> 'submit' */}
      </form>
      <div className={isAuth ? 'success' : 'failure'}>{uploadResultMessage}</div> {/* Fix: 'sucsess' -> 'success' */}
      <img src={require(`./visitors/${visitorName}`)} alt="Visitor" height={250} width={250} />
    </div>
  );
}

export default App;
