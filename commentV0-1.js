	//=====================================================================
	//================================评论组件================================
	//=====================================================================
	//集体管理参数中的self 页面进入时初始化
	function ManageParame(){
		this.selfID = "哈哈哈" ;
		this.tempEle ;   //点击回复保存层对象
		this.Flag ; //判断是否刷新层的回复按钮
	}
	var manageParame = new ManageParame() ;
	/*function Entruster(){
		this.eventEntrust = function(e, type, tagName){
			e.addEvent(type, function(eTarget)(){
				return eTarget.target.nodeName.toLowerCase() == tagName ;
			}
		}
	}var entrust = new Entruster() ;*/
	/*
	评论框

	建楼
	
	层

	层中层
	*/
	
	var floor = new BuileFloor() ;
	floor.faceBox($(".face_cnt")[0], ["images/开心.png","images/草开心.png","images/哭笑.png","images/憨笑.png","images/尬笑.png","images/笑.png","images/自信.png","images/困.png","images/色眯.png","images/得意的笑.png","images/斜视.png","images/不开心.png","images/不明.png","images/哭.png","images/骷髅.png","images/屎.png","images/爱你.png","images/神经病.png","images/惊呆.png"]) ;
	//点击评论按钮建层
	//前台的点击和和后台的加载
	function BuileFloor(){
		var count = 0 ; //层计数
		var self = this ;
		this.layerArr = new Array() ;
		
		//发送按钮
		$("#send").onclick = function(){
			if($(".comment_li") != undefined)	//更新层数量
				count = $(".comment_li").length ;
			var layer = new BuildLayer(count, floor.dealContent($("#infoma_text").value), '{"imgPath":"images/tako.jpg","userID":"tako小王子","time":"2017年12月10日 19:20", "support":{"reCount":"0","goodCount":"0","badCount":"0"}, "reply":[]}') ;
			$("#infoma_text").value = "" ;
			self.layerArr[self.layerArr.length] = layer ;
		}
		//后台调用
		this.createComment = function(jsonStr){
			if($(".comment_li") != undefined)	//更新层数量
				count = $(".comment_li").length ;
			var layer = new BuildLayer(count, floor.dealContent(""),'{"imgPath":"images/tako.jpg","userID":"tako小王子","time":"2017年12月10日 19:20", "support":{"reCount":"0","goodCount":"0","badCount":"0"}, "reply":[]}') ;
			self.layerArr[self.layerArr.length] = layer ;
		}
		var flag3 = true ; //表情按钮逻辑
		//表情动画
		var faceAni = new AnimatedFun({
			aniEle:$(".face_cnt")[0],
			aniMin:0,
			aniMax:53,
		}) ;
		//点击出现表情框
		$("#face").addEvent("click", function(){
			if(flag3){
				flag3 = false ;
				faceAni.run() ;
			}
			else{
				flag3 = true ;
				faceAni.next() ;
			}
		}) ;
		//var len = $(".face_cnt")[0].$("img").length ;
		//for(var i = 0; i < len; i++){
		//点击每个表情返回名字 使用事件委托和冒泡原理  利于优化性能
		$(".face_cnt")[0].addEvent("click", function(e){
			if(e.target.nodeName.toLowerCase() == "img"){
				src = e.target.getAttribute("src") ;
				src = src.substring(src.lastIndexOf("/") + 1, src.length - 4) ;
				if("来一发..." == $("#infoma_text").value)
					$("#infoma_text").value = "[\\" + src + "]" ;
				else{
					$("#infoma_text").value = $("#infoma_text").value + "[\\" + src + "]" ;
				}
				flag3 = true ;
				faceAni.next() ;
			}
		}) ;
		//if(entrust.eventEntrust($(".face_cnt")[0], "click", "img"))
		function _faceModule(faceName){
			return '<img id="picture_" width="20px" height="20px" title="'+faceName+'" src="images/'+faceName+'.png">' ;
		}
		//按下发送按钮时处理发送框中的字符 提供留言层处理发送内容调用
		this.dealContent = function(content){
			if(content.indexOf("[\\") != -1){
				var con = "" ; 
				var start = 0 ;
				var selectIndex = 0 ;
				var temp ;
				while((start = content.indexOf("[", start)) != -1){
					con += content.substring(selectIndex, start) ;
					temp = content.indexOf("]", start) ;
					con += _faceModule(content.substring(start + 2 , temp)) ;
					selectIndex = start = temp + 1 ;
				}
				con += content.substring(selectIndex, content.length) ;
				return con ;
			}
			return content ;
		}
		//
		this.faceBox = function(e, pathArr){
			var faceMudle = '' ;
			for(var i = 0; i < pathArr.length; i ++){
				faceMudle += faceSupport(pathArr[i]) ;
			}
			e.insert("<ul>"+faceMudle+"</ul>") ;
			function faceSupport(path){
				return '<li><img src="'+path+'" width="25px" height="25px" /></li>' ;
			}
		}
	}
	
	//层对象
	//index 当前层的下标, imgPath 用户的头像路径, userID, time 时间, content 评论内容, self 是否当前用户发送的评论
	//{"imgPath":"","userID":"","time":"","content":"", "support":{"reCount":"0","goodCount":"0","badCount":"0"}, "reply":[{"userID":"","content":"","time":"","support":{"good_count":"0","bad_count":"0"}}]}
	//创建层中层(留言层)				_createInLayer
	//创建自身							_createSelf  _support  _module
	//刷新自身以及自身下面所属的留言层  fresh
	//删除下属留言层					removeInLayer
	//提供留言输入框					_replyModule
	//添加自身所元素的点击事件			addFun
	//别处调用留言框原处恢复			replyRefresh
	function BuildLayer(indexVal, content, jsonObjStr){
		var jsonObj = JSON.parse(jsonObjStr) ;
		//层 
		//建层中层   本层评论   
		//点赞、踩本层 踩
		//属于个人、管理员可删除本层
		var self = this ;
		var count = 0 ;  //层的回复计数
		var selfEle ;
		var time = jsonObj.time ;
		var _time = time.substring(time.length - 5, time.length) ;
		var inLayerArr = new Array() ;
		var index ;
		init() ; 
		
		function init(){
			index = indexVal ;
			$(".comment_content_cnt")[0].insert(_createSelf(_support())) ;
			selfEle = $(".comment_li")[index] ;
			
			var replyObj = jsonObj.reply ;
			var len = replyObj.length ;
			if(len > 0){
				for(var i = 0; i < len; i ++){ 
					_createInLayer(replyObj[i]) ;
					count++
				}
			}
			
		}

		
		
		function _createSelf(support){
			return '<div class="comment_li"><div class="comment_li_l"><span><img class="page_logo_img" width="40px" height="40px" title="" src="'+jsonObj.imgPath+'" alt=""/></span></div><div class="comment_li_r"><Label class="self_layer_top"><Label class="self_layer_user_id">'+jsonObj.userID+'</Label><Label class="self_layer_user_time">'+time+'</Label></Label><Label class="comment_content">'+content+'</Label><Label class="bottom_oparate"><ul>'+support+'</ul></Label></div><div class="float"></div></div>' ;
		}
		function _support(){
			if(jsonObj.userID == manageParame.selfID){
				return '<li><span class="dele_self_layer">删除</span></li>' + _module() ;
			}
			return _module() ;
		}
		function _module(){
			return '<li><span class="reply">回复</span><font class="reply_count">'+jsonObj.support.reCount+'</font></li><li><img class="good_img" width="20px" height="20px" title="" src="images/good.png" alt="" onmousemove="this.src=\'images/good_hover.png\'" onmouseout="this.src=\'images/good.png\'"/><font class="good_count">'+jsonObj.support.goodCount+'</font></li><li><img class="bad_img" width="20px" height="20px" style="transform: rotate(180deg);" title="" src="images/good.png" alt="" onmousemove="this.src=\'images/good_hover.png\'" onmouseout="this.src=\'images/good.png\'"/><font class="bad_count">'+jsonObj.support.badCount+'</font></li>' ;
		}
		//提供一个接口外调创建留言
		this.createInLayer = function(content_, object){
			_createInLayer(content_, object) ;
			count++ ;
		}
		//创建层中层
		function _createInLayer(content_, object){
			var layer_ = new BuildLayerOfLayer(self, index, count, content_, object) ;
			inLayerArr[inLayerArr.length] = layer_ ;
		}

		//当删除留言的时候之前以class名设定的点击事件将会对不上号，因此需要重新校对刷新
		this.fresh = function(){
			var len = $(".comment_li").length ;
			for(var i = 0; i < len; i ++){
				if(selfEle == $(".comment_li")[i]){
					var len_ = inLayerArr.length ;
					index = i ;
					for(var j = 0; j < len_; j ++){
						inLayerArr[j].fresh(i) ;
					}
					this.addFun(i) ;
					break ;
				}
			}
		}
		//当删除此层隶属的层中层时负责刷新剩余的层中层
		//参数inLayer是要删除的层中层对象
		this.removeInLayer = function(inLayer){
			$(".reply_count")[index].text(--reply_count) ;
			if(reply_count == 0){
				firstReply = true ;   //判断是否为第一次留言
				$(".reply_layer")[index].remove() ;
			}
			var len = inLayerArr.length ;
			var iTemp ; 
			for(var i  = 0; i < len; i ++){
				if(inLayer == inLayerArr[i]){
					iTemp = i ;
				}else{
					inLayerArr[i].fresh(index) ;
				}
			}
			//放置后面删除是因为splice会改变数组结构 
			inLayerArr.splice(iTemp, 1) ;    //从数组inLayerArr中删除 为了让写一次this.fresh时跳过无用的刷新以免异常
		}
		var ani ;
		var firstReply = true ;			//判断是否为第一次留言
		//评论框
		function _replyModule (whereEle, index){
			if($(".reply_comment")[0] != undefined)
				$(".reply_comment")[0].remove() ;
			whereEle.append_('<Label class="reply_comment"><div class="coment_input"><div class="comment_textarea"><div class="face_cnt_" style=""></div><textarea id="reply_textarea">来一发...</textarea><div style="clear:both;"></div></div><div class="comment_atta" style="height:20px;"><Label><img id="face_" width="20px" height="20px" title="" src="images/face.png" alt="" onmousemove="this.src=\'images/face_hover.png\'" onmouseout="this.src=\'images/face.png\'"/><img id="picture_" width="20px" height="20px" title="" src="images/pi.png" alt="" onmousemove="this.src=\'images/pi_hover.png\'" onmouseout="this.src=\'images/pi.png\'"/><div class="float"></div></Label><Label><img id="send_" width="20px" height="20px" title="" src="images/send.png" alt="" onmousemove="this.src=\'images/send_hover.png\'" onmouseout="this.src=\'images/send.png\'"/></Label></div></div></Label>') ;
			ani = new AnimatedFun({
				aniEle:$(".reply_comment")[0],
				aniMin:0,
				aniMax:102,
			}) ;
			var faceAni = new AnimateEquation({
				aniMax:59,
				aniEle:$(".face_cnt_")[0],
				xVal:372, 
				indirectVal:25,
			}) ;
			floor.faceBox($(".face_cnt_")[0], ["images/开心.png","images/草开心.png","images/哭笑.png","images/憨笑.png","images/尬笑.png","images/笑.png","images/自信.png","images/困.png","images/色眯.png","images/得意的笑.png","images/斜视.png","images/不开心.png","images/不明.png","images/哭.png","images/骷髅.png","images/屎.png","images/爱你.png","images/神经病.png","images/惊呆.png"]) ;
			$(".face_cnt_")[0].addEvent("click", function(e){
				if(e.target.nodeName.toLowerCase() == "img"){
					src = e.target.getAttribute("src") ;
					src = src.substring(src.lastIndexOf("/") + 1, src.length - 4) ;
					if("来一发..." == $("#reply_textarea").value)
						$("#reply_textarea").value = "[\\" + src + "]" ;
					else{
						$("#reply_textarea").value = $("#reply_textarea").value + "[\\" + src + "]" ;
					}
					faceBool = true ;
					faceAni.next() ;
				}
			}) ;
			//创建浏览条
			$("#send_").onclick = function(){
				//第一次留言插入提示语和留言所需的容器
				$(".reply")[index].text("回复") ;
				ani.next() ;
				setTimeout(function(){
					if(firstReply)		//判断是否为第一次留言
						$(".bottom_oparate")[index].appendTop('<Label class="reply_layer"><div class="reply_layer_tip">评论回复:</div><div class="reply_layer_content_area"></div></Label>') ;
					firstReply = false ;	//判断是否为第一次留言
					//更新留言层数量
					if($(".comment_li")[index].$(".reply_div") != undefined)
						count = $(".comment_li")[index].$(".reply_div").length ;
					var replyObject = JSON.parse('[{"userID":"'+manageParame.selfID+'","time":"'+_time+'","support":{"good_count":"0","bad_count":"0"}}]') ;
					_createInLayer(floor.dealContent($("#reply_textarea").value), replyObject[0]) ;
					$("#reply_textarea").value = "" ;	
					$(".reply_count")[index].text((++reply_count > 99 ? "99+" : reply_count)) ;
				}, 400) ;
				manageParame.Flag = false ;   //是否需要刷新回复按钮
				replyBool = true ;			//回复按钮的逻辑
			}
			$("#picture_").onclick = function(){
				
			}
			var faceBool = true ;
			$("#face_").addEvent("click", function(){
				if(faceBool){
					faceBool = false ;
					faceAni.run() ;
				}else{
					faceBool = true ;
					faceAni.next() ;
				}
			}) ;
		}
		var reply_count = 0 ;	//回数量
		var good_count = 0 ;	//好评数量
		var bad_count = 0 ;		//差评数量
		var replyBool ;			//回复按钮的逻辑
		//当回复框开着，别人调用时 就会出现数据不同步
		//replyBool  this.text	不同步
		this.replyRefresh = function(){
			replyBool = true ;
			$(".reply")[index].text("回复") ; 
			ani.next() ;
		}
		
		//完善功能
		this.addFun = function(index){
			$(".good_img")[index].onclick = function(){
				$(".good_count")[index].text((++good_count > 99 ? "99+" : good_count)) ;
			}
			$(".bad_img")[index].onclick = function(){
				$(".bad_count")[index].text((++bad_count > 99 ? "99+" : bad_count)) ;
			}
			
			replyBool = true ;	//判断点击同一个按钮 的不同情况
			$(".reply")[index].onclick = function(){
				//当回复框开着，别人调用时 就会出现数据不同步
				//replyBool  this.text	不同步
				if(replyBool){
					replyRefreshTime = 0 ;
					if(manageParame.Flag != undefined && manageParame.Flag){
						manageParame.tempEle.replyRefresh() ;
						replyRefreshTime = 400 ;
					}
					manageParame.tempEle = self ;//是否需要刷新回复按钮
					manageParame.Flag = true ;
					replyBool = false ;
					this.text("取消") ;
					setTimeout(function(){
						_replyModule ($(".comment_li_r")[index], index) ;
						ani.run() ;
					}, replyRefreshTime) ;	
				}else{
					manageParame.Flag = false ;//是否需要刷新回复按钮
					replyBool = true ;
					$(".reply")[index].text("回复") ;
					ani.next() ;
				}
			}
			if(jsonObj.userID == manageParame.selfID){
				$(".dele_self_layer")[index].onclick = function(){
					var len = floor.layerArr.length ;
					var iTemp ;
					for(var i = 0; i < len; i ++){
						if(self == floor.layerArr[i]){
							iTemp = i ;
							$(".comment_li")[index].remove() ;
						}else{
							floor.layerArr[i].fresh() ;
						}
					}
					floor.layerArr.splice(iTemp, 1) ;
				}
			}
		}
		this.addFun(index) ;
	}

	//index 下标, index_  层中层下标, userID , content 内容, time 时间简版, self 是否为单前账号发送的评论 good_count 评论数量, bad_count,
	//创建自身					_createSelf  _support  _module
	//删除留言时刷新下标		fresh 
	//添加其他点击事件			addFun
	function BuildLayerOfLayer(layer, index, index_, content, jsonObj){
		//jsonObj.   jsonObj.support.
		//层中层    
		//点赞、踩层中层
		//属于个人、层主、管理员可删除本层中层
		
		init() ;
		var self = this ;
		var selfEle ;
		function init(){
			$(".reply_layer_content_area")[index].insert(_createSelf(_support())) ;
			selfEle = $(".comment_li")[index].$(".reply_div")[index_] ;
		}
		function _createSelf(support){
			return '<div class="reply_div"><Label class="self_layer_top"><Label class="reply_user_id" style="float:left;">'+jsonObj.userID+'：</Label></Label><Label class="reply_content" style="background:#f6f4f0; word-wrap:break-word; padding:4px; border-radius:4px;">'+floor.dealContent(content)+'</Label></label><Label class="bottom_oparate_"><ul class="reply_layer_ul">'+support+'</ul></Label><div style="clear:both;"></div></div>' ;
		}
		function _support(){
			if(jsonObj.userID == manageParame.selfID){
				return  _module('<li><span class="dele_self_layer_">删除</span></li>') ;
			}
			return _module("") ;
		}
		function _module(code){
			return '<li>'+jsonObj.time+'</li>'+code+'<li><img class="good_img_" width="20px" height="20px" title="" src="images/good.png" alt="" onmousemove="this.src=\'images/good_hover.png\'" onmouseout="this.src=\'images/good.png\'"/><font class="good_count_">'+jsonObj.support.good_count+'</font></li><li><img class="bad_img_" width="20px" height="20px" style="transform: rotate(180deg);" title="" src="images/good.png" alt="" onmousemove="this.src=\'images/good_hover.png\'" onmouseout="this.src=\'images/good.png\'"/><font class="bad_count_">'+jsonObj.support.bad_count+'</font></li>' ;
		}
		//删除层中层时刷新
		this.fresh = function(index_){
			if(index != undefined)
				index = index_ ;
			var len = $(".comment_li")[index].$(".reply_div").length ;
			for(var i = 0; i < len; i ++){
				if(selfEle == $(".comment_li")[index].$(".reply_div")[i]){
					this.addFun(index, i) ;
					break ;
				}	
			}
		}
		var index, index_ ;
		var good_count = 0 ;	//好评数量
		var bad_count = 0 ;		//差评数量
		//完善功能
		this.addFun = function(cntIndex, eleIndex_){
			index = cntIndex ;
			index_ = eleIndex_ ;
			$(".comment_li")[index].$(".good_img_")[index_].onclick = function(){
				$(".comment_li")[index].$(".good_count_")[index_].text((++good_count > 99 ? "99+" : good_count)) ;
			}
			$(".comment_li")[index].$(".bad_img_")[index_].onclick = function(){
				$(".comment_li")[index].$(".bad_count_")[index_].text((++bad_count > 99 ? "99+" : bad_count)) ;
			}
			if(jsonObj.userID == manageParame.selfID){
				$(".comment_li")[index].$(".dele_self_layer_")[index_].onclick = function(){
					selfEle.remove() ;
					layer.removeInLayer(self) ;
				}
			}
		}
		this.addFun(index, index_) ;
		
	}	
