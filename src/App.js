import React, { Component } from 'react';
import Particles from 'react-particles-js';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import './App.css';
import Clarifai from 'clarifai'


const particlesOptions = {
  //customize this to your liking
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}
const app = new Clarifai.App({
  apiKey: 'cbad108370cc48afbda03a2f87e2294a'
 });

const initialState = {
  input: '',
  imageUrl: '',
  boxes: [],
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }


  calculateFaceLocation = (data) => {
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return data.outputs[0].data.regions.map(face => {
      const clarifaiFace = face.region_info.bounding_box;
      return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      }
    });
  }

  displayFaceBox = (boxes) => {
    this.setState({boxes: boxes});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

    onButtonSubmit = async () => {
   
    try {
      this.setState({imageUrl: this.state.input});
      const data = await app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      this.displayFaceBox(this.calculateFaceLocation(data))
    }
     catch (error) {
      console.log('unable to work with API')
    }
  }
    

 

  render() {
    const { boxes,imageUrl} = this.state;
    return (
      <div className="App">
         <Particles className='particles'
          params={particlesOptions}
        />
        
        {
          <div>
              <Logo />
             
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
            </div>
        
        }
      </div>
    );
  }
}

export default App;




