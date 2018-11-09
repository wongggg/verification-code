;(function(undefined){
        "use strict"
        var _global;
        
       function VerificationCode(id,config){
           this._init(id,config);
        };
        let codeList = [];//储存已绑定元素ID
        VerificationCode.prototype = { 
            constructor: this,
            id:'',
            ctx:null,
            result:'',//验证码
            canvas:null,
            defaultCofing :{
                clickRefresh:true,//点击刷新
                //验证码参数 number->纯数字 letter->纯字母 [arr] || string->自定义字符集
                characterSet:[0,1,2,3,4,5,6,7,8,9,"A","B","C","D","E","F","G","H","I","J","K","L","N","M","O","P","Q","R","S","T","U","V","W","X","Y","Z"],
                caseSensitive:false,//大小写敏感
                fontSize:25,
                width:200,
                height:50,
                backgroundColor:"#EDEDED",
                color:"", //''->随机颜色 [color1,color2]->颜色组
                rotate:true,//字体偏转
                canvasID:"",//生成canvas的ID 空则随机生成uuid
                interference:60,//干扰物 [0-100]
                len: 6,//验证码长度
                resultInput:''//选填，输入验证码input的ID
            },
            _init:function(id,config){
                this.id = id 
                if(!this.id || typeof id !=="string"){
                    console.error("needs tag ID")
                    return false
                }
                if(codeList.indexOf(this.id)>-1){
                    console.error(`"${this.id}" is already attached to the provided element.`)
                    return false
                }
                codeList.push(this.id)
               
                for(let key in config){
                    if(typeof this.defaultCofing[key]!=="undefined"){
                        if(key==="characterSet"){
                            switch(config[key]){
                                case "number":
                                this.defaultCofing.characterSet = [0,1,2,3,4,5,6,7,8,9]
                                break;
                                case "letter":
                                this.defaultCofing.characterSet = ["A","B","C","D","E","F","G","H","I","J","K","L","N","M","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
                                break;
                                default:
                                if(config[key].length>0){
                                    this.defaultCofing[key] = config[key];
                                }
                            }
                        }else{
                            this.defaultCofing[key] = config[key];
                        } 
                    }else{
                        console.warn(`There is no config named ${key}`);
                    }
                }
                if(!config || !config.fontSize){
                    this.defaultCofing.fontSize = this.defaultCofing.height*0.6;
                }
                var ele = document.getElementById(this.id);
                if(document.createElement("canvas").getContext==="undefined"){
                    console.warn("The brownser doesn't support 'canvas'");
                    return false;
                }
                this.canvas = document.createElement("canvas");
                var uuid = this.defaultCofing.canvasID || `VerificationCode-${this._creatCode()}-${this._creatCode()}`;
                this.canvas.id = uuid;
                this.canvas.width = this.defaultCofing.width;
                this.canvas.height = this.defaultCofing.height;
                if(this.defaultCofing.clickRefresh){this.canvas.style.cursor = "pointer"};
                this.canvas.style.backgroundColor = this.defaultCofing.backgroundColor;
                ele.append(this.canvas);
                this.ctx = document.getElementById(this.canvas.id).getContext("2d");
                this.result = this._creatCode(this.defaultCofing.len,this.defaultCofing.characterSet);
                if(this.defaultCofing.clickRefresh){
                
                    document.getElementById(this.canvas.id).addEventListener("click",function(){
                    this.refresh();
                }.bind(this))}
                this._drawCanvas();
            },//_init
          
            _creatCode: function(len,chars){
                var _chars = chars || '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
                var _len = len || this.defaultCofing.len  ;          
                var resultCode = '';
                for(let i =0;i<_len;i++){
                    resultCode+=_chars[Math.round(Math.random()*(_chars.length-1))];
                }
                return resultCode
            },//_creatCode
            _getColor:function(color){
                let result;
                return  result = color?
                color[Math.round(Math.random()*color.lenth)]:
                `rgb(${Math.round(Math.random()*255)},${Math.round(Math.random()*255)},${Math.round(Math.random()*255)})`;
            },//_getColor
            _drawCanvas:function(){
                
                for(let i in this.result){
                     this.ctx.font = `${this.defaultCofing.fontSize}px Arial`;
                     var xSide = this.defaultCofing.width/this.result.length*i + (this.defaultCofing.width/this.result.length/2-Math.round(this.defaultCofing.fontSize/2)); 
                     this.ctx.fillStyle = this._getColor(this.defaultCofing.color);
                     this.ctx.translate(xSide,0);
                     var rotateAngel = (Math.round(Math.random()*50)-25)*Math.PI/180;
                     this.defaultCofing.rotate?this.ctx.rotate(rotateAngel):'';
                     this.ctx.fillText(this.result[i],0,(this.defaultCofing.height/2+Math.round(this.defaultCofing.fontSize/2)));
                     this.defaultCofing.rotate?this.ctx.rotate(-rotateAngel):'';
                     this.ctx.translate(-xSide,0);
                }
                if(typeof this.defaultCofing.interference === "number"){
                    this.defaultCofing.interference>100?this.defaultCofing.interference=100:'';
                    for(let i =0;i<this.defaultCofing.interference;i++){
                        this._drawPoint();
                    }
                }
                
            }, //_drawCanvas

            _drawPoint:function(){
                var x = Math.round(Math.random()*this.defaultCofing.width);
                var y = Math.round(Math.random()*this.defaultCofing.height);
                this.ctx.beginPath();
                this.ctx.arc(x,y,1,0,Math.PI*2);
                this.ctx.strokeStyle = this._getColor();
                this.ctx.stroke();
                this.ctx.closePath();
            },
            refresh:function(){
                this.ctx.clearRect(0,0,this.defaultCofing.width,this.defaultCofing.height);  
                this.result = this._creatCode(this.defaultCofing.len,this.defaultCofing.characterSet);
               this._drawCanvas();
            },
            destory:function(){
                codeList.splice(codeList.indexOf(this.id));
                var ele = document.getElementById(this.id);
                ele.removeChild(this.canvas);
            },
            test:function(result){
              var final =  result || document.getElementById(this.defaultCofing.resultInput).value;
                if(this.defaultCofing.caseSensitive){
                    if(final == this.result){
                        return true
                    }else{
                        return false
                    }
                }else{
                    if(final.toUpperCase()==this.result.toUpperCase()){
                        return true
                    }else{
                        return false
                    }
                }
            }
        }



        //曝露全局方法
        _global = (function(){return this || (0,eval)("this")}());
        if(typeof module !== "undefined" && module.explore){
            module.explore = VerificationCode;
        }else if(typeof define === "function" && define.amd){
            define(function(){return VerificationCode});
        }else{
            !("VerificationCode" in _global) && (_global.VerificationCode = VerificationCode);
        }

    }())
