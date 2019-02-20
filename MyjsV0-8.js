	/**
	全局对象 类似于JQ中的$  2018/3/16
	异常

	表单异步

	*/
	var $$ = {
		//$$对象中的暂缓数据
		tempData:undefined,
		//获取$$对象中的暂缓数据
		getTempData:function(){
			var temp = $$.tempData;
			$$.tempData = null;
			return temp;
		},
		//异常
		nullError:function(obj, objName) {
			if(obj == undefined)
				throw new Error("参数" + objName + "不能为空 == " + obj);
		},
		//异常
		error:function(msg){
			throw new Error(msg);
		},
		//表单异步交互
		formAjax:function(data){
			$$.tempData = data;
			var str = "abcdefghijklmnopqrstuvwxyz";
			var result = "";
			for(var i = 0; i <8; i++){
				result += str.charAt(Math.floor(Math.random()*25));
			}
			var scri = $("body")[0].creEle("script");
			scri.innerHTML = 'var formAjaxData = $$.getTempData();' +
			'formAjaxData.callbackObj = "' + result + '";' +
			'var ' + result + ' = new FormAjax(formAjaxData);';
		},
		//表单验证
		formVerifi:function(data){
			new FormVerifi(data);
		},
		//工具库
		util:{
			isJSON:function(jsonStr){
				return (jsonStr.charAt(0) == '{' || jsonStr.charAt(0) == '[') ? true : false;
			},
			isNumber:function(field){
				return !(isNaN(field));
			},
			isBool:function(field){ //包括字符串的判断
				return field == "true" || field == "false" || $$.util.isBoolean(field);
			},
			isBoolean:function(bool){//只判断布尔对象不包括字符串
				if(!(typeof bool == "boolean"))
					return false;
				return String(bool) == "true" || String(bool) == "false"; 
			},
			isChinese:function(field){		//全中文
				return unicodeUtil.isChinese(field);
			},
			isString:function(field) {		//不是数字，不是bool对象
				return !$$.util.isNumber(field) && !$$.util.isBoolean(field);
			},
			date:{
			
			},
			//填充成指定位数的字符
			fillString:function(string, num, fillChar){
				//fillChar 默认为零
				//num      需要多少位的数字
				fillChar = fillChar == undefined ? "0" : fillChar;
				var temp = "";
				var len = num - string.length;
				for(var i = 0; i < len; i++) temp += fillChar;
				return temp + "" + string;
			},
			//去填充
			fillString_recover:function(string, fillChar){
				//fillChar 填充符 默认为零
				fillChar = fillChar == undefined ? "0" : fillChar;
				var len = string.length;
				for(var i = 0; i < len; i++){
					if(!(string.charAt(i) == fillChar))
						return string.substring(i, string.length);
				}
				return string; 
			},
			getRan:function(){
				return Num_ran5();
			},
			
		},
		//json
		json:{
			toObject:function(jsonStr) {return Tokener.parseObject(jsonStr);},
			toString:function(jsonObj) {return Tokener.parseString(jsonObj);},
			toJSON:function() {return new ObjectParseJSON().parseJSON(jsonObj)},
		},
	}
	//兼容作用 建议使用$$中的异常处理
	var exception = {
		Exception:function(msg){
			$$.error(msg);
		},
		NullException:function(obj, objName){
			$$.nullError(obj, objName);
		}

	}
	/**
	表单自定义验证 2018/3/16
	参数：
		data      {"className":"自定义方法",...}
		fun...    可自行增加自定义验证的方法
	案例：
		new FormVerifi({
			data:{"userword":"definStrategy;","pass":"definStrategy","ver_text":"verCodeStrategy"},
			definStrategy:function(ele){
				ele.parent("label").parent("label").$("i")[0].css("background: url('"+pictureData.trueData+"');", false);
			},
			verCodeStrategy:function(ele){
				ele.parent("label").parent("label").$("i")[0].css("background: url('"+pictureData.trueData+"');", false);
			}
		});
	*/
	function FormVerifi(data){
		var selfObj = this;
		for(var key in data.data){
			var ele = $("."+key)[0];
			(function(ele, key){  //使用闭包保存每个事件的触发元素 使触发独立的
				console.log("验证检测到的元素："+ele.tName());
				ele.oninput = function(){
					console.log("data."+data.data[key]+"(ele)");
					eval("data."+data.data[key]+"(ele)");
				}
			})(ele, key);
		}
	}
	/**
	图片dataBase64资源  2018/3/16
		failData异常提示图
		trueData正确提示图
	*/
	var pictureData = {
		failData:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABI0lEQVQ4T7VTy03DQBB9L5LJCXADicQJcwI6gE5CBTGVZKkApxIowT6RG5LTgAMnWCmDPOu1syG2kCJ8Wmt23mfeLHHkxyP7cRDgbRLNSMwB3jgCyQmYy9Iu9wkDgPcY8ddZ9NI17l+XfPxh7y8qVL4SAKwmUQ7yetiW5Elpb38BrKZRCnChha08YYQZwPPGwgZbZBhxroZEHq7WNqvPrYKQXSoRPJIwrgEpiQXA2M/Eq+gApicSSncgyhI0u1tJ+a29QwCbmrkBMJ2dPoBggKLNjlktNHaamYgUydpqxK0Clz2fXexiQB2i91xBkIFURQeHWBf+FOMOe6Cg/tFFOo1ee3dBpBh/2rveRfIpqB0gbYFECgGMz343rf95TMOrHFZ/ADzifRFNGInlAAAAAElFTkSuQmCC",
		trueData:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABXklEQVQ4T6WTQU7CUBCG/2mhGFdsTICNbDRlV0+g3ABOoJ5APYHlBOIJxBt4A/EG7Gh0Yd0AiZvuDG3hN6/wSAvUNPEt38x8M/P/7wn+eWS7vspm9TA+uAGlA8BZx0fEcvBTnj8H4gfpmgygEZ92sDSfAFT3DUbSj2XR/bY+Rjq+AdQi+8KgvBbYKIgQtzVkA6jPW74IjgsAQHA4tby2yk0AtdC+MiBq9NxD4BGgI5BzlRQhPlNTJIBGaA8AucyrXoLXM8sbZBqRvUnFcxNAPbSHmgyyR5FAgAcV08VH4YlTRklptBI4D0DgbmqN+6rAhOnsdNZjZgGtW90x3fVPfYxFd1J6f1mJSLtpRPKZ0UDokgwERn9bGxJf08q4uXEhEXJuuxC5L2Ij1t0zgCJuJNqtNdp5ifpCWSUUd/tREXyjwJ2VvWHuX0gHEhfEXFlWgj8Tz9+33s5vLKRBKukX8UubEbaT/DcAAAAASUVORK5CYII=",
	}
	/**
	*方法: _(id)
	*用途：获取id
	*参数：id：
	*特殊情况1:  
	*/
    function _(id){
       return $("#" + id);
    }
	/**
	*方法: $(elementName)
	*用途：根据id、class、元素名选取元素
	*参数：1 # 根据id选取元素
		   2 . 根据class选取元素
		   3   没有任何前缀
	*特殊情况1:  
	*/
	function $(elementName){
		if(elementName.charAt(0) == "#"){
			return document.getElementById(elementName.substring(1, elementName.length));
		}else if(elementName.charAt(0) == "."){
			return document.getElementsByClassName(elementName.substring(1, elementName.length));

		}else
			return document.getElementsByTagName(elementName);
	}
	/**
	*方法: Color_ran(mix,max)
	*用途：获取指定范围的颜色值
	*参数：mix：最小值
	*      max：最大值
	*返回值：color
	*特殊情况1:  
	*/
    function Color_ran(mix,max){
        var r = Num_ran(mix,max);
        var g= Num_ran(mix,max);
        var b=Num_ran(mix,max);
        return "rgb("+r+","+g+","+b+")";
    }
	/**
	*方法: Num_ran(mix,max)
	*用途：获取指定范围的随机数
	*参数：mix：最小值
	*      max：最大值
	*特殊情况1:  
	*/
    function Num_ran(mix,max){
        return Math.floor(Math.random()*(max-mix)+mix)
    }
	/**
	*方法: Num_ran5()
	*用途：获取5个动态的id
	*参数：mix：最小值
	*      max：最大值
	*返回：5个随机数集合
	*特殊情况1:  
	*/
	var arra="";//用于收集返回的动态验证码
	function Num_ran5(){
	  var str="abcdefghijklnmopqrstuvwxyz";
	  var str_="";
	  
	  for(var i=0;i<5;i++){
	    str_+=str.charAt(Num_ran(0,25));
	  }
	  arra+=str_+"\n";
	  
	  return str_;
	}
	/**
	*方法: lr_cen(id)
	*用途：指定id左右居中
	*参数：id：指定id
	*特殊情况1:  
	*/
	 /*function left_cen(i_d){
			 var s_ax=(window.innerWidth-i_d.offsetWidth)/2;
		     i_d.style.marginLeft=(s_ax-4)+"px";
	 }*/
	 function top_cen(i_d){
			 var s_ax=(window.innerHeight-i_d.offsetHeight)/2;
		     i_d.style.marginTop=(s_ax-50)+"px";
	 }
     function lr_cen(id){
		var i_d=_(id);
		i_d.style.marginLeft=(window.innerWidth-i_d.offsetWidth)/2+"px";
	    setInterval(function(){
	   	    var s_ax=(window.innerWidth-i_d.offsetWidth)/2;
		    i_d.style.marginLeft=(Math.floor(s_ax-4))+"px";
	    },1);

	 }

	/**
	*方法: _cen(id)
	*用途：使指定id窗口上下左右居中
	*参数：id：指定id
	*特殊情况1:  
	*/
	 function _cen(id){
		 var i_d=_(id);
		 i_d.style.marginLeft=(window.innerWidth-i_d.offsetWidth)/2+"px";
		 i_d.style.marginTop=(window.innerHeight-i_d.offsetHeight)/2+"px";
		 setInterval(function(){
			var s_ax=(window.innerWidth-i_d.offsetWidth)/2;
		    var s_ay=(window.innerHeight-i_d.offsetHeight)/2;
		    i_d.style.marginLeft=(Math.floor(s_ax-4))+"px";
	        i_d.style.marginTop=(Math.floor(s_ay-4))+"px";
		 },1);
	 }
	
	/**
	*方法: _iframe(src_path,Og_url,Cg_url)
	*用途：生成iframe窗口
	*参数：src_path：ifarem窗口链接
	*      Og_url: 关闭图标为变化路径
	*      Cg_url: 关闭图标变化路径
	*特殊情况1:  
	*/
	 function _iframe(src_path,Og_url,Cg_url){
	   var e=document.createElement("iframe");
	   var op=0.6;
	   e.id="iframe_create";
	   e.src=src_path;
	   e.style.position="absolute";
	   e.style.zIndex="6";
       e.style.border="1px solid #ccc"
	   e.style.background="#fff";
	   e.style.borderRadius="5px";
	   e.style.opacity="0.4";
	   e.style.boxShadow="2px 2px 8px #000";
       var a_w=window.innerWidth*0.8;
	   var a_h=window.innerHeight*0.8;
       e.style.width=a_w+"px";
	   e.style.height=a_h+"px";
	   document.body.appendChild(e);
	   var e1=document.createElement("i");
	   var Left=0.91*(window.innerWidth);
	   var Top=0.05*(window.innerHeight);
	   e1.id="ico_close";
	   e1.style.opacity="0.3";
	   e1.style.background="url("+Og_url+")";
	   e1.style.width="32px";
	   e1.style.height="32px";
	   e1.style.cursor="pointer";
	   e1.style.boxShadow="1px 1px 28px #000"
	   e1.style.borderRadius="25px"
	   e1.style.position="absolute";
	   e1.style.marginLeft=Left+"px";
	   e1.style.marginTop=Top+"px";
	   e1.style.zIndex="6"
	   document.body.appendChild(e1);
       _cen("iframe_create");         //
	   opacity_hid("iframe_create",op,1);      //
	   //opacity_add("ico_close",op,1);      //
	  _("ico_close").onclick=function(){
		opacity_add("iframe_create",1,0.4);
		opacity_add("opa_",0.3,0);
        //_("ico_close").style.background="url(img/clo4.png)";
		var timer1=setTimeout(function(){
		  document.body.removeChild(_("iframe_create"));
		  document.body.removeChild(_("ico_close"));
		  document.body.removeChild(_("opa_"));
		},1000);
	 }
     _("ico_close").onmousemove=function(){
		 _("ico_close").style.opacity="0.8";
		_("ico_close").style.background="url("+Cg_url+")";
	 }
	 _("ico_close").onmouseout=function(){
		_("ico_close").style.opacity="0.3";
	    _("ico_close").style.background="url("+Og_url+")";
	 } 
	 }
	/**
	*方法: isRight(input_info)
	*用途：判断输入是否合法
	*参数：input_info: 
	*特殊情况1:  
	*/
    function isRight(input_info){
	  var u_char="abcdefghijklnmopqrstuvwxyz1234567890";
	  var flag;
	  for(var i=0;i<input_info.length;i++){
	    if(u_char.indexOf(input_info.charAt(i))==-1){
		  flag=false;
		}else{
		  flag=true; 
		}
	  }
	  return flag;
	}
	/**
	*方法: isRight_Em(input_info)
	*用途：判断邮箱输入是否合法
	*参数：input_info: 
	*特殊情况1:  
	*/
    function isRight_Em(input_info){
	  var u_char="abcdefghijklnmopqrstuvwxyz1234567890.@";
	  var flag;
	  for(var i=0;i<input_info.length;i++){
	    if(u_char.indexOf(input_info.charAt(i))==-1){
		  flag=false;
		}else{
			if(input_info.indexOf("@")!=-1){
				flag=true;
			}else{
				flag=false;
			}
		}
	  }
	  return flag;
	}
	/**
	*方法: panit_svg(date,width,height,cx,cy,r,colors,labels,rx,ry)
	*用途：用于绘制圆形统计图
	*参数：date： 
	*      width：height：面板大小
	*      cx：  cy：    重点所在处    r： 统计图半径
	*      colors：   
	*      labels：    
	*      rx： ry：  起始位置
	*特殊情况1:  
	*/
   function panit_svg(date,width,height,cx,cy,r,colors,labels,rx,ry){
	  var svgns = "http://www.w3.org/2000/svg";
      var e=document.createElementNS(svgns,"svg:svg");
	  e.setAttribute("width",width);
	  e.setAttribute("height",height);
	  e.setAttribute("viewBox","0 0 "+width+" "+height);
	  //记录date的总值
	  var total=0;
	  for(var i=0; i < date.length; i++)total=total+date[i];

	  //计算各个块区所占的度
	  var angle=[] //定义一个空数组
	  for (var i=0; i < date.length; i++) angle[i]=date[i]/total*Math.PI*2;
	  
	  //遍历每一个区块
	  var startangle = 0;  //初始度数
	  for(var i=0; i < date.length;i++){
         var endangle = startangle+angle[i];//结尾的度数
		 //计算起始和结尾两点的坐标
		 var x1=cx+Math.sin(startangle)*r;
		 var y1=cy-Math.cos(startangle)*r;
		 var x2=cx+Math.sin(endangle)*r;
		 var y2=cy-Math.cos(endangle)*r;
		 //使用svg：path绘制区块
		 var path=document.createElementNS(svgns,"path");
         var big=0;
		 if((endangle-startangle)>Math.PI) big=1;
		 //编辑路径信息
		 var d = "M " + cx + "," + cy +  //圆心
		      " L " + x1 + "," +y1 +
			  " A " + r + "," + r +
			  " 0 " + big + "1" +
			  x2 + "," + y2 +
			  " Z";
		//设置属性
		path.setAttribute("d",d);
		path.setAttribute("fill",colors[i]);
        path.setAttribute("stroke","black");
		path.setAttribute("stroke-width","2");
		e.appendChild(path);

		//设置下一个开始的起始角度
		startangle=endangle;

		//绘制区块图例名称
        var ico=document.createElementNS(svgns,"rect");
		ico.setAttribute("x",rx);
		ico.setAttribute("y",ry+30*i);
		ico.setAttribute("width",20);
		ico.setAttribute("height",20);
		ico.setAttribute("fill",colors[i]);
		ico.setAttribute("stroke","black");
		ico.setAttribute("stroke-width","2");
		e.appendChild(ico);

		//在区块图例右边添加标签
		var label=document.createElementNS(svgns,"text");
		label.setAttribute("x",rx + 30);
		label.setAttribute("y",ry + i*30+18);
		label.setAttribute("font-size","16");
		label.setAttribute("font-family","sans-serif");
		label.appendChild(document.createTextNode(labels[i]));  //添加一个文本节点
		e.appendChild(label);
	  }
	  return e;
   }
	
    /**
	 *方法名：append_front(id)
	 *用途：在指定元素id内首部添加文本
	 *参数：id：指定元素
	 *      html_text：html文本
	 *特殊情况1：需要给完整id        document.getElementById();
	 */
    function append_front(id,html_text){
	  id.insertAdjacentHTML("afterBegin",html_text);
	}
	/**
	 *方法名：append_behind(id)
	 *用途：在指定元素id内末尾添加文本
	 *参数：id：指定元素
	 *      html_text：html文本
	 *特殊情况1：需要给完整id        document.getElementById();
	 */
	function append_behind(id,html_text){
	   id.insertAdjacentHTML("beforeEnd",html_text);
	}

    /**
	 *方法名：fixnav(id,id_)
	 *用途：锁定导航栏在最顶
	 *参数名：id :要锁定的导航栏id
	 *        id_:相对id
	 *        m_top:相对id的距离top的值，判断解锁导航栏
	 *解说：需要两个id完成整个锁定 配合setInterval使用
	 */
	/*S-导航栏*/  
    function fixnav(id,id_,m_top){
		 var fix_flag=false;   //判断是处理上滑事件还是下滑事件
		 if(document.getElementById(id).getBoundingClientRect().top<1){  //判断上滑锁定
			document.getElementById(id).style.position="fixed";
			document.getElementById(id).style.zIndex="5";
            document.getElementById(id).style.marginTop="-124px";
			fix_flag=true;
		 }
		 if(fix_flag){
			if(document.getElementById(id_).getBoundingClientRect().top>m_top){//判断下滑解锁
			   document.getElementById(id).style.position="inherit";
			   document.getElementById(id).style.marginTop="0px";
			}
		 }
	}

	/*E-导航栏*/
	/*S-导航栏*/
	/**
	 *方法名：fixnav1(id)
	 *用途：锁定导航栏在最顶
	 *参数名：id :要锁定的导航栏id
	 *        scro_num:滚动条滚动到什么位置解锁导航栏
	 *解说：只需导航栏id 配合setInterval使用
	 */
    function fixnav1(id,scro_num,m_top,m1_top){
	   var fix_flag=false;       //判断是处理上滑事件还是下滑事件
	   if(document.getElementById(id).getBoundingClientRect().top<1){   //判断上滑锁定
	      document.getElementById(id).style.position="fixed";
		  document.getElementById(id).style.zIndex="5";
          document.getElementById(id).style.marginTop=m_top+"px";
		  fix_flag=true;
	   }
	   if(fix_flag){
	      if(document.body.scrollTop<scro_num){                              //判断下滑解锁
		     document.getElementById(id).style.position="inherit";
			 document.getElementById(id).style.marginTop=m1_top+"px";
			 fix_flag=false;
		  }
	   }
	}
	
	/*E-导航栏*/
	
