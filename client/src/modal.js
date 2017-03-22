/* global window */
import React, { Component, PropTypes } from 'react'
import styles from 'modal.scss'

export default class Modal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			open: false,
		}
	}

	render = () =>
		<div className={`${styles['backdrop']} ${this.props.open?styles['open']:styles['closed']}`}>
			<div className={`${this.props.className} ${styles['modal']}`}>
				{this.props.children}
			</div>
		</div>
}