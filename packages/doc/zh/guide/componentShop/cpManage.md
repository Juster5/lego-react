<!--
 * @Date: 2021-01-17 14:24:40
 * @LastEditors: xuxiaoxi
 * @LastEditTime: 2021-01-17 19:42:53
-->
# 组件审核

组件审批主要由网站管理人员来操作，当用户组件提交成功之后，客户端会通过消息信令通知管理员，管理员收到消息后会审核组件。那么整个过程也很简单，我们可以使用 websocket 来实现消息双向通信，完整流程如下：

<img src="http://cdn.dooring.cn/dr/WX20210720-133112%402x.png" />

通过以上的实现方式客户端和服务端就可以随时进行通信了。接下来我们看看审批的效果：

<img src="http://cdn.dooring.cn/dr/WX20210720-133329%402x.png" />


