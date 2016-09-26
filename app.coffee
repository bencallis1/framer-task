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

$.course_completed.visible = false


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
  	x: 413
  	y: 436
  	height: 20
  	width: 0
  	opacity: 1
  	backgroundColor: "rgba(26,224,187,1)"
	backgroundColor: '#36CF74'
	
jqueryProgress = new Layer
	x: 414
	y: 550
	height: 20
	width: 0
	backgroundColor: "rgba(241,105,76,1)"
	


jsProgress = new Layer
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




circle.html = """
  <svg viewBox='-#{stroke/2} -#{stroke/2} #{viewBox} #{viewBox}'>
    <circle fill='none' stroke='#36CF74'
      stroke-width      = '#{stroke}'
      stroke-dasharray  = '#{circle.pathLength}'
      stroke-dashoffset = '0'
      cx = '#{radius}'
      cy = '#{radius}'
      r  = '#{radius}'>
  </svg>"""

Utils.domComplete ->
  circle.path = document.querySelector('svg circle')
  
proxy = new Layer
	backgroundColor: ""
proxy.on 'change:x', ->
  offset = Utils.modulate(@.x, [0, 100], [circle.pathLength, 0])
  circle.path.setAttribute 'stroke-dashoffset', offset 
  
Utils.domComplete ->
  proxy.animate
    properties:
      x: 100
    time: 1   
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


# dashContent = new ScrollComponent
# 	x: 200
# 	y: 278
# 	width: 1133
# 	height: 853
# 	
# dashContent.style.background = ""

	



    