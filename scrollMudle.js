	scroll("page1","page1_srcoll");
	function scroll(top_con,bom_con){
		var container_h=document.getElementById(top_con).offsetHeight;;    //容器总高度 
		var content_h=document.getElementById(bom_con).offsetHeight;   //滚动区域
		var function_flag=true;  //是否可执行
		var top1=0;
		var top2;
		document.getElementById(top_con).style.overflow='hidden';
		var p=container_h/content_h;  //比值
		main_();
		
		//总的调度
		function main_(){
			insert_scroll();
			show_();
			setHeight();
			position_Left();
			if (function_flag){
				down_event();
			}
		}
		//动态调整滚动条的高度
		function setHeight(){
			console.log(p*container_h);
			document.getElementById("window_scroll").style.height=(p*container_h)+"px";
		}
		//移入和移出
		function move_(){
			document.getElementById(top_con).onmousemove=function(){
				document.getElementById("window_scroll").style.display="block";
				
			}
			document.getElementById(top_con).onmouseout=function(){
				//document.getElementById("window_scroll").style.display="none";
				
			}
		}
		//是否显示滚动条
		function show_(){
			console.log("container_h"+container_h);
			console.log("content_h"+content_h);
			if(container_h>content_h){
				function_flag=false;
			}
			else {
				document.getElementById("window_scroll").style.display="block";
				move_();
				var g1=p*document.getElementById(top_con).offsetHeight;
				setHeight(g1);
				function_flag=true;
			}
		}
		//滚动事件
		function down_event(){
			document.getElementById(top_con).onmousewheel = function(e) {
				//下
				if(e.wheelDelta<0){
					var timer=setInterval(function(){
						var g=document.getElementById(top_con).offsetHeight-document.getElementById(bom_con).offsetHeight;
						console.log(g);
						if(top1>(g+1)){
							
							top1-=1;
							top2=p*(-top1)-3;
						}
						document.getElementById("w_scroll").style.marginTop=top2+"px";
						document.getElementById(bom_con).style.marginTop=top1+"px";
						console.log(top1);
					},1);
					setTimeout(function(){clearInterval(timer);},100);
					
				}
				else{
					var timer1=setInterval(function(){
						if(top1<-1){
							top1+=1;
							top2=(-top1)*p;
						}
						document.getElementById("w_scroll").style.marginTop=top2+"px";
						document.getElementById(bom_con).style.marginTop=top1+"px";
					},1);
					setTimeout(function(){clearInterval(timer1);},100);
				}
			}
		}
		//调整距离左边的距离
		function position_Left(){
			var con_w=document.getElementById(top_con).offsetWidth;
			var w=document.getElementById("window_scroll").offsetWidth;
			document.getElementById("w_scroll").style.marginLeft=(con_w-w-3)+"px";
		}
		//插入滚动条
		function insert_scroll(){
			document.getElementById(top_con).insertAdjacentHTML("afterBegin","<div style='width:10px;height:99%;position:absolute;display:none;' id='window_scroll'><div style='width:6px;height:100%;margin:auto;background:rgb(218, 212, 212);border-radius:5px;box-shadow: rgb(60, 58, 58) -4px 0px 20px -2px;' id='w_scroll'></div></div>")	
		}
	}