var bt=document.getElementsByTagName("input");

function initial(){
var text = document.getElementsByTagName("textarea")[0].value;
	var pattern1 = /[^\w\u4e00-\u9fa5]+/g;
	var result1 = text.replace(pattern1, " ");
	var pattern2 = /^\s+|\s+$/g;
	var result2 = result1.replace(pattern2,"");
	var result3 = result2.split(" ");
	return result3;
}

var arr=[];
function leftin(){
	var content=initial();
	if(judge(content)){
		for(var i=0,aux=[];i<arr.length+content.length;i++){
			if(i<content.length){
				aux[i]=content[i];
			}else{
				aux[i]=arr[i-content.length];
			}
		}
		arr=aux;
		paint(arr);
	}

}
function leftout(){
	if(arr.length==0){
		alert("队列已空")
	}else{
		alert("leftout:"+arr.shift());
		paint(arr);
	}
}
function rightin(){
	var content=initial();
	if(judge(content)){
		for(var i=0,j=arr.length;i<content.length;i++){
				arr[j++]=content[i];
		}
		paint(arr);
	}

}
function rightout(){
	if(arr.length==0){
		alert("队列已空")
	}else{
		alert("leftout:"+arr.pop());
		paint(arr);
	}
}
function judge(content){
	if(content[0]==""){
		alert("输入非法！");
		return false;
	}else{
		return true;
	}
}
var container=document.getElementsByClassName("container")[0];
function paint(){
	var str="";
	for(var i=0;i<arr.length;i++){
		str=str+"<div>"+arr[i]+"</div>";
	}
	container.innerHTML=str;
}

function saixuan(){
	for(var k=0,s="";k<container.childNodes.length;k++){
			s=s+"<div>"+container.childNodes[k].innerText+"</div>"
	}
	container.innerHTML=s;
	var flag=bt[4].value;
	for(var i=0;i<container.childNodes.length;i++){
		var pattern = new RegExp(flag, "g");
		container.childNodes[i].innerHTML=container.childNodes[i].innerHTML.replace(pattern, "<span class=\"here\">"+flag+"</span>");
	}


}
addHandler(bt[0], "click", leftin);
addHandler(bt[1], "click", leftout);
addHandler(bt[2], "click", rightin);
addHandler(bt[3], "click", rightout);
addHandler(bt[5], "click", saixuan);