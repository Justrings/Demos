	function preO(node){
			var arr=[];
		(function preOrder(node){
			   if(node !== null){
		    	arr.push(node);
		        preOrder(node.firstElementChild);
		        preOrder(node.lastElementChild);
		    }
			})(node)
		    return arr;	
	}
	function inO(node){
			var arr=[];
		(function inOrder(node){
			if(node !== null){
				inOrder(node.firstElementChild);
				arr.push(node);
				inOrder(node.lastElementChild);
			}
		})(node)
			return arr;
	}
	function postO(node){
		var arr=[];
		(function postOrder(node){
		    if(node !== null){
		        postOrder(node.firstElementChild);
		        postOrder(node.lastElementChild);
		        arr.push(node);
		    }
		})(node)
		    return arr;
	}
var key=true;
function paint(arr){
	if(!key){
		alert("正在遍历中");
	}else{
		key=false;
		arr[0].style.backgroundColor="firebrick";
		for(var i=1,len=arr.length;i<len;i++){
			(function(i){
				setTimeout(function(){
					arr[i-1].style.backgroundColor="white";
					arr[i].style.backgroundColor="firebrick";
			},i*500);
			})(i);
			setTimeout(function(){
				arr[arr.length-1].style.backgroundColor="white";
				key=true;
			},500*arr.length);
		}
	}

}

function $(id){
	return document.getElementById(id);
}

var divroot=$("divroot")
$("bt1").onclick=function(){
	paint(preO(divroot));
}
$("bt2").onclick=function(){
	paint(inO(divroot));
}
$("bt3").onclick=function(){
	paint(postO(divroot));
}