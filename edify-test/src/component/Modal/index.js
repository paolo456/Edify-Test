import React from "react"
import "./modal.css";
import ls from 'local-storage'

export default class Modal extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			listOrDetail: false
		}
	}
	onClose = e => {
		this.props.onClose && this.props.onClose(e);
	}
	setDetails() {
		this.setState({
			listOrDetail: true
		})
	}
	setList() {
		this.setState({
			listOrDetail: false
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
	handleClick(id) {
		this.props.remove(id)
	}
	render() {
		if (!this.props.show) {
			return null
		}
		let maps = this.props.selections.map((activity) => {
			return (
				<div className="tile-container-favorites" key={activity.id}>
					<button className='deselect-favorite' onClick={() => this.handleClick(activity.id.toString())} id={activity.id.toString()}>X</button>
					<img 
						className='tile-favorites'
						src={activity.url}
						>
					</img>
					<div className= 'title'>
						{activity.name}
					</div>
				</div>
			)
		})
		let list = this.props.selections.map((activity) => {
			return (
				<div className='list-container' key={activity.id}>
					<a className='list-node'>
						{activity.name + ' ' + activity.time.split('T')[0] + ' ' + this.tConvert(activity.time.split('T')[1].substr(0, activity.time.split('T')[1].length-1))}
					</a>
				</div>
			)
		})
		return (
			<div className='modal' id='modal'>
				<h2>Favorites</h2>
				<button onClick={() => this.setDetails()}>List</button><button onClick={() => this.setList()}>Detail</button>
				<div className='content'>{this.state.listOrDetail ? list : maps}</div>
				<div className='actions'>
					<button className='toggle-button' onClick={this.onClose}>
						close
					</button>
       			</div>
			</div>
		)
	}
}