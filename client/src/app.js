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
		let links = this.getTagLinks(nodes)

		let width = window.innerWidth
	    let height = window.innerHeight	    

		let force = d3.layout.force()
		    .nodes(nodes)
		    .links(links)
		    .size([width, height])
		    .linkDistance(200)
		    .charge(-500)
		    .on("tick", tick)
		    .start()

		let svg = d3.select("body").append("svg")
		    .attr("width", width)
		    .attr("height", height)

		let emptyPathSelection = svg.append("g").attr("id", "edges").selectAll("path")

		let virtualSelection = emptyPathSelection.data(force.links()).enter()

		//append essentially creates a path object for each link
		let edges = virtualSelection.append("path")
		    .attr("class", function(edge) { return "edge " + edge.type; })

		//Render Nodes
		let nodesContainer = svg.append("g").attr("id", "nodes")
		let nodeContainers = nodesContainer.selectAll("g")
		    .data(force.nodes())
		  .enter().append("g").attr("class", "node-container")
		  	.on('mouseover', function(d){
			    $(this).toggleClass("highlight")
			})
			.on('mouseout', function(d){
				$(this).toggleClass("highlight")
			})

		let nodeElements = nodeContainers.append("circle")
		  	.attr("class", "node")
		    .attr("r", 12)
		    .call(force.drag)

		let text = nodeContainers.append("text")
		    .attr("x", 20)
		    .attr("y", ".31em")
		    .attr("class", function(d) { return "node-label " + d.type; })
		    .text(function(d) { return d.name+": "+d.tags.toString() })

		// All positions are encoded in the tick's transform
		function tick() {
		  edges.attr("d", linkArc)
		  nodeElements.attr("transform", transform)
		  text.attr("transform", transform)
		}

		function linkArc(d) {		  
		  return "M" + d.source.x + "," + d.source.y + 'L' + d.target.x + ',' + d.target.y
		}

		function transform(d) {
		  return "translate(" + d.x + "," + d.y + ")"
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