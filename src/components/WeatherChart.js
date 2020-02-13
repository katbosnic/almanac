import React, { Component } from 'react'; 
import Chart from 'chart.js';

class WeatherChart extends Component {


    componentDidMount() {
        this.drawChart()
    }

    componentDidUpdate() {
        if (!this.props.showUpdate) {
            this.drawChart()
        }
    }

    convertToCelcius = (faren) => {
        let convertedNumber = ((faren - 32) * 5) / 9
        return convertedNumber.toFixed(2)
    }

    drawChart = () => {
        Chart.defaults.global.defaultFontSize = 20;
        var ctx = document.getElementById('myChart');
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.props.currentWeek,
                datasets: [{
                    label: 'Temperature (°C)',
                    data: [this.convertToCelcius(this.props.currentWeather.daily.data[0].apparentTemperatureHigh),
                        this.convertToCelcius(this.props.currentWeather.daily.data[1].apparentTemperatureHigh),
                        this.convertToCelcius(this.props.currentWeather.daily.data[2].apparentTemperatureHigh),
                        this.convertToCelcius(this.props.currentWeather.daily.data[3].apparentTemperatureHigh),
                        this.convertToCelcius(this.props.currentWeather.daily.data[4].apparentTemperatureHigh),
                        this.convertToCelcius(this.props.currentWeather.daily.data[5].apparentTemperatureHigh),
                        this.convertToCelcius(this.props.currentWeather.daily.data[6].apparentTemperatureHigh),
                        this.convertToCelcius(this.props.currentWeather.daily.data[7].apparentTemperatureHigh)],
                    borderColor: 'rgba(178, 34, 34 , 1)',
                    backgroundColor: 'rgba(255, 249, 187, 0.5)',
                    borderWidth: 4
                }]
            },
            options: {
                maintainAspectRatio: true,
                aspectRatio:1,
                scales: {
                    xAxes: [{
                        ticks: {
                            fontSize: 20,
                            padding: 20
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: false,
                            fontSize: 20,
                            padding: 20
                        }
                    }]
                },
                tooltips: {
                    titleFontSize: 20,
                    bodyFontSize: 20
                }
                
                
            }
        });
        
    }

    render() {
        return(

            <div className="chart-container">
                <canvas id="myChart"></canvas>
            </div>
        )
    }
}

export default WeatherChart;