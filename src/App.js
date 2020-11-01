import React from 'react';
import Particles from 'react-particles-js';
import './App.css';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';




const particlesOptions = {
  particles: {
    number : {
      value : 200,
      density: {
        enable : true,
        value_area : 800
      } 
    }
  }
}

const initialState = {
    input : '',
    imageURL : '',
    box : {},
    route : 'SignIn',
    isSignedIn : false,
    user : {
      id : "",
      name: "",
      email : "",
      entries : 0,
      joined : '',
    }
}

class App extends React.Component {
  constructor(){
    super();
    this.state = {
      input : '',
      imageURL : '',
      box : {},
      route : 'SignIn',
      isSignedIn : false,
      user : {
        id : "",
        name: "",
        email : "",
        entries : 0,
        joined : '',
      }
    }
  }

  componentDidMount(){
    fetch('https://git.heroku.com/agile-waters-59493.git/')
      .then(response => response.json())
      .then(console.log);
  }

  loadUser = (data) => {
    this.setState({user : {
        id : data.id,
        name : data.name,
        email : data.email,
        entries : data.entries,
        joined : data.joined
      }
    });
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const height = Number(image.height);
    const width = Number(image.width);
    return {
      leftCol : clarifaiFace.left_col * width,
      topRow : clarifaiFace.top_row * height,
      rightCol : width - (clarifaiFace.right_col * width),
      bottomRow : height - (clarifaiFace.bottom_row * height)
    }
  }

  
  displayFaceBox = (box) => {
    this.setState({box : box});
  } 
   
  onInputChange = (event) => {
    this.setState({input : event.target.value})
  }

  onRouteChange = (route) => {
    if(route === 'SignOut'){
      this.setState(initialState);
    }else if(route === 'Home'){
      this.setState({isSignedIn : true});
    }
    this.setState({route : route});
  }

  onButtonSubmit = () => {
    this.setState({imageURL : this.state.input});
    fetch('https://git.heroku.com/agile-waters-59493.git/imageurl', {
      method : 'post',
      headers : {'Content-Type': 'application/json'},
      body : JSON.stringify({
        input : this.state.input
      })
    })
    .then(response => response.json())
    .then(response => {
      if(response){
        fetch('https://git.heroku.com/agile-waters-59493.git/image', {
            method : 'put',
            headers : {'Content-Type': 'application/json'},
            body : JSON.stringify({
              id : this.state.user.id
          })
        })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user , {entries : count}))
          })
      this.displayFaceBox(this.calculateFaceLocation(response))
      }
    })
    .catch(err => console.log(err))
      // there was an error
  }
  render(){
    const {isSignedIn , box, imageURL, route ,user} = this.state;
    return (
      <div className = "App">
      <Particles className = 'particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn = {isSignedIn} onRouteChange = {this.onRouteChange}/>
      { route === 'Home' 
        ?<div>
          <Logo />
          <Rank userName = {user.name} userEntries = {user.entries} />
          <ImageLinkForm 
            onInputChange={this.onInputChange} 
            onButtonSubmit= {this.onButtonSubmit}
          />
          <FaceRecognition box = {box} faceDetectURL = {imageURL} />
        </div>
        : (
          this.state.route === 'SignIn' 
          ?<SignIn loadUser = {this.loadUser} onRouteChange = {this.onRouteChange}/>
        : <Register loadUser = {this.loadUser} onRouteChange = {this.onRouteChange}/>
      )}
      </div>

    );
  }
  
}

export default App;