/********************************************************************************/
    /**
	 * Title:Ver_Code
	 * Desc:未指定的id容器生成验证码
	 * Prame:id指定容器id
	 * Author:威
	 */
    function Ver_Code(id){
	   //画验证码
		var width_c=69;
		var height_c=31;
		var str="1234567890abcdefghjiklnmopqrstuvwxyz";
		drawimage();
		_(id).onclick=function(){
			drawimage();
		};
			function drawimage(){
				str_="";
			var ca=document.getElementById("show_ver");
			var ctx=ca.getContext("2d"); 
			
			/*绘制背景*/
			var str_1;

			ctx.fillStyle = Color_ran(180,240);
			ctx.fillRect(0,0,width_c,height_c);
			/*绘制文字*/
			for(var i=0;i<4;i++){
				ctx.font="20px Arial";  //设置字体
				ctx.lineWidth=5;
				ctx.fillStyle=Color_ran(0,256);
				str_1=str.charAt(Num_ran(0,36));
			   // str_=str_+str_1;
				var x_1=4+i*17
				var y_1=Num_ran(15,30);
				ctx.fillText(str_1,x_1,y_1);
				str_+=str_1;
				str_1="";

			}
			/*绘制干扰线*/
			for(var i=0;i<8;i++){
				ctx.lineWidth=1;
				ctx.fillStyle=Color_ran(0,256);
				ctx.strokeStyle=Num_ran(40,90);
				ctx.beginPath();
				ctx.moveTo(Num_ran(0,width_c),Num_ran(0,height_c));
				ctx.lineTo(Num_ran(0,width_c),Num_ran(0,height_c));
				ctx.stroke();
			}
			console.log(str_);
			return str_;
			/*绘制干扰点*/
			/*for(var i=0;i<50;i++){
				ctx.fillStyle(Color_ran(0,255));
				ctx.beginPath();
				ctx.arc(60,30,1,0,2*Math.PI,true);
				//ctx.closePath();
				ctx.fill();
			}
			ctx.closePath();*/
		}
	}
/********************************************************************************/
		/**
		intention：检测注册登录信息是否正确 -- 有三种类型【user】【pass】【email】
		params:
			doType 验证的类型
			str 验证字符
		date 2017/5/16
		author cjw
		*/
		function oldinvalidData(doType, str){
			/*
			doType:
				user
				pass
				email
			获取提示信息
			
			*/
			/*通配符参数*/
			var REGEXP_PARAMS = ''; 
			var FLAG_REG = false;
			if(doType == "user"){
				/*验证有效用户名*/
				REGEXP_PARAMS = '^[a-zA-Z0-9]{5,16}$';
			}else if(doType == "pass"){
				/*验证有效密码*/
				REGEXP_PARAMS = '^[a-zA-Z0-9]{5,16}$';
			}else if(doType == "email"){
				/*验证有效邮箱号*/
				REGEXP_PARAMS = '^([a-z0-9A-z])+@+((qq)|(163)|(sina)|(mail))+(\.com)$';
			}else{
				/*参数异常*/
				alert("输入类型参数有误");
				return;
			}
			var reg = new RegExp(REGEXP_PARAMS);
			if(reg.test(str)){
				 FLAG_REG = true;
			}
			return FLAG_REG;
		}
/********************************************************************************/
		/**
		intention：检测注册登录信息是否正确 -- 有三种类型【user】【pass】【email】
		desc：
			创建一个invalidData对象
			通过对象调用方法doReg(需检测的字符串, 检测的类型)进行检测
			通过对象调用方法getMessage()获取验证信息
			通过对象调用方法getResult()获取验证结果的布尔值
		date 2017/5/18
		date 2018 3 7 增加对应的回调方法 回调方法的类型分别是 对应的信息验证成功和对应的信息验证失败 （待更新）
		author cjw
		*/
		function invalidData(){
			//验证结果
			this.FLAG_REG = false;
			//返回验证信息
			this.MESSAGE = "";
			this.ENDMESSAGE = "";
			//设置验证类型
			this.RE_TYPE = "";
			//
			this.REGEXP_PARAMS = "";
			//需要检测的字符串
			this.MAINSTR = "";
			//执行检测的方法
			this.doReg = function (Mainstr, param_type){
				this.RE_TYPE = param_type;
				this.MAINSTR = Mainstr;
				this.mainfu(this.RE_TYPE, this.MAINSTR);
			}
			//总的方法调度
			this.mainfu = function (param_type, Mainstr) {
				switch(this.RE_TYPE){
					//user
					case "user" : 
					REGEXP_PARAMS = '^[a-zA-Z0-9]{5,16}$'; 
					this.MESSAGE = "用户名";
					this.ENDMESSAGE = "请填写6-16位有效用户名";
					break;
					//pass
					case "pass" : 
					REGEXP_PARAMS = '^[a-zA-Z0-9]{5,16}$'; 
					this.MESSAGE = "密码";
					this.ENDMESSAGE = "请填写6-16位有效密码";
					break;
					//email
					case "email" : 
					REGEXP_PARAMS = '^([a-z0-9A-z])+@+((qq)|(163)|(sina)|(mail))+(\.com)$';
					this.MESSAGE = "邮箱";
					this.ENDMESSAGE = "请填写正确的邮箱号";
					break;
					default: 
					//alert("参数RE_TYPE有误"); 
					exception.Exception("参数RE_TYPE有误");
					return;
				}
				var reg = new RegExp(REGEXP_PARAMS);
				if(reg.test(this.MAINSTR)){
					 this.FLAG_REG = true;
					 this.MESSAGE += "填写正确";
				}
				else this.MESSAGE += "填写无效" + this.ENDMESSAGE;
			} 
			
			// -- 返回提示信息 --
			this.getMessage = function () {
				return this.MESSAGE;
			} 
			// -- 返回布尔类型验证数据 --
			this.getResult = function () {
				return this.FLAG_REG;
			}
		}
		
		/*
		intention：封装json生成可识别的字符串，最后可转换为数组
		params:
			obj
			jsonHead
		date 13:39:56 2017年5月16日
		author cjw
		*/
		/*
			JSON.stringify()
			var typeStr = typeof(obj);
			var abj = new Object();
		*/
		function toStringJson(){
			return JSON.stringify(pro);
		}
		
	/**
	Map-V2 2017/12/15
	
	增加方法keySet		通过数组实现	遍历key
	增加方法getValues	通过数组实现	遍历value  
	增加方法entrySet	通过对象实现	遍历key 和 value
	增加属性length 

	values遍历案例
		var values = map.getValues();
		for(var i in values){
			alert(values[i]);
		}

	keySet遍历案例
		var keySet = map.getKeys();
		for(var i in keySet){
			alert(keySet[i]);
		}

	entrySet遍历案例 
		entry = map.entrySet();
		for(var item in entry){
			alert(entry[item].getKey);
			alert(entry[item].getValue);
		}
	
	往期版本
		Map-V1 2017/5/17
		intention：Map集合，类似于集合
		params:
			key val
			jsonHead
		date 2017/5/17
		author cjw
		闭包好处：
			1.希望一个变量长期驻扎在内存中
			2.避免全局变量的污染
			3.私有成员的存在
	*/
	function Map(){
		var keySet = new Array();
		var values = new Array();
		this.length = 0; 
		this.put = function (key, val){
			if(key == undefined) exception.NullException(key, "key值");
			if(this.get(key) == undefined){
				keySet[keySet.length] = key;
				values[values.length] = val;
				this.main(key, val);
				this.length ++;
			}
		}
		this.get = function(key) {
			return this.main(key);
		}
		//获取一个数组集
		this.getValues = function(){
			return values;
		}
		//获取一个数组集
		this.getKeys = function(){
			return keySet;
		}
		//获取一个entry set集合
		this.entrySet = function(){
			return _entrySet();
		}
		//entrySet 的私有方法
		function _entrySet (){
			var len = keySet.length;
			var str = "[";
			var sepBool = true;
			for(var i = 0; i < len; i++){
				str += sepBool ? "" : ","; 
				sepBool = false;
				str += "{";
				str += "\"getKey\":\"" + keySet[i] + "\", ";
				str += "\"getValue\":\"" + values[i] + "\"";
				str += "}"
			}
			str += "]";
			return JSON.parse(str);
		}
		var data = {};
		//闭包
		//使值不会被回收保持keep alive状态
		//函数嵌套
		this.main = (function(){
			return function(key, val){
				if(val == undefined){return data[key]}
				else{return data[key]=val}
			}
		})();
	}
