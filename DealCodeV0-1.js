	//===================================================================
	//=============================处理代码的显示=========================
	//===================================================================
	//异常点属性中的下划线影响
	//enctype="multipart/form-data"
	//代码不规范时
	function DealCode(){
		var str;
		var code; 
		var code_style;
		var min_count;
		var count;
		var row;
		var isEndLabel;
		var specialType_Label;	
		var code_span;
		var lock_count;
		var selectIndex;
		var styleElement;
		var codeElement;
		
		var lock_;
		var util; 
		var suport;
		var strategy;
		var singlecharstrategy;
		function setInit(){
			code = '';
			code_style = '';
			min_count = undefined;
			code_span = '';
			count = 0;
			row = 0;
			isEndLabel = false;
			lock_count = false;
			lock_ = false;
			selectIndex = undefined;
			specialType_Label = undefined;

			util = new DealCodeUtil(); 
			suport = new DealCodeSuport();
			strategy = new DealCodeStrategy();
			singlecharstrategy = new SingleCharStrategy();
		}
		this.setInit = function (dealStr_, styleElementName, codeElementName){
			str = dealStr_;
			styleElement = $("#" + styleElementName);
			codeElement = $("#" + codeElementName);
			this.start();
		}
		this.start = function (){
			setInit();
			util.dealLabelFristChar(0);
			styleElement.innerHTML = code_style;
			codeElement.innerHTML = code;
		}
		function DealCodeSuport(){
		
			this.spanCode_ = function (){
				return '<span></span>'; 
			}
			this.spanCode_red = function(){
				return '<span class="red"></span>'; 
			}
			this.spanCode_purple = function(){
				return '<span class="purple"></span>'; 
			}
			this.spanCode_text = function(){
				return '<span class="text"></span>'; 
			}
			this.spanCode_content = function(){
				return '<span class="content"></span>'; 
			}
			this.getCode = function (count,space,element_cod){
				return '<tr><td class="Serial">'+count+'</td>'+
							'<td class="row_code">'+
								space+
								element_cod+
							'</td></tr>';
			}
			this.styleCode = function (count,min_count,content){
				return ".code_box tr:nth-child("+count+") .row_code span:nth-child("+min_count+"):before{content:'"+content+"';}"
			}
		}
		function DealCodeUtil(){
			this.isEnd = function (index){
				index = str.indexOf('>', index) + 1;
				var i_temp = index;
				var char_temp;
				if(str.charAt(index) == '<'){
					i_temp++;  
					for(i_temp;;i_temp++){
						if(str.charAt(i_temp) == '/')
							return true;
						return false;
					}
				}
				return false;
			}
			this.attributeIntegrity = function (index){
				var char_temp;
				var index_itemp = index + 1;
				var max = str.length;
				for(index_itemp; index_itemp < max; index_itemp++){
					char_temp = str.charAt(index_itemp);
					if(char_temp == '='){
						var char_temp_temp;
						var index_itemp_itemp = index_itemp - 1;
						for(index_itemp_itemp;; index_itemp_itemp-- ){
							char_temp_temp = str.charAt(index_itemp_itemp);
							if(char_temp_temp == '"')
								return index_itemp_itemp + 1;
						}			
					}else if(char_temp == '>'){
							if(specialType_Label == "close")
								return index_itemp - 1;
							return index_itemp - 1;
					}
					continue;
				}
			}
			this.getSpance = function (count){
				var space = '';
				for(var i=0; i<count; i++){
					space += '&nbsp;&nbsp;';
				}
				return space;
			}
			this.dealLabel = function(index){
				var lock_count = 0;
				var max = str.length;
				for(index; index < max; index++){
					char_ = str.charAt(index);
					if(char_ == '<'){
						selectIndex = index;
						min_count--;
					}else if(char_ == ' '){
						index = singlecharstrategy.strategySpaceChar(selectIndex, index);
						selectIndex = index + 1;
					}else if(char_ == '='){
						singlecharstrategy.strategyEqualChar(selectIndex, index);
						selectIndex = index + 1;
					}else if(char_ == '>'){
						selectIndex = singlecharstrategy.strategyEndChar(selectIndex, index);
						return;
					}
				}
			}
			this.dealLabelFristChar = function (index){
				code_span = '';
				min_count = 1;
				
				var i_temp = index;
				var char_temp;
				if(str.charAt(index) == '<'){
					i_temp += 1; 
					for(i_temp;;i_temp++){
						char_temp = str.charAt(i_temp);
						if(char_temp == '!'){
							strategy.dealCommentLabel(i_temp);
							break;
						}else if((char_temp <= 'z' && char_temp >= 'a')){
							i_i_temp = str.indexOf('>', i_temp)-1;
							var char_char_temp;
							for(i_i_temp;;i_i_temp--){
								char_char_temp = str.charAt(i_i_temp);
								if((char_char_temp <= 'z' && char_char_temp >= 'a') || char_char_temp == "\'" || char_char_temp == '\"'){
									specialType_Label = "begin";
									strategy.dealBeginLabel(index);
									break;
								}
								else if(char_char_temp == ' '){
									continue;
								}else{
									specialType_Label = "close";
									strategy.dealCloseLabel(index);
									break;
								}
							}
							break;
						}else if(char_temp == ' '){
							continue;
						}
						else{
							specialType_Label = "end";
							strategy.dealEndLabel(index);
							break;
						}
					}
				}else{
					strategy.dealTextLabel(index);
				}
			}
		}

	
		function DealCodeStrategy(){
			this.dealEndLabel = function (beginIndex){
				row++;
				var endIndex = str.indexOf(">", beginIndex) + 1;
				count--;
				code += suport.getCode(row, util.getSpance(lock_count ? count-1 : count), suport.spanCode_());  
				code_style += suport.styleCode(row, min_count, str.substring(beginIndex, endIndex));
				if(endIndex <= str.length-1)
					 util.dealLabelFristChar(endIndex);
			}
			this.dealBeginLabel = function (index){
				isEndLabel = util.isEnd(index);
				row++; 
				if(!lock_count){
					count++;
				}
				if(isEndLabel)
					lock_count = true;		
				else
					lock_count = false;
				util.dealLabel(index);
			}
			this.dealCloseLabel = function (index){
				row++; 
				util.dealLabel(index);
			}
			this.dealTextLabel = function(index){	
				row++;
				endIndex = str.indexOf("<", index);
				if(endIndex == -1)
					endIndex = str.length;
				code += suport.getCode(row, util.getSpance(count), suport.spanCode_text());
				code_style += suport.styleCode(row, min_count, str.substring(index, endIndex));
				if(endIndex <= str.length - 1)
					util.dealLabelFristChar(endIndex);
			}
			this.dealCommentLabel = function(index){
				row++;
				endIndex = str.indexOf("-->", index) + 3;
				code += suport.getCode(row, util.getSpance(lock_count ? count-1 : count), suport.spanCode_content());
				code_style += suport.styleCode(row, min_count, str.substring(index-1 , endIndex));
				if(endIndex<=str.length-1)
					util.dealLabelFristChar(endIndex);
			}
		}
		function SingleCharStrategy(){
			this.strategySpaceChar = function (beginIndex, index){
				min_count++;
				if(lock_){
					lock_ = false; 
					index = util.attributeIntegrity(index);
					code_style += suport.styleCode(row, min_count, str.substring(beginIndex, index+1) + ' ');
					code_span += suport.spanCode_purple();
				}else{
					code_style += suport.styleCode(row, min_count, str.substring(beginIndex, index) + ' '); 
					code_span += suport.spanCode_();
				}
				return index;
			}
			this.strategyEqualChar = function(beginIndex, index){
				min_count++;
				code_style += suport.styleCode(row, min_count, str.substring(beginIndex, index) + ' ');
				code_span += suport.spanCode_red();
				min_count++;
				code_style += suport.styleCode(row, min_count, str.substring(index, index+1) + ' ');
				code_span += suport.spanCode_();
				lock_ = true;	
			}
			this.strategyEndChar = function (beginIndex, index){
				min_count++;
				if(lock_){
					code_style += suport.styleCode(row, min_count, str.substring(beginIndex, index));
					code_span += suport.spanCode_purple();
					min_count++;
					code_style += suport.styleCode(row, min_count, str.substring(index, index+1));
					code_span += suport.spanCode_();
					lock_ = false;   
				}else{
					index_temp_ = beginIndex;
					if(specialType_Label == "close"){
						specialType_Label == "";
						index_temp_ = beginIndex - 1;
					}
					code_style += suport.styleCode(row, min_count, str.substring(index_temp_, index+1));
					code_span += suport.spanCode_();
				}
				beginIndex = index + 1;
				if(isEndLabel){  
					isEndLabel = false;
					min_count++;
					endIndex = str.indexOf('>', beginIndex ) ;
					code_style += suport.styleCode(row, min_count, str.substring(beginIndex, endIndex+1));
					beginIndex = endIndex + 1;
					code_span += suport.spanCode_();
				}
				code += suport.getCode(row, util.getSpance(count-1), code_span);
				code_span = ''; 
				if(beginIndex<=str.length-1)
					util.dealLabelFristChar(beginIndex);
				return beginIndex;
			}
		}

		
	}
