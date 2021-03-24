import React from 'react';
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
export const callRefreshURL = 'https://www.strava.com/oauth/token?client_id='+process.env.REACT_APP_client_id+'&client_secret='+process.env.REACT_APP_client_secret+'&refresh_token='+process.env.REACT_APP_refresh_token+'&grant_type=refresh_token'

class Container extends React.Component {
	constructor(props) {
		super(props)
		this.removeFavorite = this.removeFavorite.bind(this)
		this.state = {
			listOrDetail: false,
			access_token: {},
			activities: [],
			imageURL: [],
			selected: new Map(),
			startDate: new Date(),
			endDate: new Date(),
			DatesSelected: false,
			filteredList: [],
			filteredDetail : [],
			delay: 0,
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
	testApiCall() {
		return axios.post(callRefreshURL)
	}
	getActivites(filterNumber, delay) {
		if (this.state.access_token) {
			let num = filterNumber !== null ? filterNumber : '20'
			if (filterNumber)
				this.setState({
					DatesSelected: false,
					startDate: new Date(),
					endDate: new Date()
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
			const map = 'https://maps.googleapis.com/maps/api/staticmap\?size=600x300&maptype=roadmap\&path=enc:'+element.map.summary_polyline+'\&key='+process.env.REACT_APP_MAPS_KEY
			axios.get(map).then(results => {
				let image = {
					id: element.id,
					url: results.request.responseURL,
					time: element.start_date_local,
					name: element.name
				}
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
	handleClick(id) {
		let currentFavorited = this.state.favoritedImageURL.slice(0);
		let newElement
		if (!this.state.favoritedImageURL.find(element => element.id === id)) {
			this.state.imageURL.forEach(element => {
				if (element.id === id) {
					newElement = element
					this.setState({
						favoritedImageURL: this.state.favoritedImageURL.concat(element)
					})
				}
			})
			let newFavorited = [...currentFavorited, newElement]
			this.setState({
				favoritedImageURL: newFavorited,
			})
			ls.set('favorited', newFavorited)
		}
	}
	tConvert(time) {
		time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
	  
		if (time.length > 1) {
		  time = time.slice (1)
		  time[5] = +time[0] < 12 ? 'AM' : 'PM'
		  time[0] = +time[0] % 12 || 12
		}
		return time.join ('')
	}
	switchView() {
		this.setState({
			listOrDetail: this.state.listOrDetail ? false : true
		})
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
	showModal = e =>{
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
			if (element.id === parseInt(id))
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
						alt=''
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
					<div className='list-node'>
						{activity.name + ' | '
						+ parseInt(activity.distance*0.000621371) +'Miles | '
						+ ' Avrg Heart Rate: ' + activity.average_heartrate
						+ ' | ' + activity.start_date_local.split('T')[0]
						+ ' | ' + this.tConvert(activity.start_date_local.split('T')[1].substr(0, activity.start_date_local.split('T')[1].length-1))}
						{this.state.favoritedImageURL.find(element=>{return element.id===activity.id}) ? <div className='favorited-list-view'> Favorited </div> : <button className='add-to-favorites' onClick={() => this.handleClick(activity.id)}>Add to Favorites</button>}
					</div>
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
								<div className='list-node'>
									{activity.name + ' ' + activity.start_date_local.split('T')[0] + ' ' + this.tConvert(activity.start_date_local.split('T')[1].substr(0, activity.start_date_local.split('T')[1].length-1))}
								</div>
								
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
									alt=''
									src={activity.url}
									onClick={() => this.handleClick(activity.id)}
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
				<div className='loading' href="#"><img alt='' width="400" height="400" src={BikeWheel} /></div>
			)
		}
		return (this.state.access_token ? <div className="container">
			{this.state.activities.length !== 0 ? null : loadingAnimation()}
			<Modal onClose={this.showModal} show={this.state.showModal} selections={this.state.favoritedImageURL} remove={this.removeFavorite}></Modal>
			<div className="maps">
				{this.state.DatesSelected ? 
					<div className={this.getClassName()}>{this.state.listOrDetail ? this.state.filteredList : this.state.filteredDetail}</div> : 
					<div className={this.getClassName()}>{this.state.listOrDetail ? list : maps}</div>}
			</div>
			<div className='filter'>
				<ul id="myUL">
					<li><a className='list-detail-toggle' onClick={() => this.switchView()}>{this.state.listOrDetail ? 'Detail View' : 'List View'}</a></li>
					<li><a className='default-activity-number' onClick={() => this.getActivites('20')}>20 Activities</a></li>
					<li><a className='all-activities' onClick={() => this.getActivites('200')}>All Activities</a></li>
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
export default Container;