/********************************************************************************/
		/**
		intention：为对象添加事件 
		-------------------------------------------------------------------------
			鼠标事件类型
				[click]
				[contextmenu]	在用户点击鼠标右键打开上下文菜单时触发
				[dblclick]		当用户双击某个对象时调用的事件句柄。
				[mousedown]		鼠标按钮被按下。
				[mouseup]		鼠标按键被松开。
				[mouseenter]	当鼠标指针移动到元素上时触发。
				[mouseleave]	当鼠标指针移出元素时触发
				[mousemove]		鼠标被移动。
				[mouseover]
				[mouseout]
		-------------------------------------------------------------------------
			键盘事件
				[keydown][keypress][keyup]
		-------------------------------------------------------------------------
			框架/对象（Frame/Object）事件
				[abort]			图像加载失败
				[beforeunload]	该事件在即将离开页面时触发
				[error]			在加载图片或图像发生错误
				[hashchange]	该事件在当前 URL 的锚部分发生修改时触发。
				[load]			一张页面或一幅图像完成加载。
				[pageshow]		该事件在用户访问页面时触发
				[pagehide]		该事件在用户离开当前网页跳转到另外一个页面时触发
				[resize]		窗口或框架被重新调整大小。
				[scroll]		当文档被滚动时发生的事件。
				[unload]		用户退出页面。 ( <body> 和 <frameset>)
		-------------------------------------------------------------------------
			表单事件
				[focus] 
				[blur]
				[change]
				[focusin]		元素即将获取焦点时触发
				[focusout]		元素即将失去焦点时触发
				[input]			元素获取用户输入时触发
				[reset]			表单重置时触发
				[search]		用户向搜索域输入文本时触发 ( <input="search">)
				[select]		用户选取文本时触发 ( <input> 和 <textarea>)
				[submit]		表单提交时触发
		-------------------------------------------------------------------------
			剪贴板事件
				[copy]			该事件在用户拷贝元素内容时触发
				[cut]			该事件在用户剪切元素内容时触发
				[paste]			该事件在用户粘贴元素内容时触发
		-------------------------------------------------------------------------
		desc：
			此封装囊括两个方法
			分别是删除 和添加

		date 2017/5/19
		author cjw
		
		function addEvent(obj, type, fn) {
			//attachEvent()来添加句柄解决ie8的问题 
			// IE 8 及更早 IE 版本
			if (obj.attachEvent) {
				obj['e' + type + fn] = fn;
				obj[type + fn] = function() {
					obj['e' + type + fn](window.event);
				}
				obj.attachEvent('on' + type, obj[type + fn]);
				
			}
			//所有主流浏览器，除了 IE 8 及更早 IE版本
			//true - 事件句柄在捕获阶段执行
			//false- false- 默认。事件句柄在冒泡阶段执行
			else obj.addEventListener(type, fn, false);
		}
		function removeEvent(obj, type, fn) {
			//detachEvent()来添加句柄解决ie8的问题 
			// IE 8 及更早 IE 版本
			if (obj.detachEvent) {
				obj.detachEvent('on' + type, obj[type + fn]);
				obj[type + fn] = null;
			} else obj.removeEventListener(type, fn, false);
		}
		
		addEvent(document.getElementById("a1"), "click", function(){
			alert("3333");
		});*/
/********************************************************************************/
	/**
	unicodeUtil对象 Unicode和中文之间的互相转换
	*/

	var unicodeUtil = {
		parseC:function(str){
			str = str.replace(/(\\u)(\w{4})/gi,function($0){ 
				return (String.fromCharCode(parseInt((escape($0).replace(/(%5Cu)(\w{4})/g,"$2")),16))); 
			}); 
			str = str.replace(/(&#x)(\w{4})/gi,function($0){ 
				return String.fromCharCode(parseInt(escape($0).replace(/(%26%23x)(\w{4})(%3B)/g,"$2"),16)); 
			}); 
			return str; 
		},
		parseU:function(data){
			if(data == '') return '请输入汉字';
		  	var str ='';
		  	for(var i=0;i<data.length;i++){
				if(unicodeUtil.isChinese(data[i])) str += "\\u"+parseInt(data[i].charCodeAt(0),10).toString(16);
				else str += data[i];
			}
		 	return str;
		},
		isChinese:function(str){
	　　　　for(var i = 0;i < str.length; i++){
				if(str.charCodeAt(i) <= 255)
					return false;
	　　　　}
	　　　　return true;
		}
	}
	/**
	  
		JSON-V2 
		整个处理过程有3个类
	  		JSONTokener	  	转换对象和字符串的核心类 
	  		JSONArray	   	数组集对象，负责装载数据的实体类 
	  		JSONObject	   	单个对象，负责装载数据的实体类 
			JSONAmbiguitychar 处理冲突字符主要对象
			JSONAc 			调用JSONAmbiguitychar 
		@author 威 
		2017年12月15日
		
		使用案例
			var tokener = new JSONTokener(); 
			var jsonArr = new JSONArray();
			var jsonObj = new JSONObject();

			jsonObj.put("id", new Number(12));
			jsonObj.put("name", "陈继威");

			var jsonArr2 = new JSONArray();
			var jsonObj2 = new JSONObject();
			jsonObj2.put("nameFirst", "陈");
			jsonArr2.add(jsonObj2);           在Array集中添加单个对象

			jsonObj.put("详细", jsonArr2);
			jsonArr.add(jsonObj);
			var str = tokener.parseString(jsonArr);
		
		规则
			[{"序号":"0000","紧急电话":[{"电话":"120"},{"电话":"110"}],"个人":{"性别":"男"}}]
			以上数据只用于示范
			json数据可以是
				单个对象也  			{}	 JSONObject
				数组集（多个对象）  	[]   JSONArray
			其中的属性值可以带对象 和 多个对象
			属性字符串状态必须有引号，属性值如果为数字类型不需要上引号
			
		注意：
			请使用双引号（属性字符串状态必须有引号，属性值如果为数字类型不需要上引号）
			
		冲突字符的处理
			左边是原字符 右边为转换
			[ - #5B#， 
			] - #5D#， 
			{ - #7B#， 
			} - #7D#， 
			: - #3A#， 
			" - #22#， 
			' - #27#，
			, - #28#，
			JSONObject
			put  	转换   
			put_ 	还原
			
	 */
	var Tokener = {
		TokenerObjec:new JSONTokener(),
		parseString:function(obj){
			return Tokener.TokenerObjec.parseString(obj);
		},
		parseObject:function(str){
			return Tokener.TokenerObjec.parseObject(str);
		}
	}
	function JSONTokener(){
		this.parseString = function(obj){
			if(obj == undefined)
				exception.NullException(obj, "obj");
			return _toString(obj);
		}
		//将对象转换成字符串起始处
		function _toString(obj){
			if(obj instanceof JSONArray){
				return _toStirngArray(obj);
			}
			return _toStringObject(obj);
		}
		//对JSONObject的处理方式
		function _toStringObject(obj){
			var str = "";
			var sepBool = true;
			var keySet = obj.getKeySet(); 
			for(var keyIndex in keySet){
				str += sepBool ? "" : ", ";
				sepBool = false;
				str += "\"" + keySet[keyIndex] + "\":";
				var value = obj.get(keySet[keyIndex]);
				if(value instanceof JSONArray){
					str += _toStirngArray(value);
					continue;
				}
				else if(value instanceof JSONObject){
					str += _toStringObject(value);
					continue;
				}
				if(!isNaN(value))
					str += value;
				else
					str += "\"" + value + "\"";	
			}
			return "{" + str.toString() + "}";
		}
		//对JSONArray的处理方式
		function _toStirngArray(arr){
			var str = "";
			var sepBool = true;
			for(var i = 0; i < arr.get().size(); i ++){
				str += sepBool ? "" : ",";
				sepBool = false; 
				str += _toStringObject(arr.getJSONObject(i));
			}
			return "[" + str.toString() + "]";
		}	
		//将字符串转换成对象
		this.parseObject = function(str){
			return _parseObject(str);
		}
		//判断处理方式
		function _parseObject(str){
			console.log("_parseObject - "+str);
			var c = str.trim().charAt(0);
			if(c == '['){
				return _dealArray(str.substring(1, str.length - 1));
			}else if (c == '{'){
				return _dealObject(str.substring(1, str.length - 1));
			}else{
				exception.Exception("数据有误");
			}
		}
		
		
		// 数组处理方式 
		// 参数
		// 	去掉前后‘[’，‘]’字符
		// JSONArray
		function _dealArray(str){
			var selectIndex = 0;
			var tempIndex = 0;
			var arr = new JSONArray();
			var endIndex;
			//while((tempIndex = str.indexOf(",", tempIndex + 1)) != -1){
			while(true){
				//if(_isObjectEndCharOfArray(tempIndex + 1, str)) continue;
				endIndex = _getEndIndex(str, selectIndex + 1, "{", "}");
				//selectIndex = str.indexOf('{', selectIndex);
				//alert("处理数组集字符串 ， endIndex - " + endIndex + "，总共的长度 - " + str.length);
				arr.add(_dealObject(str.substring(selectIndex + 1, endIndex).trim()));
				console.log((endIndex + 1) >= str.length);
				selectIndex = str.indexOf('{', endIndex);
				//selectIndex = tempIndex + 1;
				//alert("结束位置 - " + endIndex + "，总共的长度 - " + str.length + "，是否应该结束 - " + ((endIndex + 1) >= str.length));
				if((endIndex + 1) >= str.length) return arr;
				
			}
			/*selectIndex = str.indexOf('{', selectIndex);
			arr.add(_dealObject(str.substring(selectIndex + 1, str.length - 1)));
			return arr;*/
		}
		//在数组集字符串中找对象字符串的结束标记
		function _isObjectEndCharOfArray(startIndex, str){
			var index = startIndex;
			while(true){
				var c = str.charAt(index++);
				if(c == ' '){
					continue;
				}else if(c == '{'){
					return false;
				}
				return true;
			}
		}	
		//对象处理方式
		//参数
		// 	去掉前后‘{’，‘}’字符
		// JSONObject
		function _dealObject(str){
			var selectIndex = 0;
			var tempIndex = 0;
			var tempKey = "";		//对象中的属性
			var tempValue = null;     //对象中的属性值
			var object = new JSONObject(); //{}
			while((tempIndex = str.indexOf(':', tempIndex + 1)) != -1){
				tempKey = str.substring(selectIndex, tempIndex);
				selectIndex = tempIndex + 1;
				var tempChar;
				if((tempChar = _isObject(selectIndex, str)) != null){
					var endIndex;
					if(tempChar == '{'){
						selectIndex = str.indexOf('{', selectIndex);
						endIndex = _getEndIndex(str, selectIndex + 1, '{', '}');
					}else{
						selectIndex = str.indexOf('[', selectIndex);
						endIndex = _getEndIndex(str, selectIndex + 1, '[', ']');
					}
					//alert("对象字符串的处理 ，selectIndex - " + selectIndex + ", endIndex - " + endIndex);
					tempValue = _parseObject(str.substring(selectIndex, endIndex + 1));
					tempIndex = selectIndex = endIndex;
					selectIndex = str.indexOf(",", endIndex) + 1;
				}else{
					var tempIndex_;
					tempIndex_ = str.indexOf(",", selectIndex);
					tempValue = str.substring(selectIndex, (tempIndex_ == -1 ? str.length : tempIndex_));
					if(_isString(tempValue)) tempValue = unicodeUtil.parseC(_rep(tempValue).trim());
					else if($$.util.isBool(tempValue)){
						//console.log("(boolean)keyStr - " + tempValue);
						if(tempValue == "false") tempValue = false;
						else tempValue = Boolean(tempValue);
						//console.log("(boolean)key - " + tempValue);
					}else tempValue = tempValue.trim();
					selectIndex = tempIndex_ + 1;
				}
				object.put_(_rep(tempKey.trim()), tempValue);
			}
			return object;
		}
			
		function _isString(value){
			return value.indexOf("\"") != -1 || value.indexOf("\'") != -1;
		}
		
		//将上引号去除
		function _rep(str){
			return str.replaceAll("\"", "");
		}	

		function replaceAll(){
			
		}
		//判断对象的属性值是否为对象
		function _isObject(startIndex, str){
			var index = startIndex;
			while(true){
				var c = str.charAt(index++);
				if(c == ' '){
					continue;
				}else if(c == '[' || c == '{'){
					return c;
				}else{
					return null;
				}
			}
		}
		
		//当属性值为对象时，获取该对象字符串的结束位置
		function _getEndIndex(str, startIndex, c1, c2){
			//alert("查找结束位置的开始 - " + startIndex);
			var selectIndex, tempIndex;
			selectIndex = tempIndex = startIndex;
			var index;
			while(true){
				//alert("查找结束位置处理中 selectIndex查找'" + c2 + "', selectIndex" + selectIndex + "， 长度" + str.length);
				selectIndex = str.indexOf(c2, selectIndex);
				index = str.indexOf(c1, tempIndex);	
				
				//alert("查找结束位置处理中 ， index - "+ index + ", selectIndex - " + selectIndex);
				if( index != -1 && index < selectIndex){
					index2 = str.indexOf(c1, index + 2); //是否还存在着c1字符 （每一次循环正常是只存在一个c1）
					//alert("index - " + index + ", index2 - " + index2);
					if(index2 != -1 && index2 < selectIndex)	//存在需要找到结束的位置
					{
						//alert("对象中包含对象 - " + index2);
						selectIndex = _getEndIndex(str, index + 1, c1, c2);
					}
					tempIndex = selectIndex = selectIndex + 1;
					continue;
				}
				return selectIndex;
			}
		}
	}
	function JSONArray(){
		var containerlists = new ArrayList(); 
		this.add = function(jsonObject){
			containerlists.add(jsonObject);
		}
		this.length = function(){
			return containerlists.size();
		}
		this.getJSONObject = function(i){
			return containerlists.get(i);
		}
		this.get = function(){
			return containerlists;
		}
		this.itarator = function(){
			return containerlists.itarator();
		}
		this.toString = function(){
			return Tokener.parseString(this); 
		}
	}
	function JSONObject(){
		var map = new Map();
		this.length = map.length;
		this.put = function(key, object){
			if(typeof object == "string")
				object = JSONAc.doCheck(object);
			console.log("key"+object);
			map.put(key, object);
			
		}
		//此方法用于toker字符串转换成对象使用 JSONTokener
		this.put_ = function (key, object){
			if(typeof object == "string")
					object = JSONAc.doReducte(object);
			map.put(key, object);
		} 
		this.get = function (key){
			return map.get(key);
		}
		//this.get功能同样都是获取map中的value 不同的是之前put方法进来的冲突符都是经过处理的，想在获取会将冲突符恢复恢复
		this.getRe = function (key){
			var object = map.get(key);
			if(typeof object == "string")
				object = JSONAc.doReducte(object);
			return object;
		}
		this.getKeySet = function(){
			return map.getKeys();
		}
		this.entrySet = function(){
			return map.entrySet();
		}
		this.toString = function(){
			return Tokener.parseString(this); 
		}
	}
	//调用JSONAmbiguitychar
	var JSONAc = {
		cls:new JSONAmbiguitychar(),
		doCheck:function(str){
			return JSONAc.cls.doCheckAndReplace(str);
		},
		doReducte:function(str){
			return JSONAc.cls.doReducte(str)
		}
	}
	function JSONAmbiguitychar(){
		var mapCode = new Map();
		_init();
		function _init(){
			mapCode.put("[", "#5B#");
			mapCode.put("]", "#5D#");
			mapCode.put("{", "#7B#");
			mapCode.put("}", "#7D#");
			mapCode.put(":", "#3A#");
			mapCode.put("\"", "#22#");
			mapCode.put("\'", "#27#");
			mapCode.put(",", "#28#");
		}
		this.doCheckAndReplace = function(str){
			var keys = mapCode.getKeys();
			var values = mapCode.getValues();
			for(var i in keys){
				if(str.indexOf(keys[i]) != -1)
					str = str.replaceAll(keys[i], values[i]);
			}
			return str;
		}
		this.doReducte = function(str){
			var keys = mapCode.getKeys();
			var values = mapCode.getValues();
			for(var i in keys){
				if(str.indexOf(values[i]) != -1){
					var bool = (keys[i] == "\"" || keys[i] == "\'");
					str = str.replaceAll(values[i],  keys[i]);
				}	
			}
			return str;
		}
	}
	/**
	 * ObjectParseJSON V1 2018/9/14
	 *	将一个原始的json对象装换成封装的JSON对象（JSONObject、JSONArray）
	 * 
	 * 
	 * 
	 * 
	 */
	function ObjectParseJSON(){
		function parseJSONObject(object){
			var jsonObject = new JSONObject();
			for(var i in object){
				if(object[i] instanceof Array)
					jsonObject.put(i, parseJSONArray(object[i]));
				else 
					jsonObject.put(i, object[i]);
			}
			return jsonObject;
		}
		function parseJSONArray(object){
			var jsonArray = new JSONArray();
			var len = object.length;
			for(var i = 0; i < len; i++){
				jsonArray.add(parseJSONObject(object[i]));
			}
			return jsonArray;
		}
		this.parseJSON = function(object){
			var jsonObj;
			if(object instanceof Array) {
				jsonObj = parseJSONArray(object);
			}
			else if(object instanceof Object) {
				jsonObj = parseJSONObject(object);
			}	
			else {
				console.log("异常的数据：" + object);
			}
			return jsonObj;
		}
	}
	/**
		2017/12/15 废弃
		缺点
			分工不明确
			后期看维护难
		以上是修改后的版本
	*/
	//解析与封装json数据
    //JSONObject对象 -- 生成json字符串
	//date:2017/6/19
	/*
	生成json：
		put(key, value)			void
		getObject()             return 一个JSONObject对象的字符串数据  
	解析json：
		analy_put(key, value)	void
		get(key)				return 对应key值的value
	
	使用：
		var object = new JSONObject();
		object.put("name", "cjw");
		object.put("age","12");
		
	function JSONObject(){
		var json_object_str = "";
		var len = 0;
		//map.put("sdjfj", "fdjk"); //防止为空被回收
		this.put = function(key, value){
			json_object_str += ((len ++) == 0 ? "" : "," );
 			json_object_str += '"' + key + '":"' + value + '"';
		}
		this.getObject = function(){
			return json_object_str;
		}
		//解析时
		this.get = function (key, val){
			return this.main(key, val);
		}
		this.analy_put = function(key, value){
			this.main(key, value);
		}
		//闭包
		//使值不会被回收保持keep alive状态
		//函数嵌套
		this.main = (function(){
			var data = {};
			return function(key, val){
				len ++;
				if(val == undefined){return data[key]}
				else{return data[key]=val}
			}
		})();
	}*/
	//JSONArray对象
	//date:2017/6/19
	/*
	生成json:
		add(jsonObject)			void
		toString()				return json字符串
	解析json:
		doAnalysis(main_str)	void
		dealMain_str(main_str)	void
		length()				return analysis_Array数组长度 即 JSONArray长度
		getObject(index)		return JSONObject对象
	
	使用：
		生成josn
		var array = new JSONArray();
		array.add(object.getObject());
		var str = array.toString();
		alert(str);
		解析json
		array.doAnalysis(str);
		alert(array.length());
		for(var i = 0; i < array.length(); i++){   JSONArray遍历的方法
			array.getObject(i);
		}
		
	缺点
		分工不明确
		后期看维护难
	function JSONArray(){
		var jsonArray_str = "";
		var analysis_str = "";
		var analysis_startIndex = 0;
		//json中解析出来的每一段整编成数组
		var analysis_Array = [];
 		var len = 0;
		this.add = function (jsonObject){
			jsonArray_str += ((len ++) == 0 ? "" : "," );
			jsonArray_str += "{" + jsonObject + "}";
		} 
		// -- 生成json字符串
		this.toString = function (){
			return "[" + jsonArray_str + "]";  
		}
		// -- 解析json字符串
		this.doAnalysis = function(main_str){
			dealMain_str(rep(main_str, '"',""));
			
		}
		// 解析json
		function dealMain_str(main_str){
			var deal_str = "";
			while(main_str.indexOf("{", analysis_startIndex) != -1){
				deal_str = main_str.substring(main_str.indexOf("{", analysis_startIndex) + 1, main_str.indexOf("}", analysis_startIndex));
				analysis_startIndex = main_str.indexOf("}", analysis_startIndex) + 1;
				analysis_Array[analysis_Array.length] = deal_str;

			}
		}
		function rep (main_str, re_1, re_2){
			var str = main_str;
			var len = re_1.length;
			var index_strart = 0;
			var index_stemp = 0;
			while((index_stemp = main_str.indexOf(re_1, index_strart)) != -1){
				index_strart = index_stemp + len;
				str = str.replace(re_1, re_2);
			}
			return str;
		}
		//返回analysis_Array数组长度 即 JSONArray长度
		this.length = function (){
			return analysis_Array.length;
		}
		//解析后获取JSONObject对象
		this.getObject = function (index){
			var obj = new JSONObject();
			var main_str = analysis_Array[index];
			var stemp_array = main_str.split(",");
			for(var i = 0; i < stemp_array.length; i++){
				var stemp_arr = stemp_array[i].split(":");
			obj.analy_put(stemp_arr[0], stemp_arr[1]);
			}
			return obj;
		}
	}*/
	/**
	 * 
	 * 模拟ajax 对前台进行测试 18-9-12
	 *		successdata 模拟ajax执行成功返回的数据
	 *		faildata	模拟ajax执行失败返回的数据
	 *		isSuccess	设置ajax执行成功的方法还是执行失败的方法
	 * 使用范例
	 *	ajaxTest(
	 *		{
	 *			type:"",
	 *			url:"",
	 *			data:{},
	 *			success:function(msg){},
	 *			error:function(msg){}
	 *		},
	 *		{
	 *			successdata:"访问成功",
	 *			faildata:"服务器异常",
	 *			isSuccess:true
	 *		}
	 *	);	
	 * 可以从以上范例看出两个参数的作用：
	 *		参数1为 原ajax参数
	 *		参数2为 测试配置参数
	 */
	function ajaxTest(data, testData){
		//testData.successdata; //模拟后台传回来的成功数剧
		//testData.faildata;	
		//默认调用成功的方法
		if(testData.isSuccess == undefined)
			testData.isSuccess = true; 
		console.log("当前调用的是ajax测试版对前台页面进行测试，此方法不传递到后台，而是由前台自导自演。");
		console.log("type:"+data.type+"; url:"+data.url+"; data:"+data.data);
		//默认调用成功的方法 可以设置调用
		if(testData.isSuccess)
			data.success(testData.successdata);
		else 
			data.error(testData.faildata);
	}
	/**
	 * 
	 * ajax前后台交互封装方法 -- 使用方法类似于Jquery 中的ajax
	 * 默认值解析 ：
	 * 	   type 请求类型 默认get
	 *     async 是否异步交互 默认true
	 * @author 威 
	 * 2017年7月3日 下午11:07:25 
	 *
	 */
	function ajax(jsondata){
		//设置默认值
		jsondata.type = jsondata.type || "get";
		if(jsondata.async == undefined) jsondata.async = true;
		var xhr = null;
		if(window.XMLHttpRequest) xhr = new XMLHttpRequest();
		else xhr = new ActiveXObject("Microsoft.XMLHTTP");
		//响应状态
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				console.log("（此处是ajax源码）响应状态码："+xhr.status);
				if(xhr.status == 0){
					alert("无法与服务器建立连接");
					jsondata.error("无法与服务器建立连接");}
				else if(xhr.status == 200){
					if(jsondata.success)
						jsondata.success(xhr.responseText);
					else
						jsondata.error(xhr.responseText);
					
				} 
				else if(xhr.status == 500)
					jsondata.error("服务器异常");
			}
			
		}
		//分别判断处理post，get请求
		if(jsondata.type.toLowerCase() == "post"){
			xhr.open(jsondata.type, jsondata.url, jsondata.async);
			//
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xhr.send(jsonToStr(jsondata.data));
		}else{
			var url = jsondata.url+"?"+jsonToStr(jsondata.data);
			xhr.open(jsondata.type, url, jsondata.async);
			xhr.send();
		}
	}
	
	/**
	 * 
	 * 将json数据转化为字符串  用于get请求方式时，处理url的向后台传递的参数的处理
	 * @author 威 
	 * 2017年7月3日 下午11:07:25 
	 *
	 */
	 
	function jsonToStr(data){
		if(data == null){
			return null;
		}
		var array = [];
		for(var key in data){
			var str = key+"="+data[key];
			array.push(str);  //入栈 将值压入数组结尾
		}
		return array.join("&");  //将数组以对定的字符分隔转化为字符串
	}
