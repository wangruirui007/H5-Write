/* 
* @Author: anchen
* @Date:   2016-12-16 15:57:43
* @Last Modified by:   anchen
* @Last Modified time: 2016-12-16 16:36:13
*/

    //获取页面尺寸  
    var canvasWidth = document.body.clientWidth;  
    var canvasHeight = canvasWidth;  
    //声明canvas  
    var canvas = document.getElementById('canvas');  
    var context = canvas.getContext('2d');  
    //设置canvas尺寸  
    canvas.width = canvasWidth * 0.98;  
    canvas.height = canvasHeight;  
    //画笔颜色  
    var strokeColor = "#f30";  
    //鼠标  
    isMouseDown = false;  
    //上一次绘制的的坐标  
    var lastLoc = {x:0,y:0};  
    //初始记录事件  
    var lastTimestamp = 0;  
    //上一次线条宽度  
    var lastLineWidth = -1;  
    //var   
    var maxV = 10;  
    var minV = 0.1;  
    var maxLineWidth = 10;  
    var minLineWidth = 1;  
      
    //点击色块切换画笔颜色  
    $(".colorBtn").on("click",function (e){  
        $(".colorBtn").removeClass('colorBtnBorder');  
        $(this).addClass("colorBtnBorder");  
        strokeColor = $(this).css("background-color");  
    })  
    //清除  
    $('#clear_btn').on('click',function (e){  
        context.clearRect( 0, 0, canvasWidth,canvasHeight);    
    })  
    //获取canvas 坐标 x，y 分别代表相对window内的xy  
    function windowToCanvas(x,y){  
        //canvas提供的方法返回canvas 距 他外围包围盒子的距离left,top值  
        var bbox = canvas.getBoundingClientRect();  
        //返回的就是canvas 内的坐标值  
        return {x : Math.round(x - bbox.left),y : Math.round(y - bbox.top)}  
    }   
    //封装 事件  
    function beginStroke(point){  
        isMouseDown = true;  
        //第一次用户画的坐标初始值  
        lastLoc = windowToCanvas(point.x,point.y);  
        //获取首次点击鼠标 事件戳  
        lastTimestamp = new Date().getTime();  
    }  
    function endStroke(){  
        isMouseDown = false;  
    }  
    function moveStroke(point){  
        //开始绘制直线  
        var curLoc = windowToCanvas(point.x , point.y);  
        //路程  
        var s = calcDistance( curLoc, lastLoc);  
        //结束时间  
        var curTimestamp = new Date().getTime();  
        //时间差  
        var t = curTimestamp - lastTimestamp;  
        //绘制线条粗细  
        var lineWidth = calcLineWidth(t,s);  
      
        //绘制  
        context.beginPath();  
        context.moveTo(lastLoc.x ,lastLoc.y);  
        context.lineTo(curLoc.x , curLoc.y);  
        context.strokeStyle = strokeColor;  
        context.lineWidth = lineWidth;  
        context.lineCap = "round";  
        context.lineJoin = "round";  
        context.stroke();     
        //给lastLoc赋值维护  
        lastLoc = curLoc;  
        //时间更新  
        lastTimestamp = curTimestamp;  
        lastLineWidth = lineWidth;    
    }  
    //pc鼠标事件  
    canvas.onmousedown = function(e){  
        e.preventDefault();  
        beginStroke({x:e.clientX , y:e.clientY});  
    }  
    canvas.onmouseup = function(e){  
        e.preventDefault();  
        endStroke();  
    }  
    canvas.onmouseout = function(e){  
        e.preventDefault();  
        endStroke();  
    }  
      
    canvas.onmousemove = function(e){  
        e.preventDefault();  
        if(isMouseDown){  
            moveStroke({x:e.clientX , y:e.clientY});      
        }  
    }  
    //移动端  
    canvas.addEventListener("touchstart",function(e){  
        e.preventDefault();  
        touch = e.touches[0]; //限制一根手指触碰屏幕  
        beginStroke({x:touch.pageX , y:touch.pageY});  
    });  
    canvas.addEventListener("touchend",function(e){  
        e.preventDefault();  
        endStroke();  
    });  
    canvas.addEventListener("touchmove",function(e){  
        e.preventDefault();  
        if( isMouseDown){  
            touch = e.touches[0];  
            moveStroke({x: touch.pageX , y:touch.pageY});     
        }  
    });  
    //速度 = 路程 / 时间     用来计算书写速度来改变线条粗细  
    function calcDistance (loc1,loc2){  
        //返回 数的平方根  
        return Math.sqrt((loc1.x - loc2.x) * (loc1.x - loc2.x) + (loc1.y - loc2.y) * (loc1.y - loc2.y) );  
    }  
    //线条宽度  
    function calcLineWidth(t,s){  
        var v = s/t;  
        var resultLineWidth;  
        if(v <= minV){  
            resultLineWidth = maxLineWidth;  
        }else if(v >= maxV){  
            resultLineWidth = minLineWidth;  
        }else{  
            resultLineWidth = maxLineWidth - (v-minV)/(maxV-minV)*(maxLineWidth-minLineWidth);  
        }  
        if( lastLineWidth == -1){  
            return resultLineWidth;  
        }else{  
            return lastLineWidth*2/3 + resultLineWidth*1/3;  
        }  
    }  


