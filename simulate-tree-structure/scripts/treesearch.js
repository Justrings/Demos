	function preO(node){
			var arr=[];
		(function preOrder(node){
			   if(node !== null){
		    	arr.push(node);
		    	var child = node.firstElementChild;
		    	while(child !==null){
		    		preOrder(child);
		    		child = child.nextElementSibling;
		    	} 
		    }
			})(node)
		    return arr;	
	}
	function inO(node){
		if(node==null) return;
			var arr=[],brr=[];
			arr.push(node);
			brr.push(node);
		(function inOrder(brr){
			var flag=brr.shift();
			if(flag.firstElementChild!==null){
				for(var child=flag.firstElementChild;child!==null;child=child.nextElementSibling){
					brr.push(child);
					arr.push(child);
				}
			}
			if(brr.length!==0){
				inOrder(brr);
			}
		})(brr)
			return arr;
	}

var key=true;
function paint(arr){
	var flag=$("bt3").value;
	if(!key){
		alert("正在遍历中");
	}else{
		key=false;
		arr[0].style.backgroundColor="firebrick";
		for(var i=1,len=arr.length;i<len;i++){
			(function(i){
				setTimeout(function(){
					if(flag!==(arr[i-1].firstChild.nodeValue).replace(/^\s*|\s*$/g,"")){
					arr[i-1].style.backgroundColor="white";	
					}
					arr[i].style.backgroundColor="firebrick";
					if(flag==(arr[i].firstChild.nodeValue).replace(/^\s*|\s*$/g,"")){
						arr[i].style.backgroundColor="lightgreen";
					}
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
