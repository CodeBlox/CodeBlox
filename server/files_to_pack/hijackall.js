(function(xhr, remote_url) {
	// hijack
	function hijackClick(e) {
		if (!e) return;

		var pathname = preventIfAnchor(e, e.target);

		if (pathname) {
			setLocation(remote_url + pathname);
		}
		else {
			// walk the parents, looking for an anchor
			var current = e.target.parentElement;
			while (current !== null) {
				pathname = preventIfAnchor(e, current);
				if (pathname) {
					setLocation(remote_url + pathname);
					break;
				} 
				else {
					current = current.parentElement;
				}
			}
		}

		return false;
	}

	function preventIfAnchor(e, elem) {
		if (elem.tagName && elem.tagName === 'A') {
			e.preventDefault();
			return (elem.pathname + elem.search);
		}
		else {
			return false;
		}
	}

	function setLocation(url) {
		window.location = url;
	}

	// bind all clicks
	document.addEventListener('click', hijackClick, true)

	// Change prototype
	var open = xhr.prototype.open;
	xhr.prototype.open = function(method, url, async, user, pass) {
		open.call(this, method, remote_url+url, async, user, pass);
	}

})(XMLHttpRequest, '<ADDRESS>')