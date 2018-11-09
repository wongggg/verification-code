# verification-code
to generate a verification code in canvas



# init
var verify = new VerificationCode(tagid,config)

# example
### html
`<div id="example"></div>`
### script
`var verify = new VerificationCode('example',{})`

# config
```
{
   clickRefresh:true,//点击刷新          
   characterSet:'',//验证码参数 number->纯数字 letter->纯字母 [arr] || string->自定义字符集
   caseSensitive:false,//大小写敏感
   fontSize:'',//默认为height的60%
   width:200,
   height:50,
   backgroundColor:"#EDEDED",
   color:"", //默认->随机颜色 [color1,color2]->颜色组
   rotate:true,//字体偏转
   canvasID:"",//生成canvas的ID 空则随机生成uuid
   interference:60,//干扰物 [0-100]
   len: 6,//验证码长度
   resultInput:''//选填，输入验证码input的ID
}
```

# method
### 刷新验证码
`.resesh()`
### 验证
```
.test(result)
当初始化时已经传入resultInput，则自动对比，若没有传入，则需要传入result字符串，会跟验证码直接对比，正确返回true 错误返回 false
```
### 销毁
`.destory()`
