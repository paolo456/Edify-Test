import React, {useState, forwardRef, useRef, useImperativeHandle} from "react"
import "./modal.css";

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
		time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
	  
		if (time.length > 1) {
		  time = time.slice (1)
		  time[5] = +time[0] < 12 ? 'AM' : 'PM'
		  time[0] = +time[0] % 12 || 12
		}
		return time.join ('')
	}
	handleClick(id) {
		this.props.remove(id)
		let k = this.props.selections
		this.setState({listOrDetail: this.state.listOrDetail})
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
						alt=''
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
				<div className='list-container-favorites' key={activity.id}>
					<a className='list-node'>
						{activity.name + ' ' + activity.time.split('T')[0] + ' ' + this.tConvert(activity.time.split('T')[1].substr(0, activity.time.split('T')[1].length-1))}
					</a>
					<button className='deselect-favorite' onClick={() => this.handleClick(activity.id.toString())} id={activity.id.toString()}>X</button>
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