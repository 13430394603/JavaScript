/**
 *Title:diy_Scroll
 *Desc:为大窗体添加自定义滚动条
 *prame:id   滚动的区域
 *特殊情况: 需 body style="overflow:hidden;" 后需一个整体div容器如（box）容器内的div需为relatite统一关系
 */
var flag_page=true;
document.getElementById("page1_ul").onmousemove=function(){
	flag_page=false;
}
document.getElementById("page1_ul").onmouseout=function(){
	flag_page=true;
}
document.getElementById("page2_ul").onmousemove=function(){
	flag_page=false;
}
document.getElementById("page2_ul").onmouseout=function(){
	flag_page=true;
}
document.getElementById("ale_div_com").onmousemove=function(){
	flag_page=false;
}
document.getElementById("ale_div_com").onmouseout=function(){
	flag_page=true;
}
document.getElementById("add_div_com").onmousemove=function(){
	flag_page=false;
}
document.getElementById("add_div_com").onmouseout=function(){
	flag_page=true;
}
document.getElementById("dele_div_com").onmousemove=function(){
	flag_page=false;
}
document.getElementById("dele_div_com").onmouseout=function(){
	flag_page=true;
}
function diy_Scroll(id){
		 var top1=0;
		 var flag_down=false;
		 var flag_down1=true;
		 var flag_up=true;
		 var flag_resize=false;
		 var temp_g;
		 var top2;
		 var top3;
		 document.getElementById(id).style.width=window.innerWidth+"px";
		 var con=document.getElementById(id).offsetHeight;
		 var p=window.innerHeight/document.getElementById(id).offsetHeight
		 console.log(window.innerHeight);
		 setSrcoll_H();//设置滚动条高度
		 document.getElementById("w_scroll").style.cursor="pointer";
		 //等待一秒后加载
		 setTimeout(function(){
			 setSrcoll_Left();//设置滚动条距离左边距离
		 },1000);
		 //窗口改变事件
         window.onresize = function () {
			 //_("w_scroll").style.marginTop=top2*p+"px";
			 var g_w=_(id).offsetWidth;
			 var g_w1=window.innerHeight;
			 if(top1==top3){
			     //_(id).style.marginTop=(g_w-g_w1)+"px";
			 }
			 
			 
         }
		 document.getElementById(id).onmousemove = function(){
		     document.getElementById("window_scroll").style.dispaly="block";
		 }
		 document.getElementById(id).onmouseout = function(){
		     setTimeout(function(){
				 //alert("out");
			     document.getElementById("window_scroll").style.dispaly="none";
				 document.getElementById("w_scroll").style.dispaly="none";
			 },2000);
		 }
		 //实时改变
		 setInterval(function(){
             setSrcoll_Left();//设置滚动条距离左边距离
			 
			 document.getElementById(id).style.width=window.innerWidth+"px";
			 
			 p=window.innerHeight/document.getElementById(id).offsetHeight
			 setSrcoll_H();//设置滚动条高度
			 //console.log(flag_resize);
             var g_w=_(id).offsetWidth;
			 var g_w1=window.innerHeight;
			 setTimeout(function(){
				 
			   if(g_w1>=window.innerHeight){
			       // console.log("小");
			   } 
			   else{
				   console.log("da");
					  if(flag_resize){
						  document.getElementById(id).style.marginTop=-(document.getElementById(id).offsetHeight-window.innerHeight)+"px";
					  }
			   }
			 },100);
		 },1);
		 //滚轮事件
		 document.body.onmousewheel = function(e) {
		   //上
		   if(e.wheelDelta>0){
			   flag_resize=false;
			   if(flag_down){
				   var timer=setInterval(function(){
					   if(top1>-1){
						 flag_down1=false;
					   }
					   if(flag_page){
					   if(flag_down1){
						   top1+=1;
						   top2=(-top1)*p;
						   document.getElementById("w_scroll").style.marginTop=top2+"px";
					   }
					   }
					   document.getElementById(id).style.marginTop=top1+"px";
					   setTimeout(function(){clearInterval(timer);},200);
					   
				   },1);
				   console.log("move:"+top1);
				   flag_up=true;
			   } 

		   }
		   //向下
		   else{
				var timer=setInterval(function(){
					   var g=window.innerHeight-document.getElementById(id).offsetHeight;
					   if(top1<(g+1)){
						   flag_resize=true;
						   flag_up=false;
						   top3=top1;
						   console.log(document.getElementById(id).offsetHeight-window.innerHeight);
					   }
					   if(flag_page){
					   if(flag_up){
                           flag_resize=false;
						   top1-=1;
						   top2=p*(-top1)-3;
						   document.getElementById("w_scroll").style.marginTop=top2+"px";
					   }
					   }
					   document.getElementById(id).style.marginTop=top1+"px";
					   setTimeout(function(){clearInterval(timer);},200);
					  
				   },1); 
			   flag_down=true;
			   flag_down1=true;
		   }
		 };
		 //调整高度
		 function setSrcoll_H(){
			 var g=p*window.innerHeight;
			 document.getElementById("w_scroll").style.height=g+"px";
		 }
		 //调整左边距
		 var flag_g=true;
		 function setSrcoll_Left(){
		     var g=window.innerWidth-document.getElementById("window_scroll").offsetWidth;
		     document.getElementById("window_scroll").style.marginLeft=g+"px";
			 if(flag_g){
			     flag_g=false;
			     opa_In("window_scroll",0.6,1);
			 }
			 
		 }
		 
     }