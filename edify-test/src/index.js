import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import axios from 'axios';
import reportWebVitals from './reportWebVitals';
import $ from 'jquery'
import DatePicker from 'react-datepicker';
import ls from 'local-storage'
import Modal from './component/Modal'
import BikeWheel from './BikeWheel.svg';
import 'react-datepicker/dist/react-datepicker.css';
require('dotenv').config()
const callRefreshURL = 'https://www.strava.com/oauth/token?client_id='+process.env.REACT_APP_client_id+'&client_secret='+process.env.REACT_APP_client_secret+'&refresh_token='+process.env.REACT_APP_refresh_token+'&grant_type=refresh_token'

class Container extends React.Component {
	constructor(props) {
		super(props)
		this.removeFavorite = this.removeFavorite.bind(this)
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
			delay: 0,
			favorited: [],
			favoritedImageURL: [],
			showModal: false
		}
	}
	componentDidMount() {
		axios.post(callRefreshURL).then(results => {
			let access_token = results.data.access_token
			this.setState({
				favoritedImageURL: ls.get('favorited') || [],
				access_token: access_token,
			})
			this.getActivites(null, 0)
		})
	}
	getActivites(filterNumber, delay) {
		if (this.state.access_token) {
			let num = filterNumber !== null ? filterNumber : '20'
			if (filterNumber)
				this.setState({
					DatesSelected: false,
					startDate: new Date(),
					startDate: new Date()
				})
			
			let originalFilteredList = this.state.filteredList
			let originalFilteredDetail = this.state.filteredDetail
			const URL = 'https://www.strava.com/api/v3/athlete/activities?per_page='+num+'&access_token='+this.state.access_token
			if (this.state.activities.length > 0) {
				this.setState({
					activities: [],
					imageURL: [],
				})
			}
			
			if (delay > 0 && this.state.DatesSelected) {
				this.setState({
					filteredList: [],
					filteredDetail: []
				})
			}
			setTimeout(() => {
				this.setState({
					filteredList: originalFilteredList,
					filteredDetail: originalFilteredDetail
				})
				axios.get(URL, {method: 'GET'}).then(results => {
					this.setState({
						activities: results.data
					})
					this.getMaps(filterNumber !== null)
				})
			}, delay);
		}
	}
	getMaps(sideBarSelection) {
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
				console.log(ls.get('favorited'))
				if (ls.get('favorited')?.includes(element.id) && !sideBarSelection) {
					this.setState({
						favoritedImageURL: this.state.favoritedImageURL.concat(image)
					})
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
	handleClick(id) {
		let currentFavorited = this.state.favoritedImageURL.slice(0);
		let newElement
		if (!this.state.favoritedImageURL.find(element => element.id == id)) {
			this.state.imageURL.forEach(element => {
				if (element.id == id) {
					newElement = element
					this.setState({
						favoritedImageURL: this.state.favoritedImageURL.concat(element)
					})
				}
			})
			//  creating variable representing current saved article list plus newly article list:
			let newFavorited = [...currentFavorited, newElement]

			//  updating React state with variable:
			this.setState({
				favoritedImageURL: newFavorited,
			});

			//  updating localStorage state with same variable:
			ls.set('favorited', newFavorited)
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
	getClassName() {
		return this.state.listOrDetail ? 'list-box' : 'flex-box'
	}
	showModal = e => {
		this.setState({
			showModal: !this.state.showModal
		})
	}
	removeItem(arr, value) {
		var index = arr.indexOf(value);
		if (index > -1) {
		  arr.splice(index, 1);
		}
		return arr;
	  }
	removeFavorite(id) {
		let removeNode = this.state.favoritedImageURL.find(element => {
			if (element.id == id)
				return element
		})
		let tempArray = this.state.favoritedImageURL
		tempArray = this.removeItem(tempArray, removeNode)
		this.setState({favoritedImageURL: tempArray})
		ls.set('favorited', tempArray)
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
		const loadingAnimation = () => {
			return (
				<div className='loading' href="#"><img width="400" height="400" src={BikeWheel} /></div>
			)
		}
		return (this.state.access_token ? <div className="container">
			{this.state.activities.length != 0 ? null : loadingAnimation()}
			<Modal onClose={this.showModal} show={this.state.showModal} selections={this.state.favoritedImageURL} remove={this.removeFavorite}></Modal>
			<div className="maps">
				{this.state.DatesSelected ? 
					<div className={this.getClassName()}>{this.state.listOrDetail ? this.state.filteredList : this.state.filteredDetail}</div> : 
					<div className={this.getClassName()}>{this.state.listOrDetail ? list : maps}</div>}
			</div>
			<div className='filter'>
				<ul id="myUL">
					<li><a onClick={() => this.switchView()}>{this.state.listOrDetail ? 'Detail View' : 'List View'}</a></li>
					<li><a onClick={() => this.getActivites('20')}>20 Activities</a></li>
					<li><a onClick={() => this.getActivites('200')}>All Activities</a></li>
					<li>{ls.get('favorited')?.length > 0 ? <a onClick={() => this.showModal()}>Favorites</a> : null}</li>
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
