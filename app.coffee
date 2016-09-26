# Project Info
# This info is presented in a widget when you share.
# http://framerjs.com/docs/#info.info

Framer.Info =
	title: ""
	author: "Ben Callis"
	twitter: ""
	description: ""


{Path} = require 'Path'

# Import file "test"
$ = Framer.Importer.load("imported/test@1x")


Framer.Defaults.Layer.force2d = true
artboardWidth = 1333
Framer.Device.contentScale = (Screen.width / artboardWidth)


radius = 100
stroke = 22
viewBox = (radius * 2 ) + stroke

circle = new Layer
  width:  viewBox
  height: viewBox
  backgroundColor: ''
  x: 671
  y: 405 
  rotation: 250
  borderRadius: 0
  borderWidth: 1
  borderColor: "rgba(123,83,96,0)"

  
htmlProgress = new Layer
  	x: 169
  	y: 123
  	height: 20
  	width: 157
  	opacity: 1
  	backgroundColor: "rgba(26,224,187,1)"
	backgroundColor: '#36CF74'
	
htmlProgress.parent = $.bottom_section	

	
jqueryProgress = new Layer
	x: 414
	y: 550
	height: 20
	width: 0
	backgroundColor: "rgba(241,105,76,1)"
	

jsProgress = new Layer
	parent: $.challenges
	x: 414
	y: 494
	height: 20
	width: 0
	backgroundColor: "rgba(255,197,56,1)"

AngularProgress = new Layer
	x: 413
	y: 607
	height: 20
	backgroundColor: "rgba(241,105,76,1)"
	width: 0

Utils.domComplete ->
Utils.domComplete ->
	htmlProgress.animate
		properties: 
			width: 157
	jsProgress.animate
		properties: 
			width:75
	jqueryProgress.animate
		properties: 
			width: 55
	AngularProgress.animate
		properties: 
			width: 15						       

$.inbox.style.cursor = "point"


	
bottomScroll = new ScrollComponent
	height: 800
	width: 1133
	x: 200
	y: 278
	scrollHorizontal: false


$.bottom_section.parent = bottomScroll.content	
$.bottom_section.x = 40
$.bottom_section.y = 40




    