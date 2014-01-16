/*metrics
% of page viewed
total distance scrolled
time before clicking sign up
time spent on page
time spent on each section of the page */
var startTime = new Date();
var pageClickDelay = null;
var yPositionPrev = 0;
var totalScroll = 0;
var maxScroll = 0;
var prevTime = startTime;
var timeOffwhite = 0, timeLightblue = 0, timeLightgreen = 0, timePink = 0, timePurple = 0;
var timeArray = [timeOffwhite, timeLightblue, timeLightgreen, timePink, timePurple];
var heightOffwhite = document.getElementById('p-box-offwhite').offsetTop;
var heightLightblue = document.getElementById('p-box-lightblue').offsetTop;
var heightLightgreen = document.getElementById('p-box-lightgreen').offsetTop;
var heightPink = document.getElementById('p-box-pink').offsetTop;
var heightPurple = document.getElementById('p-box-purple').offsetTop;
var heightArray = [heightOffwhite, heightLightblue, heightLightgreen, heightPink, heightPurple];
var screenPositionMax = yPositionPrev + window.innerHeight;
var isHeatMap = false;
var chartBars = document.getElementsByClassName("bar");


var signupTrack = function() {
	var clickTime = new Date();
	var clickDelay = (clickTime - startTime)/1000;
	return clickDelay;
};

var timeOnPage = function() {
	var closeTime = new Date();
	var closeDelay = (closeTime - startTime)/1000;
	return closeDelay;
};

var updateMaxScroll = function(yPositionCurr, maxScroll) {
	maxScroll = Math.max(maxScroll,yPositionCurr);
	return maxScroll;
};

var updateTotalScroll = function(totalScroll, yPositionPrev, yPositionCurr) {
	var distance = Math.abs(yPositionCurr - yPositionPrev);
	totalScroll = totalScroll + distance;
	return totalScroll;
};

var updateScrollMetrics = function(totalScroll, yPositionPrev, maxScroll) {
	yPositionCurr = window.pageYOffset;
	var scrollTime = new Date();
	totalScroll = updateTotalScroll(totalScroll,yPositionPrev,yPositionCurr);
	maxScroll = updateMaxScroll(yPositionCurr,maxScroll);
	return {totalScroll:totalScroll, maxScroll:maxScroll, yPositionCurr:yPositionCurr, scrollTime:scrollTime};
};

var updateBars = function(clickDelay,totalScroll,maxScroll,timeArray,closeDelay,chartBars) {
	if (clickDelay === null) {clickDelay = 0};
	chartBars[0].style.width = (document.body.scrollHeight/5).toString()+"px";
	chartBars[1].style.width = ((maxScroll+window.innerHeight)/5).toString()+"px";
	chartBars[2].style.width = (totalScroll/5).toString()+"px";
	chartBars[3].style.width = (clickDelay.toString()*100)+"px";
	chartBars[4].style.width = (closeDelay.toString()*100)+"px";
	chartBars[5].style.width = ((timeArray[0]/10).toString())+"px";
	chartBars[5].style.backgroundColor = "#FFFFCC";
	chartBars[6].style.width = ((timeArray[1]/10).toString())+"px";
	chartBars[6].style.backgroundColor = "lightblue";
	chartBars[7].style.width = ((timeArray[2]/10).toString())+"px";
	chartBars[7].style.backgroundColor = "lightgreen";
	chartBars[8].style.width = ((timeArray[3]/10).toString())+"px";
	chartBars[8].style.backgroundColor = "pink";
	chartBars[9].style.width = ((timeArray[4]/10).toString())+"px";
	chartBars[9].style.backgroundColor = "purple";
	document.getElementById("metricsBox").style.display = "block";
}

var toggleHeatMap = function(timeArray) {
	var colorMapArray = ["#AA0114","#FFD800", "#005A04"];
	var divArray = [document.getElementById('p-box-offwhite'),document.getElementById('p-box-lightblue'),document.getElementById('p-box-lightgreen'),
	document.getElementById('p-box-pink'),document.getElementById('p-box-purple')];
	var colorArray = ["#FFFFCC","lightblue","lightgreen","pink","purple"];
	for (var j = 0; j<timeArray.length; j++) {
		if (timeArray[j] === NaN) {timeArray[j]=0;}
	};
	console.log(timeArray);
	if (isHeatMap) {
		for (var i = 0; i<divArray.length; i++) {
			divArray[i].style.backgroundColor=colorArray[i];
		} 	
		isHeatMap = false;
	} else {
		for (var i = 0; i<divArray.length; i++) {
			var percentFill = timeArray[i]/(prevTime-startTime);
			console.log(percentFill);
			if (percentFill <= 0.13) {
				divArray[i].style.backgroundColor=colorMapArray[0];
			} else if (percentFill <= 0.25) {
				divArray[i].style.backgroundColor=colorMapArray[1];
			} else {
				divArray[i].style.backgroundColor=colorMapArray[2];
			}
		} 
		isHeatMap = true;
	};
	return isHeatMap;	
};

var displayMetrics = function(clickDelay,totalScroll,maxScroll,timeArray) {
	var closeDelay = timeOnPage();
	var pageProportion = ((maxScroll+window.innerHeight) / document.body.scrollHeight)*100;
	alert("You have been on the page for " + closeDelay + " seconds!");
	if (clickDelay === null) {
		alert("You didn't click the sign-up button.");
	} else {
		alert("You clicked the sign-up button after " + clickDelay + " seconds on the page!");
	};
	alert("You scrolled a total of " + totalScroll + " pixels.");
	alert("You viewed " + pageProportion + "% of the page.");
	var nameArray = ["off-white", "lightblue", "lightgreen", "pink", "purple"];
	for (var i=0; i<timeArray.length; i++) {
		alert("You spent " + Math.round(timeArray[i]/(prevTime-startTime)*100) + "% on the " + nameArray[i] + " section");
	};
	updateBars(clickDelay,totalScroll,maxScroll,timeArray,closeDelay,chartBars);
};

window.onscroll = function(){
	var scrollResult = updateScrollMetrics(totalScroll, yPositionPrev, maxScroll);
	yPositionPrev = scrollResult.yPositionCurr;
	totalScroll = scrollResult.totalScroll;
	maxScroll = scrollResult.maxScroll;
	screenPositionMax = yPositionPrev + window.innerHeight;
	for (var i=0; i<heightArray.length; i++) {
		if ((heightArray[i] > window.pageYOffset) && (heightArray[i] < screenPositionMax)) {
			timeArray[i] = timeArray[i] + (scrollResult.scrollTime-prevTime);
		};
	};
	prevTime = scrollResult.scrollTime;
};

document.getElementById("signup").onclick = function(){pageClickDelay = signupTrack()};
document.getElementById("metrics").onclick = function(){displayMetrics(pageClickDelay,totalScroll,maxScroll,timeArray)};
document.getElementById("heatmap").onclick = function() {
	isHeatMap = toggleHeatMap(timeArray)
	console.log(isHeatMap);
};


console.log(chartBars);