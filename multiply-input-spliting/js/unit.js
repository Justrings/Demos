function $(id){
	return document.getElementById(id);
}

function addHandler(element, type, fun){
	if(element.addEventListener){
		element.addEventListener(type, fun, false);
	}else if(element.attachEvent){
		element.attachEvent("on"+ type, fun);
	}else{
		element["on"+ type] = fun;
	}
}
function removeHandler(element, type, fun){
	if(element.removeEventListener){
		element.removeEventListener(type, fun, false)
	}else if(element.detachEvent){
		element.detachEvent("on"+type, fun);
	}else{
		element["on"+type] = null;
	}
}

function getEvent(event){
	return event? event:window.event;
}

function getTarget(event){
	return event.target||event.srcElement;
}

function preventDefault(event){
	if(event.preventDefault){
		event.preventDefault();
	}else{
		event.returnValue = false;
	}
}
function stopPropagation(event){
	if(event.stopPropagation){
		event.stopPropagation();
	}else{
		event.cancelBubble = true;
	}

}

function trim(s){
	var pattern=/^\s+|\s+$/g;
	return s.replace(pattern,"");

}