    /*S-canlender*/
    var today=new Date();
    var year = today.getFullYear();
	var month = today.getMonth() + 1;
	var day = today.getDate(); 
	var startday=new Date(year,month-1,1).getDay();
	var preday=new Date(year,month-1,0).getDate();
	var endday=new Date(year,month,0).getDate();
    var pre_num;
	var now_num;
	var day_flag;
	var html_;
	var day_flag1=false;
	var day_flag2=true;
	var day_flag3=true;
	var day_flag4=false;
	var temp1;
	addIco("calend_top",16,16,-48,-22,"img/calend.png");
	
    _("r_ico").onclick=function(){
		_("calend_body").removeChild(_("cre_tab"));
		day_flag2=true;
		month+=1;
		startday=new Date(year,month-1,1).getDay();
	   
		preday=new Date(year,month-1,0).getDate();
		endday=new Date(year,month,0).getDate();
		day_flag3=true;
	    if(month==13){
			month=1;
			year+=1;
		}
		_("p_inner").innerHTML=year+"/"+month+"/"+day;
		date_();
	}
	_("l_ico").onclick=function(){
		_("calend_body").removeChild(_("cre_tab"));
		day_flag2=true;
		month-=1;
		startday=new Date(year,month-1,1).getDay();
		preday=new Date(year,month-1,0).getDate();
		endday=new Date(year,month,0).getDate();
	   
		day_flag3=true;
		if(month==0){
			month=12;
			year-=1;
		}
		_("p_inner").innerHTML=year+"/"+month+"/"+day;
		date_();
	   
	}
	_("p_inner").innerHTML=year+"/"+month+"/"+day;
	date_();
    function date_(){
	_("calend").style.height="155px";
	pre_num=preday-(startday-1);
	day_flag=preday;
	html_="<table id='cre_tab' style='width: 212px;text-align:center;'><tbody><tr><td>日</td><td>一</td><td>二</td><td>三</td><td>四</td><td>五</td><td>六</td></tr>";
    for(var i=1;i<6;i++){   //列
		html_+="<tr>"
		for(var j=0;j<7;j++){    //行
			console.log(i+","+j);
			if(day_flag4){
				if(pre_num>=(endday)){
					day_flag3=false;
					console.log(temp1);
					console.log("no need");
			   }
			   else{
					day_flag3=true;
					console.log(pre_num+","+endday+"need");
			   }
			}
			if(pre_num>day_flag){

				console.log(pre_num+","+day_flag+",jinqu");
				temp1=pre_num;
				pre_num=1;
				day_flag=endday;
			  
				if(day_flag2){
					day_flag1=true;
					day_flag2=false;
					day_flag4=true;
				}else{
					day_flag4=false;
				}
			}
			if(day_flag1){
				if(pre_num==today.getDate()){
					html_+="<td style='color:red;'>"+pre_num+"</td>";
					pre_num++;
					day_flag1=false;
				}
				else{
					html_+="<td>"+pre_num+"</td>";
					pre_num++;
				}
			}else{
				html_+="<td>"+pre_num+"</td>";
				pre_num++;
			}
		}
		html_+="</tr>"
	}
	if(day_flag3){
		html_+="<tr>";
		_("calend").style.height="175px";
		for(var j=0;j<7;j++){
			if(pre_num>day_flag){
				pre_num=1;
				day_flag=endday;
			}
			if(pre_num==today.getDate()){
				html_+="<td style='color:red;'>"+pre_num+"</td>";
				pre_num++;
			}
			else{
				html_+="<td>"+pre_num+"</td>";
				pre_num++;
			}
		}
		html_+="</tr>";
	}
	html_+="</tbody></table>";
	append_front(_("calend_body"),html_);
	}
	/*E-canlender*/