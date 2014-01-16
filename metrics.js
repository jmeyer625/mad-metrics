/*metrics
% of page viewed
total distance scrolled
time before clicking sign up
time spent on page
time spent on each section of the page */
var startTime = new Date();

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

var displayMetrics = function(clickDelay,totalScroll,maxScroll) {
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

var pageClickDelay = null;
var yPositionPrev = 0;
var totalScroll = 0;
var maxScroll = 0;
var prevTime = startTime;
var timeOffwhite = 0, timeLightblue = 0, timeLightgreen = 0, timePink = 0, timePurple = 0;

window.onscroll = function(){
	var scrollResult = updateScrollMetrics(totalScroll, yPositionPrev, maxScroll);
	yPositionPrev = scrollResult.yPositionCurr;
	totalScroll = scrollResult.totalScroll;
	maxScroll = scrollResult.maxScroll;

};

var buttonHeight = document.getElementById("signup").offsetTop;
console.log(buttonHeight);

document.getElementById("signup").onclick = function(){pageClickDelay = signupTrack()};
document.getElementById("metrics").onclick = function(){displayMetrics(pageClickDelay,totalScroll,maxScroll)};

