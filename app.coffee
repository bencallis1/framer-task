# Project Info
# This info is presented in a widget when you share.
# http://framerjs.com/docs/#info.info

Framer.Info =
	title: ""
	author: "Ben Callis"
	twitter: ""
	description: ""

$ = Framer.Importer.load("imported/test@1x")

Framer.Defaults.Layer.force2d = true
artboardWidth = 1333
Framer.Device.contentScale = (Screen.width / artboardWidth)

radius = 100
stroke = 22
viewBox = (radius * 2 ) + stroke

  
htmlProgress = new Layer
	y: 123
	height: 20
	width: 0
	x: 170
	backgroundColor: "rgba(50,201,97,1)"
  
#   	backgroundColor: "rgba(26,224,187,1)"
# 	backgroundColor: '#36CF74'
	
htmlProgress.parent = $.bottom_section	

	
jqueryProgress = new Layer
	x: 169
	y: 238
	height: 20
	width: 0
	backgroundColor: "rgba(241,105,76,1)"
jqueryProgress.parent =  $.bottom_section		
	

jsProgress = new Layer
	parent: $.challenges
	x: 170
	y: 180
	height: 20
	width: 0
	backgroundColor: "rgba(255,197,56,1)"
jsProgress.parent = $.bottom_section		

AngularProgress = new Layer
	x: 168
	y: 294
	height: 20
	backgroundColor: "rgba(241,105,76,1)"
	width: 0
AngularProgress.parent = $.bottom_section		

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

bottomScroll = new ScrollComponent
	height: 800
	width: 1133
	x: 200
	y: 98
	scrollHorizontal: false
	mouseWheelEnabled: true


$.bottom_section.parent = bottomScroll.content	
$.bottom_section.x = 40
$.bottom_section.y = 40


# Default locations 
$.avatar.origionalFrame = $.avatar.frame
$.bottom_section.origionalFrame = $.bottom_section.frame

$.dashboard.on Events.Click, () ->
	
	$.active_bg.animate
		properties: 
			y: @.frame.y - 13
	$.avatar.animate
		properties: 
			y:$.avatar.origionalFrame.y
			x:$.avatar.origionalFrame.x
			width: $.avatar.origionalFrame.width
			height: $.avatar.origionalFrame.height
	accountInfo.animate
		properties: 
			x:accountInfo.origionalFrame.x
			y:accountInfo.origionalFrame.y
			borderRadius:accountInfo.origionalFrame.borderRadius
			width: accountInfo.origionalFrame.width
			height: accountInfo.origionalFrame.height		
	$.bottom_section.animate
		properties: 
			x:$.bottom_section.origionalFrame.x
		delay:.15
	
		

$.account.on Events.Click, () -> 
	accountInfoAnimation.start()
	$.active_bg.animate
		properties: 
			y: @.frame.y - 13
	
# 	for layer, i in $.bottom_section.subLayers
# 			layer.animate time: .15, curve: "ease-in", delay: i * .02, properties: maxX: - 200, scale: 0, opacity: 0

	$.bottom_section.animate
		properties: 
			x: -1200
	
	$.avatar.animate
		properties: 
			y:80
			x:400
			width: 200
			height: 200
				
$.side_bar.style.zIndex = 3
accountInfo = new Layer
	x: 600
	y: 0
	width:	55
	height: 55
	backgroundColor: "rgba(255,255,255,1)"
	shadowSpread: 0
	shadowColor: "rgba(45,45,45,0.78)"
	borderRadius: 588
accountInfo.style.zIndex = 1
accountInfo.origionalFrame = accountInfo.frame

accountInfoAnimation = new Animation
	layer: accountInfo 
	properties: 
		x: 375
		y: 295
		width: 690
		height: 488
		backgroundColor: "rgba(255,255,255,1)"
		shadowSpread: 0
		shadowColor: "rgba(45,45,45,0.78)"
		borderRadius: 0

for key in $.challenges_links.subLayers
	key.on Events.Click, (Events,Layer) ->
			
	

						
	
	
		




    