/********************************************************************************/
	/*
		17/11/25
			
		size()		长度
		isEmpt()	是否为空
		add()		添加
		get(i)		获取
		remove(i)	删除
		remove(e)	删除
		toArray()	返回数组形式
		itarator()	获取一个遍历对象
		removeLast()删除最后一个
		removeFrist()	删除第一个
		getFrist()	获取第一个
		getLast()	获取最后一个
		concat()	拼接
		concatArray()  数组拼接
		replace() 	替换
		removeAll() 2017/12/28
		serch()     2017/12/28
			
			
		array_ 数组 如果为undefined则函数自个实例化
			
		itarator的使用案例	
			var it = list.itarator();
			while(it.hasNext()){
				alert(it.next());
			}
	*/
	function ArrayList(array_){
		var array;
		var length;
		setInit ();
		function setInit (){
			array = ( array == undefined ? new Array() : array_);
			length = array.length;
		}
		this.size = function (){
			return length;
		}
		this.isEmpty = function (){
			return length == 0 ? true : false;
		}
		this.add = function (e){
			array[length] = e;
			length++;
			return true;
		}
		this.concat = function (list){
			if(list.size() != 0){
				tempArray = list.toArray();
				array = array.concat(tempArray);
				length += list.size();
				return true;
			}
			return false;
		}
		this.concatArray = function (arr){
			array = arr.length == 0 ? array : array.concat(arr);
			length += arr.length; 
		}
		this.get = function (i){
			return array[i];
		}
		this.remove = function (i){
			var removeBool = false;
			if(i >= length){
				return false;
			}
			array.splice(i, 1);
			length--;
			return true;
		}
		this.serch = function(e){
			if(e == undefined){
				return false;
			}
			for(var j = 0; j < length; j++){
				if(array[j] == e)
					return true;
			}
			return false;
		}
		this.removeAll = function(){
			length = 0;
			array = new Array();
		}
		this.removeElment = function (e){
			if(e == null || e == undefined){
				return false;
			}
			for(var j = 0; j < length; j++){
				if(array[j] == e){
					array.splice(j, 1);
					length --;
					return e;
				}
			}
			return false;
		}
		this.toArray = function (){
			return array;
		}
		this.toString = function (){
			var temp = "[";
			for(var i = 0; i < length; i++){
				temp += i > 0 ? "," : "";
				temp += array[i];
			}
			return temp + "]";  
		}
		this.itarator = function (){
			return new Itarator(array);
		}
		this.removeLast = function (){
			temp = array[length-1];
			array.splice(length - 1, 1);
			length--;
			return temp;
		}
		this.removeFrist = function (){
			temp = array[0];
			array.splice(0, 1);
			length--;
			return temp;
		}
		this.getFrist = function (){
			return length == 0 ? null : array[0];
		}
		this.getLast = function (){
			return length == 0 ? null : array[length-1];
		}
		this.replace = function (i, e){
			array.splice(i, 1, e);
			return true;
		}
	}

	/*
		next()
		pre()
		hasNext()
		hasPre()

	*/
	function Itarator(array){
		var index;
		var length;
		init();
		function init(){
			index = 0;
			length = array.length;
		}
		this.next = function (){
			temp = array[index];
			index++;
			return temp;
		}
		this.pre = function (){
			temp = array[index];
			index--;
			return temp;

		}
		this.hasNext = function (){
			return index < length;
		}
		this.hasPre = function (){
			return index > -1;
		}
	}
