
## 自定义脚本

自定义脚本可以在发送和接收数据时进行处理

脚本支持 JavaScript 语法,通过`postMessage`和`onmessage`进行通讯

如下是一个简单的脚本示例

```javascript
addEventListener('message', function ({data}) {
    if(data.type=='uart_receive')
    {
        postMessage({type:'log',data:'消息长度:'+data.data.length});
        //原文答复
        postMessage({type:'uart_send',data:data.data});
    }
})
setInterval(function(){
    //定时发送
    postMessage({type:'uart_send_txt',data:'hello world'});
},1000);
```

`onmessage`接收到的数据格式如下

```js
{
    "type":"uart_receive", //消息类型 String,目前仅支持 uart_receive
    "data":[0,1] //消息内容 Uint8Array
}
```

`postMessage`发送的数据格式如下

```js
{
    "type":"uart_send", 
    "data":[0,1]
}
```

| TYPE 类型     | DATA 数据格式 | 说明               |
| ------------- | ------------- | ------------------ |
| uart_send     | Uint8Array    | 发送字节数据       |
| uart_send_txt | String        | 发送文本数据       |
| uart_send_hex | String        | 发送十六进制字符串 |
| log           | String        | 打印日志           |
