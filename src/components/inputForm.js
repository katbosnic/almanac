import React, { Component } from 'react'; 
import axios from 'axios';
import Chart from '../components/WeatherChart.js';
import Swal from 'sweetalert2';

class InputForm extends Component {
    constructor() {
        super();
        this.state = {
          userSearch: '',
          position: -1,
          locations: [],
          showAutocomplete: false,
          showWeatherData: false,
          currentWeather: {}
        }
        this.handleClick = this.handleClick.bind(this)
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
    
    handleClick = (event) => {
      // event.preventDefault();
      this.callForLatAndLon(event.target.innerHTML)
      this.myDate()
    }

    handleKeyDown = (event) => {
        let {position, locations} = this.state
        if (event.which === 13) {
      
          this.setState({locations: [], position: -1})
          this.callForLatAndLon(event.target.value)
          this.myDate()
          
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

        
        }).catch(error => {  // If nothing matched, something went wrong on your end!
            Swal.fire({
              backdrop: `rgba(178,34,34,0.4)`,
              title: 'Sorry, something went wrong. Please try again later.',
              width: 600,
              padding: '3em'
            }) 
        })
      }

      callForWeather = (lat, lon) => {
        
        axios.get(`https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/ee21bf7ee595fdaabb455ae45c8d6bca/${parseFloat(lat).toFixed(2)},${parseFloat(lon).toFixed(2)}`).then(response => {
        
        console.log(response)
        this.setState({
          showAutocomplete: false,
          showWeatherData: true,
          currentWeather: {
            currently: response.data.currently,
            daily: response.data.daily,
            hourly: response.data.hourly,
            minutely: response.data.minutely
          }
        })
          
        }).catch(error => {  // If nothing matched, something went wrong on your end!
          Swal.fire({
            backdrop: `rgba(178,34,34,0.4)`,
            title: 'Sorry, something went wrong. Please try again later.',
            width: 600,
            padding: '3em'
          }) 
        })
      }


      handleSubmit = (event) => {
    
      // event.preventDefault();
      
      axios.get(`https://us1.locationiq.com/v1/search.php?key=2eecb79c137d15&q=${event.target.value}&format=json`).then(response => {
          this.setState({
              locations: response.data
          })
      }).catch(error => {  // If nothing matched, something went wrong on your end!
        Swal.fire({
          backdrop: `rgba(178,34,34,0.4)`,
          title: 'Sorry, something went wrong. Please try again later.',
          width: 600,
          padding: '3em'
        }) 
      })
    }

    myDate = () => {
      const day = new Date();
      const days = new Array(7);
      days[0] = "Sun";
      days[1] = "Mon";
      days[2] = "Tues";
      days[3] = "Wed";
      days[4] = "Thurs";
      days[5] = "Fri";
      days[6] = "Sat";
      this.setState({currentDay: days[day.getDay()]}, () => {
        this.makeWeekdayArray()
      });
      
    }

    splitString = (stringToSplit, separator) => {
      const arrayOfStrings = stringToSplit.split(separator);
      return arrayOfStrings
    }

    makeWeekdayArray = () => {
      const currentDay = this.state.currentDay
      let days = new Array(7);
      days[0] = "Sun";
      days[1] = "Mon";
      days[2] = "Tues";
      days[3] = "Wed";
      days[4] = "Thurs";
      days[5] = "Fri";
      days[6] = "Sat";
      
      const index = days.indexOf(currentDay)
      

      if (currentDay === 'Sun') {
        this.setState({currentWeek: days})
      } else {
        let currentWeek = [days.splice(index, 7 - index) + ',' + days.splice(0, index)]
        this.setState({currentWeek: this.splitString(currentWeek[0], ',')})
      }
    } 

    
    render() {
        return(
            <div className="search-container">
                <label htmlFor="search">Please input your location!</label> 
                <input id="search" value={this.state.userSearch} type="text" placeholder="e.g. Guelph, ON" onChange={this.handleChange} onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp} ></input>
                {this.state.showAutocomplete ? 
                <ul id="autocomplete" className="autocomplete">
                    {this.state.locations.map((location, n) => {
                    return(
                        <li key={n} id={`${location.display_name}`} className="autocomplete-items" onMouseOver={this.handleAutocomplete} onClick={this.handleClick}>{location.display_name}</li>
                        )
                    })} 
                </ul> : null}
                {this.state.showWeatherData ? <Chart currentWeek={this.state.currentWeek} currentWeather={this.state.currentWeather} showUpdate={this.state.showAutocomplete}/> : null}
            </div>
        )
    }
}

export default InputForm;