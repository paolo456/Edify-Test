import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import axios from 'axios';
import reportWebVitals from './reportWebVitals';
import $ from 'jquery'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
require('dotenv').config()
const callRefreshURL = 'https://www.strava.com/oauth/token?client_id='+process.env.REACT_APP_client_id+'&client_secret='+process.env.REACT_APP_client_secret+'&refresh_token='+process.env.REACT_APP_refresh_token+'&grant_type=refresh_token'

class Container extends React.Component {
	constructor(props) {
		super(props)
		this.reduceData = this.reduceData.bind(this)
		this.state = {
			listOrDetail: false,
			access_token: {},
			activities: [],
			imageURL: [],
			selected: new Map(),
			nextColor: 'red',
			heartrate1: [],
			heartrate2: [],
			distance1: [],
			distance2: [],
			dataID1: '',
			dataID2: '',
			startDate: new Date(),
			endDate: new Date(),
			DatesSelected: false,
			filteredList: [],
			filteredDetail : [],
			delay: 0
		}
	}
	componentDidMount() {
		axios.post(callRefreshURL).then(results => {
			let access_token = results.data.access_token
			this.setState({
				access_token: access_token,
			})
			this.getActivites(null, 0)
		})
	}
	getActivites(filterNumber, delay) {
		if (this.state.access_token) {
			let num = filterNumber !== null ? filterNumber : '20'
			const URL = 'https://www.strava.com/api/v3/athlete/activities?per_page='+num+'&access_token='+this.state.access_token
			if (this.state.activities.length > 0) {
				this.setState({
					activities: [],
					imageURL: [],
				})
			}
			setTimeout(() => {
				axios.get(URL, {method: 'GET'}).then(results => {
					this.setState({
						activities: results.data
					})
					this.getMaps()
				})
			}, delay);
			
		}
	}
	getMaps() {
		this.state.activities.forEach(element => {
			console.log(element)
			const map = 'https://maps.googleapis.com/maps/api/staticmap\?size=600x300&maptype=roadmap\&path=enc:'+element.map.summary_polyline+'\&key='+process.env.REACT_APP_MAPS_KEY
			axios.get(map).then(results => {
				let image = {
					id: element.id,
					url: results.request.responseURL,
					time: element.start_date_local,
					name: element.name
				}
				this.setState({
					imageURL: this.state.imageURL.concat(image),
				})
			})
		})
		
	}
	reduceData(results, toggle) {
		let reducedHeartRate = []
		let metersToMiles = []
		//reduce the array by 10%
		for(let [index, item] of results.data.heartrate.data.entries()) {
			if(index % 20 === 0) {
				reducedHeartRate.push(item)
				metersToMiles.push((results.data.time.data[index]/60).toFixed(0))
			}
		}
		return toggle == 'hr' ? reducedHeartRate : metersToMiles
	}
	handleClick(id, element) {
		const hrURL = 'https://www.strava.com/api/v3/activities/'+id+'/streams?keys=heartrate,time&key_by_type=true&access_token='+this.state.access_token
		
		//change border color
		let red = document.querySelector('.red')
		if (document.querySelectorAll('.selected').length > 1) {
			if (element.target.classList.contains('selected')) {
				this.removeChartDataFromState(element)
				element.target.className = 'tile'
				this.setActivityDescription(id)
			}
			return
		}
		if (!element.target.classList.contains('selected')) {
			if (red) {
				element.target.classList.add('selected', 'blue')
				axios.get(hrURL).then((results) => {
					let id = results.config.url.split('/')[6]
					this.setState({
						dataID1: id,
						heartrate1: this.reduceData(results, 'hr'),
						distance1: this.reduceData(results, 'dist')
					})
				})
			}
			else {
				element.target.classList.add('selected', 'red')
				axios.get(hrURL).then((results) => {
					let id = results.config.url.split('/')[6]
					this.setState({
						dataID2: id,
						heartrate2: this.reduceData(results, 'hr'),
						distance2: this.reduceData(results, 'dist')
					})
				})
			}
				
		}
		else {
			this.removeChartDataFromState(element)
			element.target.className = 'tile'
		}
		this.setActivityDescription(id)
		
	}
	setActivityDescription(id) {
		let label = this.state.activities.find((exercise) => {return exercise.id == id}).name
		let findTime = this.state.activities.find((exercise) => {return exercise.id == id}).start_date_local
		let time = this.tConvert(findTime.split('T')[1].substr(0, findTime.split('T')[1].length-1))
		label = label + ' - ' + time
		this.state.selected.get(id) ? 
		this.state.selected.delete(id) : 
		this.setState({
			selected: this.state.selected.set(id, label)
		})
	}
	tConvert(time) {
		// Check correct time format and split into components
		time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
	  
		if (time.length > 1) { // If time format correct
		  time = time.slice (1);  // Remove full string match value
		  time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
		  time[0] = +time[0] % 12 || 12; // Adjust hours
		}
		return time.join (''); // return adjusted time or original string
	}
	
