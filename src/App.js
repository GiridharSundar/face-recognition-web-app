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
    number: {
      value: 40,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

const initialState = {
    input : '',
    imageURL : '',
    boxes : [],
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
    this.state = initialState;
  }

  componentDidMount(){
    fetch('https://agile-waters-59493.herokuapp.com/')
      .then(response => response.json())
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
    const noOfFaces = data.outputs[0].data.regions.length;
    const clarifaiFaces = data.outputs[0].data.regions;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    let boxes = []
    for( let i = 0; i < noOfFaces; i++){
      boxes.push({
          leftCol: clarifaiFaces[i].region_info.bounding_box.left_col * width,
          topRow: clarifaiFaces[i].region_info.bounding_box.top_row * height,
          rightCol: width - (clarifaiFaces[i].region_info.bounding_box.right_col * width),
          bottomRow: height - (clarifaiFaces[i].region_info.bounding_box.bottom_row * height)      
      })
    }
    return boxes;
  }

  
  displayFaceBox = (boxes) => {
    this.setState({boxes : boxes});
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
    fetch('https://agile-waters-59493.herokuapp.com/imageurl', {
      method : 'post',
      headers : {'Content-Type': 'application/json'},
      body : JSON.stringify({
        input : this.state.input
      })
    })
    .then(response => response.json())
    .then(response => {
      if(response){
        fetch('https://agile-waters-59493.herokuapp.com/image', {
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
    const {isSignedIn , boxes, imageURL, route ,user} = this.state;
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
          <FaceRecognition boxes = {boxes} imageURL = {imageURL} />
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
