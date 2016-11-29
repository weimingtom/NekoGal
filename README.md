# NekoGal
original javascript Galgame Scripter 

目前的进度请见[Github](https://github.com/NHibiki/NekoGal)

Demo站：[点我喵](https://nekoyu.cc/NekoGal)

Nightly-Debug站：[点我喵呜](https://hibiki.pw/nekogal)(我会在第二版正式版发布后离开 www)

&nbsp;

### 项目简介：

我就用问答形式吧 QwQ - 

Q：为什么要写这个框架呢？

A：窝窝窝... 也不知道... 只是因为好玩吧... 最近一直在研究Interactive Media Art（多媒体交互），就想设计一个用于交流的框架，于是就自然想到Online Galgame了...

Q: 这个框架有什么用呢？

A: 目前这个框架只支持念白，图片，多选一选择，和独白跳转... 但我以后还会成长！ 我还会有 BGM，字幕动画，字幕变色，以及选项关系积分累积（用于攻略度等等...不开车！！）

Q: 这个框架兼容性怎么样呢？

A: www 这个窝还没有仔细考虑呐QwQ，嘛，至少手机电脑都能用.. 窝觉得，还是把自适应交给网站设计者吧（默认Relative，偷偷溜走）

Q: 这个框架重量如何？

A: 不需要jQuery，Button目前借助于bootstrap css，但是肯定会把它扔掉的啦！！

Q: 写剧本会不会很麻烦？

A: 不会！！剧本采用（形式，内容，关联）的形式，以JSON方式读入。（可以外链可以内链，框架自带跨域请求）

比如

```javascript
[{
    "type": "option", //形式，目前有option，text，picture 3项 分别表示此对话是 选项，独白，图片
    "content": "Hello, Master", //内容，图片是连接URL，其他的都是显示文字
    // "jump": 2 如果是独白 可以设置这个，这样就可以在播放之后跳转到相应位置的对话
    "options": {
        "你好": 2,
        "你坏": 3
    } //选项，以及点击后跳转的位置
    "color": "rgb(0,0,0)", //单句颜色
    "duration": 10, //字幕滚动速度
    "withdraw": true, //选项选择之后撤回显示
    "bgm": "1.mp3", //更换背景音乐，如果是"0"则暂停，如果是“1”则继续播放
    "bgp": "pic.png", //更换背景图片，如果是"0"则删除
    "dialog": "d.mp3" //播放对话语音（本句结束后将自动停止，若下一句的此选项设置为"1"，则在下一句不停止，以此类推）
    //...
},{
    // 第二句对话
}
//.... 第N句
]
```

Q: 那那那！如果我想用js控制播放，而不要自动播放或者单机播放呢！

A: 每个对话播放前都会触发callfront回调，结束时都会触发callback回调。所以没关系的喵 ～ 

Q: 那么，初始化的要求，以及接口呢QwQ？

A: 请看下表 ～

 - 构造：

```javascript
var ng = new NekoGal(脚本JSON或者脚本URL, 显示DOM的id[, 自定义选项]);
```

 - 自定义选项：

```javascript
config = {
    animation   :  true                            , //播放字幕滚动动画
    anispeed    :  50                              , //字幕滚动默认速度
    autoplay    :  false                           , //自动播放（是否要鼠标点击）
    repeat      :  false                           , //重复播放
    interval    :  1000                            , //句间隔时间（限自动播放）
    background  :  "rgba(0,0,0,1)"                 , //背景颜色
    color       :  "rgba(255,255,255,1)"           , //字幕颜色
    lineheight  :  10                              , //行数，超过行数会自动把第一行删去
    callfront   :  function(id, current) {}        , //前回调
    callback    :  function(id, current) {}        , //后回调
    id          :  parseInt(Math.random() * 100000)  //生成唯一ID 以便有多个NekoGal同时出现
}
```

Q: 那我怎么用javascript定位某一个Gal呢？

A: 通过以下方法：

 - window.NG_LIST 获取所有活着的NekoGal
 - window.NG_{ID} {ID}换成唯一new时候的xxx.id

其他详情可以参考样例剧本（Demo右键源代码）

### 更新日志

#### 16.11.28

基本功能和框架，Text和Dialog
函数生存
异步ajax原生支持
等待特效

#### 16.11.29

重写播放框架，使用异步
加入字幕滚动特效
加入背景图片和音乐支持
加入对话支持
加入图片支持
加入单句选项支持
加入按键支持（Enter和Space）
加入限制行数
加入撤回功能
加入系统挂钩