	removeChartDataFromState(element) {
		element.target.classList.contains('red') ?
			this.setState({
				heartrate2: [],
				distance2: []
			}) :
			this.setState({
				heartrate1: [],
				distance1: []
			})
	}
	clearAll() {
		this.setState({
			heartrate2: [],
			distance2: [],
			heartrate1: [],
			distance1: []
		})
		let selectedElements = document.querySelectorAll('.selected')
		selectedElements.forEach(element => {
			element.className = 'tile'
		})
	}
	switchView() {
		this.setState({
			listOrDetail: this.state.listOrDetail ? false : true
		})
	}
	alertMessage(){
		console.log("Called from outside");
	 }
	 setDelay(event) {
		 this.setState({
			 delay: event.target.value
		 })
	 }
	 afterSubmission(event) {
		event.preventDefault()
		this.getActivites('20', parseInt(this.state.delay))
	 }
	render() {
		let maps = this.state.imageURL.map((activity) => {
			return (
				<div className="tile-container" key={activity.id}>
					<img 
						className='tile'
						src={activity.url}
						onClick={(element) => this.handleClick(activity.id, element)}
						onMouseLeave={(element) => {
							element.target.classList.add('tile-mouse-out')
							let tiles = $('.tile')
							tiles.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
								function() {
									$(this).removeClass('tile-mouse-out')
								}
							)
							}}>
					</img>
					<div className= 'title'>
						{activity.name}
					</div>
				</div>
			)
		})
		let list = this.state.activities.map((activity) => {
			return (
				<div className='list-container' key={activity.id}>
					<a className='list-node'>
						{activity.name + ' ' + activity.start_date_local.split('T')[0] + ' ' + this.tConvert(activity.start_date_local.split('T')[1].substr(0, activity.start_date_local.split('T')[1].length-1))}
					</a>
				</div>
			)
		})
		
		const onChange = dates => {
			const [start, end] = dates;
			this.setState({
				startDate: start,
				endDate: end,
				DatesSelected: start !== null && end !== null ? true : false
			})
			if (start !== null && end !== null) {
				let list = this.state.activities.map((activity) => {
					let date = new Date(activity.start_date_local.split('T')[0].replaceAll('/', '-'))
					if (start.getTime() < date.getTime() && date.getTime() < end.getTime()) {
						return (
							<div className='list-container' key={activity.id}>
								<a>
									{activity.name + ' ' + activity.start_date_local.split('T')[0] + ' ' + this.tConvert(activity.start_date_local.split('T')[1].substr(0, activity.start_date_local.split('T')[1].length-1))}
								</a>
							</div>
						)
					}
				})
				let detail = this.state.imageURL.map((activity) => {
					let date = new Date(activity.time.split('T')[0].replaceAll('/', '-'))
					if (start.getTime() < date.getTime() && date.getTime() < end.getTime()) {
						return (
							<div className="tile-container" key={activity.id}>
								<img 
									className='tile'
									src={activity.url}
									onClick={(element) => this.handleClick(activity.id, element)}
									onMouseLeave={(element) => {
										element.target.classList.add('tile-mouse-out')
										let tiles = $('.tile')
										tiles.one('webkitAnimationEnd oanimationend msAnimationEnd animationend',
											function() {
												$(this).removeClass('tile-mouse-out')
											}
										)
										}}>
								</img>
								<div className='title'>
									{activity.name}
								</div>
							</div>
						)
					}
				})
				this.setState({
					filteredList: list,
					filteredDetail: detail
				})
			}
		}
		
		return (this.state.access_token ? <div className="container">
			
			<div className="maps">
				{this.state.DatesSelected ? 
					<div>{this.state.listOrDetail ? this.state.filteredList : this.state.filteredDetail}</div> : 
					<div>{this.state.listOrDetail ? list : maps}</div>}
			</div>
			<div className='filter'>
				<ul id="myUL">
					<li><a onClick={() => this.switchView()}>{this.state.listOrDetail ? 'Detail View' : 'List View'}</a></li>
					<li><a onClick={() => this.getActivites('10')}>10 - Tiles</a></li>
					<li><a onClick={() => this.getActivites('200')}>All Activities</a></li>
					<li>
						<form className='delay-form'>
							<input className='delay-input' type="text" name='delay' placeholder='Delay in ms' onChange={(event) => this.setDelay(event)}></input>
							<button className='delay-button' onClick={(event) => this.afterSubmission(event)}>Send Delay</button>
						</form>
					</li>
				</ul>
				
			</div>
			
			<div className='calendar'>
				<DatePicker
					selected={this.state.startDate}
					onChange={onChange}
					startDate={this.state.startDate}
					endDate={this.state.endDate}
					selectsRange
					inline
				/>
			</div>
		</div> : <h1>loading</h1>)
	}
}
ReactDOM.render(<Container />, document.getElementById('root'))
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
