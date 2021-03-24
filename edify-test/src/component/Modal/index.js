import React, {useState, useEffect} from "react"
import "./modal.css";

export default function Modal(props) {
	const [listOrDetail, setListOrDetails] = useState(false)
	const [maps, setMaps] = useState([])
	const [list, setList] = useState([])

	const onClose = e => {
		props.onClose && props.onClose(e);
	}
	const setDetailsView = () => {
		setListOrDetails(true)
	}
	const setListView = () => {
		setListOrDetails(false)
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
	const handleClick = (id) => {
		props.remove(id)
		setListState()
		setMapsState()
	}
	const setMapsState = () => {
		setMaps(props.selections.map((activity) => {
			return (
				<div className="tile-container-favorites" key={activity.id}>
					<button className='deselect-favorite' onClick={() => handleClick(activity.id.toString())} id={activity.id.toString()}>X</button>
					<img 
						className='tile-favorites'
						alt=''
						src={activity.url}
						>
					</img>
					<div className= 'title'>
						{activity.name}
					</div>
				</div>
			)
		}))
	} 
	const getMaps = () => {
		return maps
	}
	const setListState = () => {
		setList(
			props.selections.map((activity) => {
				return (
					<div className='list-container-favorites' key={activity.id}>
						<a className='list-node'>
							{activity.name + ' ' + activity.time.split('T')[0] + ' ' + tConvert(activity.time.split('T')[1].substr(0, activity.time.split('T')[1].length-1))}
						</a>
						<button className='deselect-favorite' onClick={() => handleClick(activity.id.toString())} id={activity.id.toString()}>X</button>
					</div>
				)
			})
		)
	}
	const getList = () => {
		return list
	}
	useEffect(() => {
		setMapsState()
		setListState()
	}, [props.selections])

	return (
		props.show ? <div className='modal' id='modal'>
			<h2>Favorites</h2>
			<button className='list-modal' onClick={() => setDetailsView()}>List</button><button className='detail-modal' onClick={() => setListView()}>Detail</button>
			<div className='content'>{listOrDetail ? getList() : getMaps()}</div>
			<div className='actions'>
				<button className='toggle-button' onClick={() => onClose()}>
					close
				</button>
			</div>
		</div> : null
	)
	
}