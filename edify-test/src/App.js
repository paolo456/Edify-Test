import React, {useState, useEffect, forwardRef, useRef, useImperativeHandle} from 'react';
import './index.css';
import axios from 'axios';
import $ from 'jquery'
import DatePicker from 'react-datepicker';
import ls from 'local-storage'
import Modal from './component/Modal'
import BikeWheel from './BikeWheel.svg';
import 'react-datepicker/dist/react-datepicker.css';
import { setDate } from 'date-fns';
require('dotenv').config()
export const callRefreshURL = 'https://www.strava.com/oauth/token?client_id='+process.env.REACT_APP_client_id+'&client_secret='+process.env.REACT_APP_client_secret+'&refresh_token='+process.env.REACT_APP_refresh_token+'&grant_type=refresh_token'

function Container(props) {
	
	/**
	 constructor(props) {
		super(props)
		this.removeFavorite = this.removeFavorite.bind(this)
		this.props = {
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
	 */
	const [listOrDetail, setListOrDetail] = useState(false)
	const [access_token, setAccessToken] = useState('')
	const [activities, setActivities] = useState([])
	const [imageURL, setImageURL] = useState([])
	const [selected, setSelected] = useState(new Map())
	const [startDate, setStartDate] = useState(new Date())
	const [endDate, setEndDate] = useState(new Date())
	const [DatesSelected, setDatesSelected] = useState(false)
	const [filteredList, setFilteredList] = useState([])
	const [filteredDetail, setFilteredDetail] = useState([])
	const [delay, setDelayState] = useState(0)
	const [favoritedImageURL, SetFavoritedImageURL] = useState([])
	const [showModal, setShowModal] = useState(false)

	useEffect(() => {
		axios.post(callRefreshURL).then(results => {
			let token = results.data.access_token
			SetFavoritedImageURL(ls.get('favorited') || [])
			setAccessToken(token)
			getActivites(null, 0, token)
		})
	}, [])

	const testApiCall = () =>  {
		return axios.post(callRefreshURL)
	}
	const getActivites = (filterNumber, delay, token) => {
		if (token) {
			let num = filterNumber !== null ? filterNumber : '20'
			if (filterNumber) {
				setDatesSelected(false)
				setStartDate(new Date())
				setEndDate(new Date())
			}
			let originalFilteredList = filteredList
			let originalFilteredDetail = filteredDetail
			const URL = 'https://www.strava.com/api/v3/athlete/activities?per_page='+num+'&access_token='+token
			if (activities.length > 0) {
				setActivities([])
				setImageURL([])
			}
			
			if (delay > 0 && DatesSelected) {
				setFilteredList([])
				setFilteredDetail([])
			}
			setTimeout(() => {
				setFilteredList(originalFilteredList)
				setFilteredDetail(originalFilteredDetail)
				axios.get(URL, {method: 'GET'}).then(results => {
					setActivities(results.data)
					getMaps(filterNumber !== null, results.data)
				})
			}, delay);
		}
	}
	const getMaps = (sideBarSelection, results) => {
		results.forEach(element => {
			const map = 'https://maps.googleapis.com/maps/api/staticmap\?size=600x300&maptype=roadmap\&path=enc:'+element.map.summary_polyline+'\&key='+process.env.REACT_APP_MAPS_KEY
			axios.get(map).then(results => {
				let image = {
					id: element.id,
					url: results.request.responseURL,
					time: element.start_date_local,
					name: element.name
				}
				if (ls.get('favorited')?.includes(element.id) && !sideBarSelection) {
					SetFavoritedImageURL(favoritedImageURL.concat(image))
					
				}
				let current = imageURL.slice(0);
				setImageURL(imageURL => [...imageURL, image]);
			})
		})
	}
	const handleClick = (id) => {
		let currentFavorited = favoritedImageURL.slice(0);
		let newElement
		if (!favoritedImageURL.find(element => element.id === id)) {
			imageURL.forEach(element => {
				if (element.id === id) {
					newElement = element
					SetFavoritedImageURL(favoritedImageURL.concat(element))
				}
			})
			let newFavorited = [...currentFavorited, newElement]
			SetFavoritedImageURL(newFavorited)
			ls.set('favorited', newFavorited)
		}
	}
	const tConvert = (time) => {
		time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
	  
		if (time.length > 1) {
		  time = time.slice (1)
		  time[5] = +time[0] < 12 ? 'AM' : 'PM'
		  time[0] = +time[0] % 12 || 12
		}
		return time.join ('')
	}
	const switchView = () => {
		setListOrDetail(listOrDetail ? false : true)
	}
	const setDelay = (event) => {
		 setDelayState(event.target.value)
	}
	const afterSubmission = (event) => {
		event.preventDefault()
		getActivites('20', parseInt(delay), access_token)
	}
	const getClassName = () => {
		return listOrDetail ? 'list-box' : 'flex-box'
	}
	const showModalState = (e) =>{
		setShowModal(showModal ? false : true)
	}
	const removeItem = (arr, value) => {
		var index = arr.indexOf(value);
		if (index > -1) {
		  arr.splice(index, 1);
		}
		return arr;
	}
	const removeFavorite = (id) => {
		let removeNode = favoritedImageURL.find(element => {
			if (element.id === parseInt(id))
				return element
		})
		let tempArray = favoritedImageURL
		tempArray = removeItem(tempArray, removeNode)
		SetFavoritedImageURL(tempArray)
		ls.set('favorited', tempArray)
	}
	let maps = []
	maps = imageURL.map((activity) => {
			return (
				<div className="tile-container" key={activity.id}>
					<img 
						className='tile'
						alt=''
						src={activity.url}
						onClick={(element) => handleClick(activity.id, element)}
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
		let list = activities.map((activity) => {
			return (
				<div className='list-container' key={activity.id}>
					<div className='list-node'>
						{activity.name + ' | '
						+ parseInt(activity.distance*0.000621371) +'Miles | '
						+ ' Avrg Heart Rate: ' + activity.average_heartrate
						+ ' | ' + activity.start_date_local.split('T')[0]
						+ ' | ' + tConvert(activity.start_date_local.split('T')[1].substr(0, activity.start_date_local.split('T')[1].length-1))}
						{favoritedImageURL.find(element=>{return element.id===activity.id}) ? <div className='favorited-list-view'> Favorited </div> : <button className='add-to-favorites' onClick={() => handleClick(activity.id)}>Add to Favorites</button>}
					</div>
				</div>
			)
		})
		
		const onChange = dates => {
			const [start, end] = dates;
			setStartDate(start)
			setEndDate(end)
			setDatesSelected(start !== null && end !== null ? true : false)
			if (start !== null && end !== null) {
				let list = activities.map((activity) => {
					let date = new Date(activity.start_date_local.split('T')[0].replaceAll('/', '-'))
					if (start.getTime() < date.getTime() && date.getTime() < end.getTime()) {
						return (
							<div className='list-container' key={activity.id}>
								<div className='list-node'>
									{activity.name + ' | '
									+ parseInt(activity.distance*0.000621371) +'Miles | '
									+ ' Avrg Heart Rate: ' + activity.average_heartrate
									+ ' | ' + activity.start_date_local.split('T')[0]
									+ ' | ' + tConvert(activity.start_date_local.split('T')[1].substr(0, activity.start_date_local.split('T')[1].length-1))}
									{favoritedImageURL.find(element=>{return element.id===activity.id}) ? <div className='favorited-list-view'> Favorited </div> : <button className='add-to-favorites' onClick={() => handleClick(activity.id)}>Add to Favorites</button>}
								</div>
							</div>
						)
					}
				})
				let detail = imageURL.map((activity) => {
					let date = new Date(activity.time.split('T')[0].replaceAll('/', '-'))
					if (start.getTime() < date.getTime() && date.getTime() < end.getTime()) {
						return (
							<div className="tile-container" key={activity.id}>
								<img 
									className='tile'
									alt=''
									src={activity.url}
									onClick={() => handleClick(activity.id)}
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
				setFilteredList(list)
				setFilteredDetail(detail)
			}
		}
		const loadingAnimation = () => {
			return (
				<div className='loading' href="#"><img alt='' width="400" height="400" src={BikeWheel} /></div>
			)
		}
		return (access_token ? <div className="container">
			{activities.length !== 0 ? null : loadingAnimation()}
			<Modal onClose={() => showModalState()} show={showModal} selections={favoritedImageURL} remove={(e) => removeFavorite(e)}></Modal>
			<div className="maps">
				{DatesSelected ? 
					<div className={getClassName()}>{listOrDetail ? filteredList : filteredDetail}</div> : 
					<div className={getClassName()}>{listOrDetail ? list : maps}</div>}
			</div>
			<div className='filter'>
				<ul id="myUL">
					<li><a className='list-detail-toggle' onClick={() => switchView()}>{listOrDetail ? 'Detail View' : 'List View'}</a></li>
					<li><a className='default-activity-number' onClick={() => getActivites('20', 0, access_token)}>20 Activities</a></li>
					<li><a className='all-activities' onClick={() => getActivites('200', 0, access_token)}>All Activities</a></li>
					<li>{ls.get('favorited')?.length > 0 ? <a onClick={() => showModalState()}>Favorites</a> : null}</li>
					<li>
						<form className='delay-form'>
							<input className='delay-input' type="text" name='delay' placeholder='Delay in ms' onChange={(event) => setDelay(event)}></input>
							<button className='delay-button' onClick={(event) => afterSubmission(event)}>Send Delay</button>
						</form>
					</li>
				</ul>	
			</div>
			
			<div className='calendar'>
				<DatePicker
					selected={startDate}
					onChange={onChange}
					startDate={startDate}
					endDate={endDate}
					selectsRange
					inline
				/>
			</div>
		</div> : null)
	
}
export default Container;
