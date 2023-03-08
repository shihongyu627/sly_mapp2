(function() {
	var u = navigator.userAgent,
		w = window.innerWidth;
	if (w >= 960) {
		window.innerWidth = 960;
		window.onload = function() {
			window.innerWidth = 960;
		}
	}
})();
