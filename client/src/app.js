/* global window */
import React, { Component, PropTypes } from 'react'
import axios from 'axios'
import data from 'test-data.js'
import styles from 'styles.scss'

const dataAPIEndpoint = '/api/data'

export default class App extends Component {
	constructor(props) {
		super(props)
		this.state = {}
	}

	componentDidMount = () => {
		this.getData()
	}

	getData = () => {
		axios.get(dataAPIEndpoint).then((response)=>{
			this.setState({data: response.data})
	    }).catch((error)=>{
	    	console.log('API call fucked up: ', error)
	    });
	}

	getTagLinks = (data) => {
		var links = [];
		for(var i in data){
			var iData = data[i];
			for(var j in data){
				var jData = data[j];
				if(jData._id==iData._id){
					break;
				}
				for(var q in iData.tags){
					var iTag = iData.tags[q];
					for(var p in jData.tags){
						var jTag = jData.tags[p];
						if(iTag == jTag){
							links.push({
								"source": Number.parseInt(i),
								"target": Number.parseInt(j),
								"type": 'tag',
								"tag": iTag
							})
						}
					}
				}
			}
		}
		return links;
	}

	getNodes = () => this.state.data

	renderD3 = () => {
		let nodes = this.getNodes();
		let links = this.getTagLinks(nodes);

		let width = window.innerWidth,
	    height = window.innerHeight;

		let force = d3.layout.force()
		    .nodes(nodes)
		    .links(links)
		    .size([width, height])
		    .linkDistance(200)
		    .charge(-500)
		    .on("tick", tick)
		    .start();

		let svg = d3.select("body").append("svg")
		    .attr("width", width)
		    .attr("height", height);

		// Per-type markers, as they don't inherit styles.
		svg.append("defs").selectAll("marker")
		    .data(["suit", "licensing", "resolved"])
		  .enter().append("marker")
		    .attr("id", function(d) { return d; })
		    .attr("viewBox", "0 -5 10 10")
		    .attr("refX", 15)
		    .attr("refY", -1.5)
		    .attr("markerWidth", 6)
		    .attr("markerHeight", 6)
		    .attr("orient", "auto")
		  .append("path")
		    .attr("d", "M0,-5L10,0L0,5");

		let path = svg.append("g").selectAll("path")
		    .data(force.links())
		  .enter().append("path")
		    .attr("class", function(d) { return "link " + d.type; })
		    .attr("marker-end", function(d) { return "url(#" + d.type + ")"; });

		let circle = svg.append("g").selectAll("circle")
		    .data(force.nodes())
		  .enter().append("circle")
		    .attr("r", 12)
		    .call(force.drag);

		let text = svg.append("g").selectAll("text")
		    .data(force.nodes())
		  .enter().append("text")
		    .attr("x", 8)
		    .attr("y", ".31em")
		    .text(function(d) { return d.name+": "+d.tags.toString(); });

		// Use elliptical arc path segments to doubly-encode directionality.
		function tick() {
		  path.attr("d", linkArc);
		  circle.attr("transform", transform);
		  text.attr("transform", transform);
		}

		function linkArc(d) {		  
		  return "M" + d.source.x + "," + d.source.y + 'L' + d.target.x + ',' + d.target.y;
		}

		function transform(d) {
		  return "translate(" + d.x + "," + d.y + ")";
		}
	}

	render = () => {
		if(this.state.data){
			this.renderD3()
		}
		return(
			<div>
			</div>
		)
	}    
}