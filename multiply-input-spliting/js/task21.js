

function Box(item){
	this.arr=[];
	this.render=function(arr){
		item.innerHTML= this.arr.reduce(function(acc,cur){
			return acc+"<div>"+cur+"</div>";
		},"")
		deleteEvent(item, this);
	}
}
/*Box.prototype.push=function(s){
		this.arr.push(s);
	};
Box.prototype.pop=function(){
	this.arr.pop();
};
Box.prototype.shift=function(){
	this.arr.shift();
};
Box.prototype.unshift=function(s){
	this.arr.unshift(s);
};
Box.prototype.over=function(){
		if(this.data.length>10){
			this.data.shift();
		}	
};*/

Box.prototype={
	constructor: Box,
	push: function(s){
		this.arr.push(s)
	},
	pop: function(){
		this.arr.pop();
	},
	shift: function(){
		this.arr.shift();
	},
	unshift: function(s){
		this.arr.unshift(s);
	},
	over: function(){
		if(this.arr.length>10){
			this.arr.shift();
		}	
	}
}

//必须要在构造函数之后,不然自定义的构造函数可能会被覆盖
var tag = $("tag");
var boxone = $("boxone");
var text = $("text");
var boxtwo = $("boxtwo");
var bt = $("bt");
var tagarr = new Box(boxone);
var textarr = new Box(boxtwo);

function deleteEvent(ele, obj){
	for(var i=0,len=ele.childNodes.length;i<len;i++){
		addHandler(ele.childNodes[i], "mouseover", function(event){
			var target = getTarget(event);
			target.innerHTML = "点击删除"+target.innerHTML;
			target.style.backgroundColor = "pink";
		});
		addHandler(ele.childNodes[i], "mouseout", function(event){
			var target = getTarget(event);
			target.innerHTML = target.innerHTML.replace("点击删除","");
			target.style.backgroundColor = "purple"
		});
		addHandler(ele.childNodes[i], "click", function(i,event){
			return function(){
				obj.arr.splice(i, 1);
				obj.render();
			}(i);
		})
	}
}

function getInput(){
	var str = text.value;
	var pattern1 = /[^\w\u4e00-\u9fa5]+/g;
	var result1 = str.replace(pattern1, " ");
	var pattern2 = /^\s+|\s+$/g;
	var result2 = result1.replace(pattern2,"");
	var result3 = result2.split(" ");
	return result3;
}

function textarea(){
	var arr = getInput();
	if(arr!==""){
		arr.forEach(function(item, index, array){
			textarr.arr.push(array[index]);
		});
		textarr.render();
	}else{
		alert("输入非法!");
	}
}

function tagarea(event){
	var event = event || window.event;
	//var e=getEvent();
	var str=tag.value;
	var pattern=/,|\.|，|。|\s/g
	if(pattern.test(str)){
		str=trim(str);
		str=str.split(/,|\.|，|。|\s/).join("");
		if(str==""){
			alert("输入为空！");
		}else{
			tagarr.arr.push(str);
			tagarr.over();
			tagarr.render();

		}
		tag.value="";
	}/*else if(event.keyCode === 13){
		if(pattern.test(str)){
		str=trim(str);
		str=str.split(/,|\.|，|。|\s/).join("");
		if(str==""){
			alert("输入为空！");
		}else{
			tagarr.push(str);
			tagarr.over();
			tagarr.render();
			}
		}
	}*/
}
function initial(){
	tag.onkeyup = tagarea;
	addHandler(bt, "click", textarea);
}
initial();