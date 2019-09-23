import React, { Component } from 'react'; 
import axios from 'axios';
import Chart from '../components/WeatherChart.js';

class InputForm extends Component {
    constructor() {
        super();
        this.state = {
            userSearch: '',
            position: -1,
            locations: [],
            showAutocomplete: false,
            showWeatherData: false
        }
    }

    handleAutocomplete = (event) => {
        this.setState({userSearch: event.target.id, position: 0})
        
        const elements = document.querySelectorAll('.autocomplete-items.highlighted')
        
        for (let i = 0; i < elements.length; i++) {
            elements[i].classList.remove('highlighted')
        }
    }

    handleChange = (event) => {
        this.setState({
            userSearch: event.target.value,
            showAutocomplete: true
        })
         
        if (event.target.value.length > 0 ) {
            this.handleSubmit(event)
        }
        this.setState({position: -1})
    }

    handleKeyDown = (event) => {
        let {position, locations} = this.state
        if (event.which === 13) {
      
          this.setState({locations: [], position: -1})
          this.callForLatAndLon(event.target.value)
          
        } else if (event.which !== 38 && event.which !== 40) {
          
          this.setState({locations: [], position: -1})
          
        } else if (event.which === 38) {
          if (position === 0) {
            this.setState({
              position: locations.length
            })
          }
          this.setState( prevState => ({
            position: prevState.position - 1
          }))
        } else if (event.which === 40) {
          if (position === locations.length - 1) {
            this.setState({
              position: -1
            })
          }
          this.setState( prevState => ({
            position: prevState.position + 1
          }))
        }
        
      }
      
      handleKeyUp = (e) => {
        let {position, locations} = this.state
        console.log(locations)
        if (e.which === 38 || e.which === 40) {
            if (typeof locations === 'object'){
              if(locations.length > 0) {
                if (document.getElementById("autocomplete")) {
                  let child = document.getElementById("autocomplete").childNodes[position];
                  console.log(child)
                  if (e.which === 40 && position < locations.length && position >= 0) {
                    const elements = document.querySelectorAll('.autocomplete-items.highlighted')
                    for (let i = 0; i < elements.length; i++) {
                      elements[i].classList.remove('highlighted')
                    }
                    child.classList.add('highlighted')
                    if (typeof child !== undefined) {
                      this.setState({userSearch: child.innerHTML})
                    }
                  } else if (e.which === 38 && position >= 0) {
                    const elements = document.querySelectorAll('.autocomplete-items.highlighted')
                    for (let i = 0; i < elements.length; i++) {
                      elements[i].classList.remove('highlighted')
                    }
                    child.classList.add('highlighted')
                    if (typeof child !== undefined) {
                      this.setState({userSearch: child.innerHTML})
                    }
                  } 
                }
              }
            }
          }
        }
        
      callForLatAndLon = (search) => {
        axios.get(`https://us1.locationiq.com/v1/search.php?key=2eecb79c137d15&q=${search}&format=json`).then(response => {
         
        this.callForWeather(response.data[0].lat, response.data[0].lon)

        this.setState({
          showAutocomplete: false,
          showWeatherData: true,
          
        })
          
        }).catch(error => {  // If nothing matched, something went wrong on your end!
            console.log(error)
        })
      }

      callForWeather = (lat, lon) => {
        
        axios.get(`https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/ee21bf7ee595fdaabb455ae45c8d6bca/${parseFloat(lat).toFixed(2)},${parseFloat(lon).toFixed(2)}`).then(response => {
        
        console.log(response)
          
        }).catch(error => {  // If nothing matched, something went wrong on your end!
            console.log(error)
        })
      }


      handleSubmit = (event) => {
    
      event.preventDefault();
      
      axios.get(`https://us1.locationiq.com/v1/search.php?key=2eecb79c137d15&q=${event.target.value}&format=json`).then(response => {
          this.setState({
              locations: response.data
          })
      }).catch(error => {  // If nothing matched, something went wrong on your end!
          console.log(error)
      })
    }


    
    handleClick = (event) => {
      event.preventDefault();
      this.callForLatAndLon(event.target.innerHTML)
        
    }

    
    render() {
        return(
            <div className="search-container">
                <label htmlFor="search">Please input your location!</label> 
                <input id="search" value={this.state.userSearch} type="text" id="search" placeholder="e.g. Guelph, ON" onChange={this.handleChange} onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp} ></input>
                {this.state.showAutocomplete ? 
                <ul id="autocomplete" className="autocomplete">
                    {this.state.locations.map((location, n) => {
                    return(
                        <li key={n} id={`${location.display_name}`} className="autocomplete-items" onMouseOver={this.handleAutocomplete} onClick={this.handleClick}>{location.display_name}</li>
                        )
                    })} 
                </ul> : null}
                {this.state.showWeatherData ? <Chart /> : null}
                
            </div>
        )
    }
}

export default InputForm;