/* global window */
import React, { Component, PropTypes } from 'react'
import axios from 'axios'
import data from 'test-data.js'
import styles from 'styles.scss'

const dataAPIEndpoint = '/api/data'

new p5()

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
			let data = this.preprocessData(response.data)
			this.setState({data})
	    }).catch((error)=>{
	    	console.log('API call fucked up: ', error)
	    });
	}

	preprocessData = (data) => {
		var colors = {}
		return $.map(data, (datum)=>{
			$.each(datum.tags, (i,tag)=>{
				let name = tag.trim()
				datum.tags[i] = {name}
				if(!colors[name]){
					colors[name] = `rgba(${Math.floor(random(255))}, ${Math.floor(random(255))}, ${Math.floor(random(255))}, 1)`
				}
				datum.tags[i].color = colors[name]
			})
			return datum
		})
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
						if(iTag.name == jTag.name){
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
			.attr("xmlns", "http://www.w3.org/2000/svg")
		    .attr("width", width)
		    .attr("height", height)

		    
		svg.append("foreignObject")
		   .attr("width", "100%")
		   .attr("height", "100%")		   
		   

		let emptyPathSelection = svg.append("g").attr("id", "edges").selectAll("path")

		let virtualSelection = emptyPathSelection.data(force.links()).enter()

		//append essentially creates a path object for each link
		let edges = virtualSelection.append("path")
		    .attr("class", function(edge) { return "edge " + edge.type; })
		    .attr("style", function(edge) { return `stroke:${edge.tag.color}`})

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

		let labels = nodeContainers.append("text")
		    .attr("x", 20)
		    .attr("y", ".31em")
		    .attr("class", function(d) { return "node-label " + d.type; })
		    .text(function(d) { return d.name })

		let details = nodeContainers.append("foreignObject")
			.attr("x", 10)
		    .attr("y", 10)
		    .attr("width", 500)
		    .attr("height", 50)
		    .attr("class", "details")

		let detailsInner = details.append(function(d){	
		    	let container = $("<div></div>")
		    	$.each(d.tags, (i,tag)=>container.append($(`
		    		<span class="tag-container" style="background-color:${tag.color}"><span>${tag.name}</span></span>
		    	`)) )
		    	container.attr("xmlns","http://www.w3.org/1999/xhtml")
		    	return container[0]
		    })
			.attr("x", 0)
		    .attr("y", 0)

		// All positions are encoded in the tick's transform
		function tick() {
		  edges.attr("d", linkArc)
		  nodeElements.attr("transform", transform)
		  labels.attr("transform", transform)
		  details.attr("transform", transform)
		  detailsInner.attr("transform", transform)
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