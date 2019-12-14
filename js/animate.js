
function getStyle(obj, attr){
	if(obj.currentStyle){
		return obj.currentStyle[attr];
	} else {
		return getComputedStyle(obj, null)[attr];
	}
}
function animate(obj,json,callback){
	clearInterval(obj.timer);
	obj.timer = setInterval(function(){
		var isStop = true;
		for(var attr in json){
			var now = 0;
			if(attr == 'opacity'){
				now = parseInt(getStyle(obj,attr)*100);
			}else{
				now = parseInt(getStyle(obj,attr));
			}
			var speed = (json[attr] - now) / 8;
			speed = speed>0?Math.ceil(speed):Math.floor(speed);
			var cur = now + speed;
			if(attr == 'opacity'){
				obj.style[attr] = cur / 100;
			}else{
				obj.style[attr] = cur + 'px';
			}
			if(json[attr] !== cur){
				isStop = false;
			}
		}
		if(isStop){
			clearInterval(obj.timer);
			callback&&callback();
		}
	}, 30)
}
window.onload = function(){
	var index = 1;//记录pics的下标
	var p = document.getElementsByClassName("p")[0];
	var pics = document.getElementById("pics");
	var box = document.getElementById("box");
	var left = document.getElementById("left");
	var right = document.getElementById("right");
	var list = document.getElementsByClassName("num")[0].children;
	var isMoving = false;

	//文字滚动的周期函数
	setInterval(function(){
		var now = parseInt(getStyle(p, "left"));
		if(now > -300)
			p.style.left = now - 5 + "px";
		else
			p.style.left = "780px";
					
	}, 100)
				
	//轮播下一张图片的函数(向右)
	var next = function(){
		if(!isMoving){
			isMoving = true;
			index++;
			numChange();
			animate(pics, {left :-1200 * index}, function(){
				if(index === 6){
					pics.style.left = "-1200px";
					index = 1;
				}
				isMoving = false;
			});
		}
	}

	//轮播下一张图片的函数(向左)
	var prev = function(){
		if(isMoving)
			return;
		isMoving = true;
		index--;
		numChange();
		animate(pics, {left :-1200 * index}, function(){
			if(index === 0){
				pics.style.left = "-6000px";
				index = 5;
			}
			isMoving = false;
		});
	}

	var timer = setInterval(next, 3000);

	//鼠标划入请定时器
	box.onmouseover = function(){
		animate(left, {opacity: 50});
		animate(right, {opacity: 50});
		clearInterval(timer);
	}
	//鼠标划出开定时器
	box.onmouseout = function(){
		animate(left, {opacity: 0});
		animate(right, {opacity: 0});
		timer = setInterval(next, 3000);
	}

	//点击右箭头
	right.onclick =next;

	//点击左箭头
	left.onclick = prev;
	//点击小按钮
	for(var i = 0;i < list.length;i++){
		list[i].idx = i;
		list[i].onclick = function(){
			index = this.idx + 1;
			numChange();
			list[index - 1].className = "active";
			animate(pics, {left: -1200 * index});
		}
	}

	//小按钮背景切换
	function numChange(){
		for(var i = 0;i < list.length;i++){
			list[i].className = "";
		}
		if(index === 6){
			list[0].className = "active";
		}
		else if(index === 0){
			list[4].className = "active";
		}
		else{
			list[index - 1].className = "active";
		}
		//更改按钮的字体颜色
		for(var i = 0;i < list.length;++i){
			if(list[i].className == "active")
				list[i].style.color = "#fff";
			else if(list[i].id == "red")
				list[i].style.color = "red";
			else
				list[i].style.color = "#000";
		}
	}
	numChange();

}