/********************************************************************************/
	/**
	 * extends 继承支持对象	V2
	 * 方法解析 ：
	 *	对继承的讲解
	 *		可以   this.say			引用方法 可以调用      | this.a  引用属性可以调用 
	 *		类似于 function say(){} 私有方法不能直接调用   | var a   私有属性不能调用 
	 *		
	 *	案例：
	 *		子类
     *
	 *		必要代码
	 *		子类名称.extends(父类名称); //参数不是字符串
	 *
	 * @author 威 
	 * 2018/3/19 下午16:30:25 
	 */
	Function.prototype.extends = function(superClassName){
		var Super_ = function(){};
		eval("Super_.prototype = " + superClassName.getName() + ".prototype;");
		eval(this.getName()+".prototype = new Super_();");
	}
	/**
	 * extends 继承支持对象	V3
	 * 不同于以往版本的方式	
	 * 案例：
	 *		请查看同文件夹的extends.js中的案例
	 * @author 威 
	 * 2018/7/29 晚上
	 */
	var __hasProp = {}.hasOwnProperty;
	var __extends = function(child, parent) { 
		for (var key in parent) { 
			if (__hasProp.call(parent, key)) 
				child[key] = parent[key]; 
		} 
		function ctor() { 
			this.constructor = child; 
		} 
		ctor.prototype = parent.prototype; 
		child.prototype = new ctor(); 
		child.__super = parent.prototype;
		return child; 
	};
	/*
	 * InheritSupport 继承支持对象 过时
	 * 方法解析 ：
	 * 	   support(subType, inheritObject)
	 *	对继承的讲解
	 *		可以   this.say			引用方法 可以调用      | this.a  引用属性可以调用 
	 *		类似于 function say(){} 私有方法不能直接调用   | var a   私有属性不能调用 
	 *		
	 *	案例：
	 *		子类
     *
	 *		必要代码
	 *		function SubType(inheritObject){   //inheritObject 传入父类对象
	 *			父类名.call(this);	//继承父类实例属性
	 *			init();
	 *			function init(){
	 *	 			new InheritSupport().support(this, 父类对象); //提供支持
	 *			}
	 *		}
	 *
	 * @author 威 
	 * 2017年11月25日 下午17:45:25 
	1、过于复杂 2、达到继承效果但是不能用instanceof判断出父类
	function InheritSupport(){
		//切除父类多余的实例属性
		function object(obj){ //返回原型为obj的没有实例属性的对象
			function Fun(){}
			Fun.prototype = obj;
			return new Fun();
		}
		
		//处理继承属性
		function inheritProrotype(subType, superType){
			var prototype = object(superType.prototype);    //继承父类的原型属性
			prototype.constructor = subType;				//保证构造器正确 
			subType.prototype = prototype;
		}
		this.support = function (subType, superType){
			inheritProrotype(subType, superType)
		}
	}
	*/
	/**
	getName		通过函数名称获取方法名称
	getArgus	通过函数名称获取所传的参数 以数组形式返回
	*/
	Function.prototype.getName = function(aa){
		for(var i=0;i<arguments.length;i++){
			alert(arguments[i]);
		}
		return this.name || this.toString().match(/function\s*([^(]*)\(/)[1];
	}
	Function.prototype.getArgus = function(aa){
		return arguments;
	}
/********************************************************************************/
	/**
	 * 
	 * FormAjax  
	 * desc:
	 * 		对表单异步提交数据的支持
	 * V-2.1
	 * 修改内容：
	 * 		可设置超时异常	isTimeoutError 默认为true启动超时异常策略    false则关闭   	2017/12/6  
	 * 		添加后台失败回调方法	fail(data) 会触发dataobj.error方法				 	2017/12/17
	 * 		后台失败响应方法		FormAjaxUtil.failAccess	
	 * V-2
	 * 修改内容：
	 * 		增加超时异常提示方法	error
	 * 		增加回调对象即当前创建的FormAjax对象		callbackObj   后台将通过回调对象向指定位置返回成功访问的数据  
	 * 		这是后台的改动						后台相应的对象提供接口获取返回结果
	 * 		后台调用参数方式和表单提交一致						2017/12/17
	 * 案例：
	 *		var formAjax = new FormAjax({
	 *			formEle:document.getElementById("formupload"),
				callbackObj:写入当前FormAjax对象名称,
	 *			success:function(msg){   //访问成功时的回调函数
	 *				console.log(msg);
	 *			},error:function(msg){
					console.log(msg);
				}
	 *		});
	 *		后台代码：
	 *			response.getWriter().println(FormAjaxUtil.successAccess(request.getParameter("callbackObj"), data));
	 *			FormAjaxUtil			对象专门为FormAjax表单异步交互对象定义的对象
	 *			.successAccess   	 	FormAjaxUtil对象中的接口	返回符合前台的数据  
	 *			request.getParameter("callbackObj") 		获取页面FormAjax的对象用于回调
	 *			data   	传向前台的数据
	 * @author 威 
	 * 2017年12月1日 下午12:42:28 
	 *
	 */
	function FormAjax(dataobj){
		dataobj.resposeTime = dataobj.resposeTime || 3000;  //默认响应时间3秒
		if(dataobj.isTimeoutError == undefined) dataobj.isTimeoutError = true; //超时异常提示 默认为true
		if(dataobj.formEle == undefined) exception.NullException(dataobj.formEle, "formEle");
		
		var iframeElement;
		var formElement = dataobj.formEle;
		var tempaction = formElement.action;   //保留原来的action字符串
		var timer;
		formElement.onsubmit = function(){
			var parameStr = (dataobj == undefined ? "" : "?callbackObj=" + dataobj.callbackObj); //传递回调对象
			var id = "iframe_upload";
			var url = formElement.action;
			formElement.action = formElement.action + parameStr;
			formElement.insertAdjacentHTML("beforeEnd", '<iframe id="' + id + '" name="' + id + '" action="' + url + '" style="display:none;"></iframe>')
			formElement.target = id;
			if(dataobj.isTimeoutError){//是否开启异常提示
				timer = setTimeout(function(){//超时计时器  
					recove();
					dataobj.error("后台未能成功回调！！！");
				}, dataobj.resposeTime);
			}
		}
		this.msg = function (data){	//消息回调
			if(timer != undefined)
				clearTimeout(timer);  //清除超时计时
			dataobj.success(data);
			recove();
		}
		this.fail = function(data){	//消息回调
			if(timer != undefined)
				clearTimeout(timer);  //清除超时计时
			if(dataobj.error != undefined)
				dataobj.error(data);
			recove();
		}
		//复原
		function recove(){
			formElement.action = tempaction;	//将action复原
			formElement.removeAttribute("tartget");
			formElement.removeChild(document.getElementById("iframe_upload")); // 这里为什么不能引用iframeElement
		}
	}
	
/********************************************************************************/
	
/********************************************************************************/
	/**
	解析接口：
		creEle		给一个Node创建一个ChildNode并追加在Node的尾部
		creEleTop	给一个Node创建一个ChildNode并追加在Node的首部
	
	参数	
		creEle		tag	标签名
		creEleTop	tag	标签名

	案例：
		$(".self_layer_user_id")[0].creEle("Label").text("cjw1");
		$(".self_layer_user_id")[0].creEleTop("Label").text("cjw2");
		效果如下：
		<label class="self_layer_user_id">
			<label>cjw2</label>
			<label>cjw2</label>
		</label>
	*/
	Node.prototype.creEle = function(tag){
		var E = document.createElement(tag);
		this.appendChild(E);
		return E;
	}
	Node.prototype.creEleTop = function(tag){
		var newNode = document.createElement(tag);
		this.insertBefore(newNode, this.firstChild); //childNodes(0)
		return newNode;
	}
	//给一个元素添加属性
	Node.prototype.attr = function(attrName, Value){
		if(Value == undefined)
			return this.getAttribute(attrName);
		this.setAttribute(attrName, Value);
	}
	//给一个元素添加文本
	Node.prototype.text = function(text){
		if(text == undefined)
			return this.innerHTML;
		this.innerHTML = text;
	}
	//删除一个元素自身
	Node.prototype.remove = function(){
		var temp = this;
		this.parentNode.removeChild(this);
		return temp;
	}
	Node.prototype.removeAttr = function(attrName){
		this.removeAttribute(attrName);
	}
	//获取节点名称
	Node.prototype.tName = function (){
		return this.nodeName.toLowerCase();
	}

	Node.prototype.parent = function (name){
		if(name != undefined){
			var currentNode = this;
			while((currentNode = currentNode.parentNode) != null){
				if(currentNode.tName() == name)
					return currentNode;
			}
			return null;
		}
		return this.nodeParent;
	}
	Node.prototype.isParentNode = function (parent){
		if(parent == undefined)
			return false;
		var currentNode = this;
		if(currentNode.parent(parent.tName()) == parent){
			return true;
		}
		return false;
	}
	
	/**
	解析接口：
		append		给一个Node添加一个兄弟节点并追加在Node的后面
		appendTop	给一个Node添加一个兄弟节点并追加在Node的前面
		insert		给一个Node插入一个ChildNode并追加在Node的尾部
		insertTop	给一个Node插入一个ChildNode并追加在Node的首部
	
	参数	
		append		htmlText	HTML代码
		appendTop	htmlText	HTML代码
		insert		htmlText	HTML代码
		insertTop	htmlText	HTML代码

	案例：
		$(".self_layer_user_id")[0].creEle("Label").text("cjw1");
		$(".self_layer_user_id")[0].creEleTop("Label").text("cjw2");
		效果如下：
		<label class="self_layer_user_id">
			<label>cjw2</label>
			<label>cjw2</label>
		</label>
	*/
	Node.prototype.append_ = function(htmlText){
		this.insertAdjacentHTML("afterEnd",htmlText);
		return this.nextElementSibling;
	}	
	Node.prototype.appendTop = function(htmlText){
		this.insertAdjacentHTML("beforeBegin",htmlText);
		return this.previousElementSibling;
	}
	Node.prototype.insert = function(htmlText){
		this.insertAdjacentHTML("beforeEnd",htmlText);
		return this.lastElementChild;
	}
	Node.prototype.insertTop = function(htmlText){
		this.insertAdjacentHTML("afterBegin",htmlText);
		return this.firstElementChild;
	}

	Node.prototype.$ = function(elementName){
		if(elementName.charAt(0) == "#"){
			return this.getElementById(elementName.substring(1, elementName.length));
		}else if(elementName.charAt(0) == "."){
			return this.getElementsByClassName(elementName.substring(1, elementName.length));

		}else
			return this.getElementsByTagName(elementName);
	}
	//可以完成DOM链式操作
	Node.prototype.end = function(){
		var parent = this.parentElement;
		return parent.children;
	}
	Node.prototype.frist = function(){
		return this.firstElementChild;
	}
	Node.prototype.last = function(){
		return this.lastElementChild;
	}
	
	/**
	为当前元素添加样式，样式的参数方式与页面中的参数形式一致
	参数 isFlag 为覆盖参数  默认不覆盖 false为覆盖 
	案例：e.css("border:1px solid #ccc; width:200px; height:200px;");
	2017/12/6
	*/
	Node.prototype.css = function(cssText, isFlag){
		if((isFlag == undefined) && (this.style.cssText.length > 0))
			cssText += this.style.cssText;
		this.style.cssText = cssText;
	}
	Node.prototype.removeCss = function(cssText, isFlag){
		this.style.cssText = '';
	}
	//单独设置样式
	Node.prototype.css_ = function (styleKey, styleValue){
		if(styleValue == undefined)
			return this.style.getPropertyValue(styleKey);
		this.style.setProperty(styleKey, styleValue);
	}
	Node.prototype.removeCss_ = function (styleKey){
		this.style.removeProperty(styleKey);
	}
	/**
		replaceAll 替换所有
	*/
	String.prototype.replaceAll = function(repChar, newChar){
		var startIndex = 0;
		var str = tempstr = this;
		while((startIndex = tempstr.indexOf(repChar, startIndex)) != -1){
			str = str.replace(repChar, newChar);
			startIndex++;
		}
		return str;
	}

/********************************************************************************/
	//快速在js中创建link标签
	function createLink(hrefPath){
		var link = document.createElement("link");
		link.attr("rel", "stylesheet");
		link.attr("type", "text/css");
		link.attr("href", hrefPath);
		document.head.creEle("link");
	}
/********************************************************************************/
	/*
	向当前元素添加事件
	事件类型参数为 没有前缀on的格式
	
	异常
		在表单异步交互中出现异常

	案例：
		e.addEvent("click", function(){
			alert("click");
		});
	2017/12/6
	*/
	Node.prototype.addEvent = function (type, fun) { 
		if (this.addEventListener) { 
			this.addEventListener(type, fun, false); 
		} else if(this.attachEvent) {
			this.attachEvent('on' + type, fun); 
		} 
	} 


	/*//下面是使用委托的方式 提升性能  //测试
	e.addEvent("click", function(e){
		if(e.target.nodeName.toLowerCase() === 'div'){  
			alert("click div");
		}
		if(e.target.nodeName.toLowerCase() === 'ul'){  
			alert("click ul");
			
		}
		if(e.target.nodeName.toLowerCase() === 'li'){  
			alert("click li");
			e.target.css("color:#fff;");
		}
	});*/

	//删除事件句柄
	Node.prototype.removeEvent = function(type, fun) { 
		if (this.detachEvent) { 
			this.detachEvent('on' + type, fun); 
		} else if (this.removeEventListener) { 
			this.removeEventListener(type, fun, false); 
		} 
	} 
/********************************************************************************/
	/** 
	基本的动画父类 V2 2017/12/24 （AnimateTemplate）
		采用模板设计模式 

	分析：
		工能扩展-
		this.openTemplate = function(){}		在打开计时中的样式或者相关需要的调用
		this.closeTemplate = function(){}		在关闭计时中的样式或者相关需要的调用
		this.openEndTemplate = function(){}		在结束打开计时中的样式或者相关需要的调用
		this.closeEndTemplate = function(){}	在结束关闭计时中的样式或者相关需要的调用
		
		异常处理-
		this.NullException(obj, objName);  //处理不需参数的空异常提示 从而废弃了check

		预设处理-
		this.open      打开计时
		this.close	   关闭计时
		this.run	   第一次调用
		this.next	   接着调用
		
	优点： 
		代码复用率高，开发效率提升，易于扩展，扩展无需修改源码

	使用：
		根据函数需求 重写 以下方法
		this.openTemplate
		this.closeTemplate
		this.openEndTemplate
		this.closeEndTemplate
		
		注意子类要声明属性-
		self = this
		
		
	以往版本 
		基本的动画父类 V1 2017/12/8 （Animate）
		提供最原始的基本参数
		提供原始基本参数缺失验证，可通过参数扩展		check
		提供最大值情况下的策略布尔值		this.maxStrategy
		提供最小值情况下的策略布尔值		this.minStrategy
	
	*/
	function AnimateTemplate(data){
		data.aniAveVal = data.aniAveVal || 4;  			//每次动画操作的平均值
		data.aniResVal = data.aniResVal || data.aniMax;	//元素最终的结果值即为元素的高
		data.aniTime = data.aniTime || 10;				//动画平均时间
		data.aniMin = data.aniMin || 0;					//动画最小范围 一般情况默认0
		data.aniInit = data.aniInit || data.aniMin;		//初始高度

		//2017/12/19 修复 aniFlag不能赋值为false的异常
		//data.aniFlag = data.aniFlag || true;			//动画的顺序 true(false)先	run开(关)后	next关（开）
		if(data.aniFlag == undefined)
			data.aniFlag = true;

		//data.aniMax		动画最大范围  
		//data.aniEle		进行动画的直接元素
		
		//空异常
		this.NullException = function(obj, objName){
			if(obj == undefined)
				throw new Error("参数" + objName + "不能为空 == " + obj);
		}
		this.NullException(data.aniMax, "aniMax");
		this.NullException(data.aniEle, "aniEle");
 
		//模板方法 子类重写以下方法获取新的活力
		this.openTemplate = function(){}
		this.closeTemplate = function(){}
		this.openEndTemplate = function(){}
		this.closeEndTemplate = function(){}
		
		var self = this;
		this.openTimer;
		this.closeTimer;
		this.changeVal;
		if(data.aniFlag) this.changeVal = data.aniInit;
		else this.changeVal = data.aniMax;
		
		this.close = function(){
			if(self.openTimer != undefined)
				clearInterval(self.openTimer);
			self.closeTimer = setInterval(function(){
				self.changeVal -= data.aniAveVal;
				self.closeTemplate();
				if(self.changeVal < (data.aniMin + data.aniAveVal)){
					clearInterval(self.closeTimer);
					self.closeEndTemplate();
				}	
			}, data.aniTime);
		}

		this.open = function(){
			if(self.closeTimer != undefined)
				clearInterval(this.closeTimer);
			self.openTimer = setInterval(function(){
				self.changeVal += data.aniAveVal;
				self.openTemplate();
				if(self.changeVal > (data.aniMax - data.aniAveVal)){
					clearInterval(self.openTimer);
					self.openEndTemplate();
				}
			}, data.aniTime);
		}

		this.run = function (){
			if(data.aniFlag)
				this.open();
			else
				this.close();
		}
		this.next = function (){
			if(data.aniFlag)
				this.close();
			else
				this.open();
		}
	}
	/**
		基本的动画父类 V1 2017/12/8
		提供最原始的基本参数
		提供原始基本参数缺失验证，可通过参数扩展		check
		提供最大值情况下的策略布尔值		this.maxStrategy
		提供最小值情况下的策略布尔值		this.minStrategy
	*/
	function Animate(data){
		data.aniAveVal = data.aniAveVal || 4;  			//每次动画操作的平均值
		data.aniInit = data.aniInit || data.aniMin;		//初始高度
		data.aniResVal = data.aniResVal || data.aniMax;	//元素最终的结果值即为元素的高
		data.aniTime = data.aniTime || 10;				//动画平均时间
		data.aniMin = data.aniMin || 0;					//动画最小范围 一般情况默认0

		//2017/12/19 修复 aniFlag不能赋值为false的异常
		//data.aniFlag = data.aniFlag || true;			//动画的顺序 true(false)先	run开(关)后	next关（开）
		if(data.aniFlag == undefined)
			data.aniFlag = true;

		//data.aniMax		动画最大范围  
		//data.aniEle		进行动画的直接元素
		if(!data.aniFlag)
			data.aniInit = data.aniMax;
		this.check = function(fn){
			if(typeof fn == "function")
				fn();
			if(data.aniMin == undefined || data.aniMax == undefined || data.aniEle == undefined)
				throw new Error("请提供完整的参数: data.aniMin - " + data.aniMin + ", data.aniMax - " + data.aniMax + ", data.aniEle - " + data.aniEle);
		}
		this.maxStrategy = function(changeVal){
			return changeVal > (data.aniMax - data.aniAveVal);
		}
		this.minStrategy = function(changeVal){
			return changeVal < (data.aniMin + data.aniAveVal);
		}
		
	}

	/**
	根据设定分别于上下左右四个方向展开动画函数 V - 3 2017/12/19
	

	
	
	*/
	

	//动画函数  用于高度的修改达到开闭动画的效果 V - 2  可用继承扩展动画
	//2017/11/30
	//提供run ，next接口调用，即第一次会打开/关   next会关/开, 具体情况根据参数的设定
	function AnimatedFun(data){
		data.aniAveVal = data.aniAveVal || 4;  			//每次动画操作的平均值
		data.aniInit = data.aniInit || data.aniMin;		//初始高度
		data.aniResVal = data.aniResVal || data.aniMax;	//元素最终的结果值即为元素的高
		data.aniTime = data.aniTime || 10;				//动画平均时间
		data.aniMin = data.aniMin || 0;					//动画最小范围
		data.aniFlag = data.aniFlag || false;			//动画的顺序 false先（run）开后（next）关
		//aniMax, 动画最大范围  aniEle   动画的直接元素

		if(data.aniFlag)
			data.aniInit = data.aniMax;
		
		//初始触发  根据data.aniFlag的预设进行实现
			this.run = function(){
			if(data.aniFlag)
				close();
			else
				open();
		}
		//初始触发紧接着 据data.aniFlag的预设进行实现
		this.next = function (){
			if(data.aniFlag)
				open();
			else
				close();
		}
		
		var changeHeight = data.aniInit;   //变化的值
		var timer_opne;					//
		var timer_close;					//计时器
		function open(){
			//防止重复点击异常
			if(timer_close != undefined)
				clearInterval(timer_close);
			data.aniEle.style.display = "block";
			data.aniEle.style.height = "1px";
			timer_opne = setInterval(function(){
				changeHeight += data.aniAveVal;
				data.aniEle.style.height = changeHeight + "px";
				if(changeHeight > data.aniMax - data.aniAveVal){
					data.aniEle.style.height = data.aniResVal + "px";
					clearInterval(timer_opne);
				}
			}, data.aniTime);
		}
		function close(){
			//防止重复点击异常
			if(timer_opne != undefined)
				clearInterval(timer_opne);
			timer_close = setInterval(function (){
				changeHeight -= data.aniAveVal;
				data.aniEle.style.height = changeHeight + "px";
				if(changeHeight < data.aniMin + data.aniAveVal){
					data.aniEle.style.height = data.aniMin + "px";
					data.aniEle.style.display = "none";
					clearInterval(timer_close);
				}
			}, data.aniTime);
		}
		//回调函数
		if(data.callback != undefined){
			data.callback();
		}
	}
	/**
	常规动画函数   V3.5  2017/12/24
		采用设计模式进行代码的复用优化
		用于宽度、高度的、top值、left值修改达到向左、右、上、下开闭动画的效果
	
	参数解析
		aniMax		可以代表元素高的最大值或者元素宽的最小值
		addVal  附加值   
		type			//动画方向 默认向下展开  
				right	        
				left	
					addVal 代表 margin-left
				top	
					addVal 代表 margin-top
				bottom	
		closeAll 2017/12/27
			是否完全关闭 即display：none 
			默认为完全关闭 true

		useAddVal  2017/12/30
			true  使用addVal 默认使用
			false 不使用addVal 以为元素position为fixed 特殊设置无需使用

	使用：
		元素的容器必须设置边框才能正常的设定元素的动画展开方向
		
		使用案例-
		var ani2 = new AnimateSimple({
			aniEle:$(".div1")[0],	//动画元素
			aniMax:300,		//可以代表元素高的最大值或者元素宽的最小值
			aniFlag:false,  //先关
			type:"left",	//[right、top、bottom]
			initLeft:0,     //initTop    
			aniTime:4,
		});

	以往版本：
		V3 AnimateSimple	无设计模式的引入
		V2 AnimatedFun		无设计模式的引入
	*/
	AnimateRoutine.extends(AnimateTemplate);
	function AnimateRoutine(data){
		AnimateTemplate.call(this, data);
		
		if(data.closeAll == undefined){
			data.closeAll = true;
		}
		if(data.useAddVal == undefined){
			data.useAddVal = true;
		}
		//addVal
		//data.aniMax看情况充当主要角色 可以是高或者宽
		var cssVal;
		switch(data.type){
			case "right":  
				cssVal = "width:#param1#px;";
				break;    //右
			case "left": 
				
				cssVal = "width:#param1#px;";
				if(data.useAddVal){
					this.NullException(data.addVal, "addVal");
					cssVal += "margin-left:#param2#px;"; 
				}
				break;    //左
			case "top":  
				
				cssVal = "height:#param1#px;";
				if(data.useAddVal){
					this.NullException(data.addVal, "addVal");
					cssVal += "margin-top:#param2#px;"; 
				}
				break;    //上
			case "bottom":  
				cssVal = "height:#param1#px;";
				break;    //下
			default: this.Exception(data.type, "type");
		}
		this.openTemplate = function(){
			data.aniEle.css(_css (this.changeVal), false);
		}
		this.openEndTemplate = function(){
			data.aniEle.css(_css (data.aniResVal), false);
		}

		this.closeTemplate = function(){
			data.aniEle.css(_css (this.changeVal), false);
		}
		this.closeEndTemplate = function(){
			if(data.closeAll)
				data.aniEle.css("display:none;", false);
			else
				data.aniEle.css(_css (data.aniInit), false);
		}
		
		//计算时刻变化的top、left值
		function _css (param1){
			var tempCssVal = cssVal;
			tempCssVal = tempCssVal.replace("#param1#", param1);
			if(data.useAddVal && (data.type == "left" || data.type == "top"))
				tempCssVal = tempCssVal.replace("#param2#", _calMarginVal(param1));
			return tempCssVal + "display:block;";
		}
		function _calMarginVal(val){
			return (data.aniMax - val) + data.addVal;
		}
	}
	AnimateSimple.extends(AnimateRoutine);
	function AnimateSimple(data){
		//继承AnimateRoutine 用意兼容旧的对象名
		AnimateRoutine.call(this, data);

	}
	/**
	动画函数  用于宽度、高度的、top值、left值修改达到向左、右、上、下开闭动画的效果 V3  2017/12/19
		AnimatedFun 的扩展
	
	参数解析
		aniMax		可以代表元素高的最大值或者元素宽的最小值
		addVal  附加值   
		type			//动画方向 默认向下展开  
				right	        
				left	
					addVal 代表 margin-left
				top	
					addVal 代表 margin-top
				bottom		
	
	注意：
		元素的容器必须设置边框才能正常的设定元素的动画展开方向
	
	使用案例：
		var ani2 = new AnimateSimple({
			aniEle:$(".div1")[0],	//动画元素
			aniMax:300,		//可以代表元素高的最大值或者元素宽的最小值
			aniFlag:false,  //先关
			type:"left",	//[right、top、bottom]
			initLeft:0,     //initTop    
			aniTime:4,
		});
	
	
	function AnimateSimple(data){
		Animate.call(this, data);	//继承父类实例属性
		new InheritSupport().support(this, new Animate(data)); //提供支持
		//addVal
		//data.aniMax看情况充当主要角色 可以是高或者宽
	
		var self = this;
		var closeTimer;
		var openTimer;
		var changeVal;
		var cssVal;
		switch(data.type){
			case "right":  
				cssVal = "width:#param1#px;";
				break;    //右
			case "left": 
				if(data.addVal == undefined) throw new Error("请提供完整参数 ：data.initLeft :" + data.addVal);
				cssVal = "width:#param1#px;margin-left:#param2#px;";
				break;    //左
			case "top":  
				if(data.addVal == undefined) throw new Error("请提供完整参数 ：data.initTop :" + data.addVal);
				cssVal = "height:#param1#px;margin-top:#param2#px;";
				break;    //上
			case "bottom":  
				cssVal = "height:#param1#px;";
				break;    //下
			default: throw new Error("请提供完整正确的参数: data.type - " + data.type + "参数字符书写：right、left、top、bottom");
		}
		if(data.aniFlag) changeVal = data.aniInit;
		else changeVal = data.aniMax;
		
		function _open(){
			if(closeTimer != undefined)
				clearInterval(closeTimer);
			openTimer = setInterval(function(){
				changeVal += data.aniAveVal;
				data.aniEle.css(_css (changeVal), false);
				if(self.maxStrategy(changeVal)){
					data.aniEle.css(_css (data.aniResVal), false);
					clearInterval(openTimer);
				} 
			}, data.aniTime);
		}
		function _close(){
			if(openTimer != undefined)
				clearInterval(openTimer);
			closeTimer = setInterval(function(){
				changeVal -= data.aniAveVal;
				data.aniEle.css(_css (changeVal), false);
				if(self.minStrategy(changeVal)){
					data.aniEle.css("display:none;", false);
					clearInterval(closeTimer);
				}
			}, data.aniTime);
		}
		//计算时刻变化的top、left值
		function _css (param1){
			var tempCssVal = cssVal;
			tempCssVal = tempCssVal.replace("#param1#", param1);
			if(data.type == "left" || data.type == "top")
				tempCssVal = tempCssVal.replace("#param2#", _calMarginVal(param1));
			return tempCssVal + "display:block;";
		}
		function _calMarginVal(val){
			return (data.aniMax - val) + data.addVal;
		}
		//初始触发  根据data.aniFlag的预设进行实现
		this.run = function(){
			if(data.aniFlag)
				_open();
			else
				_close();
		}
		//初始触发紧接着 据data.aniFlag的预设进行实现
		this.next = function (){
			if(data.aniFlag)
				_close();
			else
				_open();
		}
	}
	*/
	/**
	斜角方向动画(根据一元一次方程展开动画对象) - V3 2017/12/24
		加入模板方法设计模式

	参数解析
			type			//动画方向 默认右上展开  
				R_T		right_top          
				R_B		right_bottom
				L_T		left_top
				L_B		left_bottom
			widthVal		//动画元素的宽
			initTop			//元素展开时的margin-top值     替代indirectVal	
			initLeft		//元素展开时的margin-left值

		修复	
			aniFlag不能设置为false的异常
			打开某一方的计时算法判断对方的计时算法是否关闭为关则先关进行新的一方的动画计时   分别是closeTimer、openTimer
		
	使用事项：
		元素的容器必须设置边框才能正常的设定元素的动画展开方向

	使用案例：	
		var ani = new AnimateEquation({
			aniEle:$(".div1")[0],	//动画元素
			aniMax:50,		//最大动画值  在动画中代表元素的高
			aniFlag:false,	//先关（run）
			widthVal:100,	//宽
			initTop:10,		//距离top
			type:"L_T",		//动画方向 左上
			initLeft:20,	//距离左边
		});

	以往版本：
		V2 2017/12/19	可以向各个斜角方向打开
		V1 2017/12/8	单一的向右上角打开
		
	*/
	AnimateBevelAngle.extends(AnimateTemplate);
	function AnimateBevelAngle(data){
		AnimateTemplate.call(this, data);

		//新增 2017/12/19
		data.type = data.type || "R_T";                        //动画方向 默认右上展开
		data.widthVal = data.widthVal || data.xVal;
		//data.initLeft;									//元素展开时的margin-left值
		data.initTop = data.indirectVal || data.initTop;     //元素展开时的margin-top值

		data.kVal = data.kVal || data.aniMax/data.widthVal;		//斜率可自定义给，或者根据已有的参数进行计算获取，即：data.aniMax/data.xVal

		//某些过时的量依然能用但不鼓励用
		//data.xVal			相当于动画元素展开时的宽，用于计算斜率     过时 等同于data.widthVal
		//data.aniMax		动画最大范围  此值相当于画元素展开时的高
		//data.indirectVal	间接值	此处是画元素展开时的margin-top值 此值将动画固定在底部某一点  过时 等同于data.initTop

		this.NullException(data.widthVal, "widthVal");
		this.NullException(data.initTop, "initTop");
		this.NullException(data.initLeft, "initLeft");
		
		var bVal = data.aniMax - data.kVal * data.widthVal;  //bVal  (y = kx + b)中的b值

		this.openTemplate = function(){
			var mVal = _calMarginVal (this.changeVal);
			data.aniEle.css("width:"+_calWidth (this.changeVal)+"px; height:"+this.changeVal+"px; margin:"+mVal.top+"px "+mVal.left+"px; display:block;", false);
		}
		this.openEndTemplate = function(){
			data.aniEle.css("width:"+data.widthVal+"px; height:"+data.aniResVal+"px; margin:"+data.initTop+"px "+data.initLeft+"px; display:block;", false);
		}

		this.closeTemplate = function(){
			var mVal = _calMarginVal (this.changeVal);
			data.aniEle.css("width:"+_calWidth (this.changeVal)+"px; height:"+this.changeVal+"px; margin:"+mVal.top+"px "+mVal.left+"px; display:block;", false);
		}
		this.closeEndTemplate = function(){
			data.aniEle.css("display:none;", false);
		}
		//随时对initTop initLeft 的值进行修改，如果需要 2017/12/28
		this.marginTop = function (topVal){
			data.initTop = topVal;
		}
		this.marginLeft = function (leftVal){
			data.initLeft = topVal;
		}
		
		//计算时刻变化的top、left值
		function _calMarginVal (hVal){
			//默认右上
			var topVal, leftVal;
			switch(data.type){
				case "R_T":  
					topVal = getTop(hVal);
					leftVal = data.initLeft;
					break;    //向右下角方向展开固定在左下 控制top值
				case "L_T": 
					topVal = getTop(hVal);
					leftVal = getLeft(hVal);
					break;    //向左上角方向展开固定在右下 控制top值 控制left值
				case "R_B":  
					topVal = data.initTop;
					leftVal = data.initLeft;
					break;    //向右下角方向展开固定在左上 无
				case "L_B":  
					topVal = data.initTop;
					leftVal = getLeft(hVal);
					break;    //向左下角方向展开固定在右上 控制left值
				default: throw new Error("请提供完整正确的参数: data.type - " + data.type + "参数字符书写：R_T、L_T、R_B、L_B");
			}
			return {top:topVal, left:leftVal};
			/*
			被替代
			return (data.aniResVal - hVal) + data.indirectVal;
			*/
		}
		//添加方法
		function getTop(hVal){
			return (data.aniResVal - hVal) + data.initTop;
		}
		function getLeft(hVal){
			return (data.widthVal - _calWidth (hVal)) + data.initLeft;
		}
		//计算时刻变化的宽
		function _calWidth (hVal){
			return (hVal - bVal)/data.kVal;
		}
	}
	AnimateEquation.extends(AnimateBevelAngle);
	function AnimateEquation(data){
		//继承AnimateBevelAngle 用意兼容旧的对象名
		AnimateBevelAngle.call(this, data);
	}
	/**
		根据一元一次方程展开动画对象 - V2 2017/12/19
			
		继承基本的动画父类	Animate
		依赖于继承支持类	InheritSupport  

		增加
			type			//动画方向 默认右上展开  
				R_T		right_top          
				R_B		right_bottom
				L_T		left_top
				L_B		left_bottom
			widthVal		//动画元素的宽
			initTop			//元素展开时的margin-top值     替代indirectVal	
			initLeft		//元素展开时的margin-left值

		修复	
			aniFlag不能设置为false的异常
			打开某一方的计时算法判断对方的计时算法是否关闭为关则先关进行新的一方的动画计时   分别是closeTimer、openTimer
		
		使用事项：
			元素的容器必须设置边框才能正常的设定元素的动画展开方向

		使用案例：	
			var ani = new AnimateEquation({
				aniEle:$(".div1")[0],	//动画元素
				aniMax:50,		//最大动画值  在动画中代表元素的高
				aniFlag:false,	//先关（run）
				widthVal:100,	//宽
				initTop:10,		//距离top
				type:"L_T",		//动画方向 左上
				initLeft:20,	//距离左边
			});
		
	
	function AnimateEquation(data){
		Animate.call(this, data);	//继承父类实例属性
		new InheritSupport().support(this, new Animate(data)); //提供支持
		
		//新增 2017/12/19
		data.type = data.type || "R_T";                        //动画方向 默认右上展开
		data.widthVal = data.widthVal || data.xVal;
		//data.initLeft;									//元素展开时的margin-left值
		data.initTop = data.indirectVal || data.initTop;     //元素展开时的margin-top值

		data.kVal = data.kVal || data.aniMax/data.widthVal;		//斜率可自定义给，或者根据已有的参数进行计算获取，即：data.aniMax/data.xVal

		//某些过时的量依然能用但不鼓励用
		//data.xVal			相当于动画元素展开时的宽，用于计算斜率     过时 等同于data.widthVal
		//data.aniMax		动画最大范围  此值相当于画元素展开时的高
		//data.indirectVal	间接值	此处是画元素展开时的margin-top值 此值将动画固定在底部某一点  过时 等同于data.initTop

		//扩展参数缺失验证
		this.check(function(){
			if(data.widthVal == undefined || data.initTop == undefined || data.initLeft == undefined)
				throw new Error("请提供完整的参数: data.widthVal - " + data.widthVal + ", data.initTop - " + data.initTop + ", data.initLeft - " + data.initLeft);
		});
		
		var bVal = data.aniMax - data.kVal * data.widthVal;  //bVal  (y = kx + b)中的b值
		var self = this;
		var closeTimer;
		var openTimer;
		var changeVal;
		if(!data.aniFlag)
			changeVal = data.aniMax;
		else
			changeVal = data.aniInit; 
		function _open(){
			if(closeTimer != undefined)
				clearInterval(closeTimer);
			openTimer = setInterval(function(){
				changeVal += data.aniAveVal;
				//data.aniEle.css("width:"+_calWidth (changeVal)+"px; height:"+changeVal+"px; margin:"+_calTop (changeVal)+"px 2px; display:block;", false);
				var mVal = _calMarginVal (changeVal);
				data.aniEle.css("width:"+_calWidth (changeVal)+"px; height:"+changeVal+"px; margin:"+mVal.top+"px "+mVal.left+"px; display:block;", false);
				if(self.maxStrategy(changeVal)){
					//data.aniEle.css("width:"+data.xVal+"; height:"+data.aniMax+"; margin:"+data.indirectVal+"px 2px; display:block;", false);
					data.aniEle.css("width:"+data.widthVal+"px; height:"+data.aniMax+"px; margin:"+data.initTop+"px "+data.initLeft+"px; display:block;", false);
					clearInterval(openTimer);
				} 
			}, data.aniTime);
		}
		function _close(){
			if(openTimer != undefined)
				clearInterval(openTimer);
			closeTimer = setInterval(function(){
				changeVal -= data.aniAveVal;
				//data.aniEle.css("width:"+_calWidth (changeVal)+"px; height:"+changeVal+"px; margin:"+_calTop (changeVal)+"px 2px; display:block;", false);
				var mVal = _calMarginVal (changeVal);
				data.aniEle.css("width:"+_calWidth (changeVal)+"px; height:"+changeVal+"px; margin:"+mVal.top+"px "+mVal.left+"px; display:block;", false);
				if(self.minStrategy(changeVal)){
					data.aniEle.css("width:0px; height:0px; margin:none; display:none;", false);
					clearInterval(closeTimer);
				}
			}, data.aniTime);
		}
		//计算时刻变化的top、left值
		function _calMarginVal (hVal){
			//默认右上
			var topVal, leftVal;
			switch(data.type){
				case "R_T":  
					topVal = getTop(hVal);
					leftVal = data.initLeft;
					break;    //向右下角方向展开固定在左下 控制top值
				case "L_T": 
					topVal = getTop(hVal);
					leftVal = getLeft(hVal);
					break;    //向左上角方向展开固定在右下 控制top值 控制left值
				case "R_B":  
					topVal = data.initTop;
					leftVal = data.initLeft;
					break;    //向右下角方向展开固定在左上 无
				case "L_B":  
					topVal = data.initTop;
					leftVal = getLeft(hVal);
					break;    //向左下角方向展开固定在右上 控制left值
				default: throw new Error("请提供完整正确的参数: data.type - " + data.type + "参数字符书写：R_T、L_T、R_B、L_B");
			}
			return {top:topVal, left:leftVal};
			
			被替代
			return (data.aniResVal - hVal) + data.indirectVal;
			
		}
		//添加方法
		function getTop(hVal){
			return (data.aniResVal - hVal) + data.initTop;
		}
		function getLeft(hVal){
			return (data.widthVal - _calWidth (hVal)) + data.initLeft;
		}
		//计算时刻变化的宽
		function _calWidth (hVal){
			return (hVal - bVal)/data.kVal;
		}
		//初始触发  根据data.aniFlag的预设进行实现
		this.run = function(){
			if(data.aniFlag)
				_open();
			else
				_close();
		}
		//初始触发紧接着 据data.aniFlag的预设进行实现
		this.next = function (){
			if(data.aniFlag)
				_close();
			else
				_open();
		}
	}*/
	/*
		根据一元一次方程展开动画对象 - V1 2017/12/8
			通过margin固定在bom位置  向右上角缓慢展开
		继承基本的动画父类	Animate
		依赖于继承支持类	InheritSupport  
		
	
	function AnimateEquation(data){   //inheritObject 传入父类对象
		Animate.call(this, data);	//继承父类实例属性
		new InheritSupport().support(this, new Animate(data)); //提供支持
		//扩展参数缺失验证
		this.check(function(){
			if(data.xVal == undefined || data.indirectVal == undefined)
				throw new Error("请提供完整的参数: data.xVal - " + data.xVal + ", data.indirectVal - " + data.indirectVal);
		});
		data.kVal = data.kVal || data.aniMax/data.xVal;		//斜率可自定义给，或者根据已有的参数进行计算获取，即：data.aniMax/data.xVal
		//data.xVal			相当于动画元素展开时的宽，用于计算斜率 
		//data.aniMax		动画最大范围  此值相当于画元素展开时的高
		//data.indirectVal	间接值	此处是画元素展开时的margin-top值 此值将动画固定在底部某一点
		var bVal = data.aniMax - data.kVal * data.xVal;
		var self = this;
		var closeTimer;
		var openTimer;
		var changeVal = data.aniInit;
		function _open(){
			if(closeTimer == undefined)
				clearInterval(closeTimer);
			openTimer = setInterval(function(){
				changeVal += data.aniAveVal;
				data.aniEle.css("width:"+_calWidth (changeVal)+"px; height:"+changeVal+"px; margin:"+_calTop (changeVal)+"px 2px; display:block;", false);
				if(self.maxStrategy(changeVal)){
					data.aniEle.css("width:"+data.xVal+"; height:"+data.aniMax+"; margin:"+data.indirectVal+"px 2px; display:block;", false);
					clearInterval(openTimer);
				} 
			}, data.aniTime);
		}
		function _close(){
			if(openTimer == undefined)
				clearInterval(openTimer);
			closeTimer = setInterval(function(){
				changeVal -= data.aniAveVal;
				data.aniEle.css("width:"+_calWidth (changeVal)+"px; height:"+changeVal+"px; margin:"+_calTop (changeVal)+"px 2px; display:block;", false);
				if(self.minStrategy(changeVal)){
					data.aniEle.css("width:0px; height:0px; margin:0px 2px; display:none;", false);
					clearInterval(closeTimer);
				}
			}, data.aniTime);
		}
		//计算时刻变化的top值
		function _calTop (hVal){
			return (data.aniResVal - hVal) + data.indirectVal;
			
		}
		//计算时刻变化的宽
		function _calWidth (hVal){
			return (hVal - bVal)/data.kVal;
		}
		//初始触发  根据data.aniFlag的预设进行实现
		this.run = function(){
			if(data.aniFlag)
				_open();
			else
				_close();
		}
		//初始触发紧接着 据data.aniFlag的预设进行实现
		this.next = function (){
			if(data.aniFlag)
				_close();
			else
				_open();
		}
	}*/
	/**
	Scale缩放动画的父类 V1 2017/12/24
		采用模板设计模式
		缩放达到展开关闭动画
		只需要提供元素即可
	*/
	AnimateScale.extends(AnimateTemplate);
	function AnimateScale(data){
		data.aniMax = 1;
		data.aniMin = 0;
		data.aniAveVal = 0.05;

		AnimateTemplate.call(this, data);
		//data.aniMax		动画最大范围  此值相当于动画元素展开翻转时的最大值
		
		this.openTemplate = function(){
			data.aniEle.style.transform = this.cssName()+"("+this.changeVal+")";
		}
		this.openEndTemplate = function(){
			data.aniEle.style.transform = this.cssName()+"("+data.aniResVal+")";
		}

		this.closeTemplate = function(){
			data.aniEle.style.transform = this.cssName()+"("+this.changeVal+")";
		}
		this.closeEndTemplate = function(){
			data.aniEle.style.transform = this.cssName()+"("+data.aniMin+")";
		}
		this.cssName = function(){}
	}
	/**左右伸缩*/
	AnimateScaleX.extends(AnimateScale);
	function AnimateScaleX(data){
		AnimateScale.call(this, data);
		//data.aniMax		动画最大范围  此值相当于动画元素展开翻转时的最大值
		
		this.cssName = function(){return "scaleX";}
	}
	/**上下伸缩*/
	AnimateScaleY.extends(AnimateScale);
	function AnimateScaleY(data){
		AnimateScale.call(this, data);
		//data.aniMax		动画最大范围  此值相当于动画元素展开翻转时的最大值
		
		this.cssName = function(){return "scaleY";}
	}
	/**左右上下伸缩*/
	AnimateScaleZ.extends(AnimateScale);
	function AnimateScaleZ(data){
		AnimateScale.call(this, data);
		//data.aniMax		动画最大范围  此值相当于动画元素展开翻转时的最大值
		
		this.cssName = function(){return "scaleZ";}
	}
	/**
	Rotate翻转动画的父类 V1 2017/12/24
		采用模板设计模式
		翻转效果
	*/
	AnimateRotate.extends(AnimateTemplate);
	function AnimateRotate(data){
		AnimateTemplate.call(this, data);
		//data.aniMax		动画最大范围  此值相当于动画元素展开翻转时的最大值
		
		this.openTemplate = function(){
			data.aniEle.style.transform = this.cssName(this.changeVal);
		}
		this.openEndTemplate = function(){
			data.aniEle.style.transform = this.cssName(data.aniResVal);
		}

		this.closeTemplate = function(){
			data.aniEle.style.transform = this.cssName(this.changeVal);
		}
		this.closeEndTemplate = function(){
			data.aniEle.style.transform = this.cssName(data.aniMin);
		}
		this.cssName = function(val){}
	}
	/**x中心轴翻转*/
	AnimateRotateX.extends(AnimateRotate);
	function AnimateRotateX(data){
		AnimateRotate.call(this, data);	//继承父类实例属性

		this.cssName = function(val){
			return "rotateX("+val+"deg)";
		}
	}
	/**y中心轴翻转*/
	AnimateRotateY.extends(AnimateRotate);
	function AnimateRotateY(data){
		AnimateRotate.call(this, data);	//继承父类实例属性

		this.cssName = function(val){
			return "rotateY("+val+"deg)";
		}
	}
	/**z中心轴旋转*/
	AnimateRotateZ.extends(AnimateRotate);
	function AnimateRotateZ(data){
		AnimateRotate.call(this, data);	//继承父类实例属性

		this.cssName = function(val){
			return "rotateZ("+val+"deg)";
		}
	}
	/**
	通过改变RotateX的值实现元素上下180度的翻转的特效
	
	function AnimateRotateX(data){
		Animate.call(this, data);	//继承父类实例属性
		new InheritSupport().support(this, new Animate(data)); //提供支持
		//扩展参数缺失验证
		this.check();
		//data.aniMax		动画最大范围  此值相当于动画元素展开翻转时的最大值
		var self = this;
		var upTimer;
		var downTimer;
		var changeVal = data.aniInit;
		function _up(){
			if(downTimer != undefined)
				clearInterval(downTimer);
			upTimer = setInterval(function(){
				changeVal += data.aniAveVal;
				console.log(changeVal);
				data.aniEle.style.transform = "rotateX("+changeVal+"deg)";
				if(self.maxStrategy(changeVal)){
					data.aniEle.style.transform = "rotateX("+data.aniMax+"deg)";
					clearInterval(upTimer);
				}
			}, data.aniTime);
		}
		function _down(){
			if(upTimer != undefined)
				clearInterval(upTimer);
			downTimer = setInterval(function(){
				changeVal -= data.aniAveVal;
				data.aniEle.style.transform = "rotateX("+changeVal+"deg)";
				if(self.minStrategy(changeVal)){
					data.aniEle.style.transform = "rotateX("+data.aniMin+"deg)";
					clearInterval(downTimer);
				}
			}, data.aniTime);
		}
		//初始触发  根据data.aniFlag的预设进行实现
		this.run = function(){
			if(data.aniFlag)
				_up();
			else
				_down();
		}
		//初始触发紧接着 据data.aniFlag的预设进行实现
		this.next = function (){
			if(data.aniFlag)
				_down();
			else
				_up();
		}
	}*/
	/**
	根据translate移动动画 V1 2017/12/24
	参数解析：
		aniFlag 默认为true 先移动  false 先还原
		以上说法不绝对
			一下设置也可以还原
			aniFlag:true,
			aniMax:0,	
			aniMin:-80,
	*/
	AnimateTranslate.extends(AnimateTemplate);
	function AnimateTranslate(data){
		AnimateTemplate.call(this, data);

		//在这里open等同于move close等同于redu
		this.openTemplate = function(){
			
			var str = this.cssStr(this.changeVal);
			data.aniEle.css(str, false);
		}
		this.openEndTemplate = function(){
			data.aniEle.css(this.cssStr(data.aniResVal), false);
		}
		this.closeTemplate = function(){
			var str = this.cssStr(this.changeVal);
			data.aniEle.css(str, false);
		}
		this.closeEndTemplate = function(){
			data.aniEle.css(this.cssStr(data.aniMin), false);
		}
		this.cssStr = function(val){}
	}
	/**根据x轴移动*/
	AnimateTranslateX.extends(AnimateTranslate);
	function AnimateTranslateX(data){
		AnimateTranslate.call(this, data);

		this.cssStr = function(val){
			return "transform: translateX("+ val +"px)";
		}
	}
	/**根据y轴移动*/
	AnimateTranslateY.extends(AnimateTranslate);
	function AnimateTranslateY(data){
		AnimateTranslate.call(this, data);

		this.cssStr = function(val){
			console.log(val);
			return "transform: translateY("+ val +"px)";
		}
	}
	/**看不出效果*/
	AnimateTranslateZ.extends(AnimateTranslate);
	function AnimateTranslateZ(data){
		AnimateTranslate.call(this, data);

		this.cssStr = function(val){
			console.log(val);
			return "transform: translateZ("+ val +"px)";
		}
	}
/********************************************************************************/
	
	/**
	2017/12/31   V2
	liElements
	cntElements
	*/
	function LiEventSuper(data){
		exception.NullException(data.liElements, "liElements");
		exception.NullException(data.cntElements, "cntElements");

		data.initIndex = data.initIndex || 0;

		var oneSelf = this;
		//当前移入样式设置
		this.overEventCss = function (i){}
		//当前移出样式设置
		this.outEventCss = function (i){}
		//e {i:preIndex}
		this.preClickFun = function (i){}
		//设置当前的元素 
		//e {i:i}
		this.nowClickFun = function (i){}
		function _init(i){
			var nowEle = data.liElements[i];
			oneSelf.nowClickFun(i);
			if(data.initStyle != undefined)
				eval("data." + data.initStyle + "(nowEle)");
		}
		//arr所有li元素以数组的形式传入
		this.doReady = function (){
			var preIndex = data.initIndex;
			_init(data.initIndex);
			var len = data.liElements.length;
			for(var i = 0; i < len; i ++){
				(function(i){
					data.liElements[i].onmouseover = function (e){
						if(data.liElements[preIndex] != e.target)
							oneSelf.overEventCss(i);
					}
					data.liElements[i].onmouseout = function (e){
						if(data.liElements[preIndex] != e.target)
							oneSelf.outEventCss(i);
					}
					data.liElements[i].onclick = function (e){
						if(data.liElements[preIndex] != e.target){
							if(data.liElements[preIndex] != undefined)
								oneSelf.preClickFun(preIndex);
							oneSelf.nowClickFun(i);
							preIndex = i;
						}
					}
				})(i);
			}
		}
	}
	/**
	2017/12/29   V1
	在ul中的li进行鼠标滑入、滑出和点击事件时并且滑过和点击事件都有相应的样式修饰和响应的执行代码
	ul
		li
		li
		li

	包括的点击事件 over out click
	
	
	function LiEventSuper(){
		var oneSelf = this;
		//当前移入样式设置
		this.overEventCss = function (e){}
		//当前移出样式设置
		this.outEventCss = function (e){}
		//当前点击时将上一次的样式还原
		this.preClickEventCss = function (e){}
		//当前点击样式设置
		this.clickEventCss = function (e){}
		//点击各个li元素之后 所产生的方法 数组集
		//有多少个元素就有多少个方法体
		//每个元素点击时需要执行的代码	对应的点击事件后的附带方法
		//按元素的顺序传入				按doReady元素的顺序传入
		this.arrFun = function (){}
		//arr所有li元素以数组的形式传入
		this.doReady = function (arr){
			var preEle_ = arr[0];	//if(preEle_ != e.target) 设定了第一个因此一开始第一个是没反应的
			var len = arr.length;
			for(var i = 0; i < len; i ++){
				(function(i){
					arr[i].onmouseover = function (e){
						if(preEle_ != e.target)
							oneSelf.overEventCss(e.target);
					}
					arr[i].onmouseout = function (e){
						if(preEle_ != e.target)
							oneSelf.outEventCss(e.target);
					}
					arr[i].onclick = function (e){
						if(preEle_ != e.target){
							if(preEle_ != undefined)
								oneSelf.preClickEventCss(preEle_);
							oneSelf.clickEventCss(e.target);
							preEle_ = e.target;
							if(oneSelf.arrFun() instanceof Array && oneSelf.arrFun().length == len)
								oneSelf.arrFun()[i]();
						}
					}
				})(i);
			}
		}
	}*/
	/**
	2017/12/29
	跟上者的区别是专注于over和上一个over事件
	参数：
		lis
	*/
	function LiEventHoverSuper(data){
		var preEle = data.lis[0]; //if(preEle != e.target) 设定了第一个因此一开始第一个是没反应的
		var oneSelf = this;
		this.index = 0;
		//当前移入样式设置
		this.overEventCss = function (e){}
		//当前点击时将上一次的样式还原
		this.preEventCss = function (e){}
		this.checkOver = function(index){
			over (data.lis[index]);
		}
		function over (e){
			oneSelf.preEventCss(preEle);
			oneSelf.overEventCss(e);
			preEle = e;
		}
		this.select = function(index){}
		this.doReady = function (){
			var len = data.lis.length;
			for(var i = 0; i < len; i ++){
				(function(i){
					data.lis[i].onmouseover = function (e){
						oneSelf.index = i;
						oneSelf.select(i);
						if(preEle != e.target)
							over(e.target);
					}
				})(i);
			}
		}
	}
	/**
	2017/12/30
	参数
	lis 
	initLi
	*/
	function LiHoverSuper(data){
		var preEle; //if(preEle != e.target) 设定了第一个因此一开始第一个是没反应的
		var oneSelf = this;
		//当前移入样式设置
		this.overCss = function (e, i){}
		//当前点击时将上一次的样式还原
		this.preOverCss = function (e, i){}
		this.overFun = function (e, i){
			this.overCss(e, i);
			this.preOverCss(e, i);
			preEle = e;
		}	//over事件调用的方法
		this.overFuns = function (e){}
		this.doReady = function (){
			var len = data.lis.length;
			for(var i = 0; i < len; i ++){
				console.log("run");
				(function(i){
					data.lis[i].onmouseover = function (e){
						if(preEle != data.lis[i]){
							oneSelf.overFun(data.lis[i], i);
							if(oneSelf.overFuns() instanceof Array && oneSelf.overFuns().length == len)
								oneSelf.overFuns()[i];
						}
					}
				})(i);
			}
		}
	}

	/*
	使用案例 
	function LiEvent_1(){
		LiEventSuper.call(this);
		new InheritSupport().support(this, new LiEventSuper());
		//var oneSelf = this;
		this.overEventCss = function (e){
			e.css("background:#555; color:#fff;", false); 
		}
		this.outEventCss = function (e){
			e.css("background:#f6f4f0; color:#555;", false); 
		}
		this.preClickEventCss = function (e){
			e.css("background:#f6f4f0; color:#555;", false);
		}
		this.clickEventCss = function (e){
			e.css("background:#555; color:#fff;", false);
		}
		var preEle = $(".con_order")[0];
		//点击各个li元素之后 所产生的方法 数组集，按doReady元素的顺序传入对应的点击事件后的附带方法
		this.arrFun = function (){return [function(){
			console.log("order");
			if(preEle != undefined)
				preEle.css("display:none;", false);
			$(".con_order")[0].css("display:block;", false);
			preEle = $(".con_order")[0];
		}, function(){
			console.log("sales");
			if(preEle != undefined)
				preEle.css("display:none;", false);
			$(".con_sales")[0].css("display:block;", false);
			preEle = $(".con_sales")[0];
		}, function(){
			console.log("goods");
			if(preEle != undefined)
				preEle.css("display:none;", false);
			$(".con_goods")[0].css("display:block;", false);
			preEle = $(".con_goods")[0];
		}];}
	}
	/*为右边的nav 和 con调用
	function SubLiEvent_1(data){
		LiEvent_1.call(this);
		new InheritSupport().support(this, new LiEvent_1());

		var preEle = data.arrCon[0];
		//点击各个li元素之后 所产生的方法 数组集，按doReady元素的顺序传入对应的点击事件后的附带方法
		this.arrFun = function (){return [function(){
			if(preEle != undefined)
				preEle.css("display:none;", false);
			data.arrCon[0].css("display:block;", false);
			preEle = data.arrCon[0];
		}, function(){
			if(preEle != undefined)
				preEle.css("display:none;", false);
			data.arrCon[1].css("display:block;", false);
			preEle = data.arrCon[1];
		}, function(){
			if(preEle != undefined)
				preEle.css("display:none;", false);
			data.arrCon[2].css("display:block;", false);
			preEle = data.arrCon[2];
		}];}
		this.doReady(data.arrNav);
	}*/

	
/***************************
	var link = {
		to:function(src){
			window.open(src); 
		},
		local:function(src){
			self.location = src;
		}
	}
*****************************************************/
	
/********************************************************************************/
/********************************************************************************/
	
	

	
	