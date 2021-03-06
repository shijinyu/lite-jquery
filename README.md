# lite-jquery

A jQuery-like library, but pure.

<p> 该库尽量兼容jQuery的api，在主要api的行为中保持与jQuery一致。 </p>

<p>砍掉了与dom操作无关的内容： ❌ajax模块、❌缓存系统（dom事件系统不再支持传入data、`data`接口不再保留）。</p>

<p>增加了一些简单的浏览器相关操作的封装：`cookie`、`storage`。</p>

<p>增加了一些简单的工具函数：`copy`、`merge`、`extend`（行为同`jQuery.extend`）、`ys`（常见类型判断），但这些工具函数默认不会被导入。</p>

<div style="text-align:center">
<a href="https://github.com/shijinyu/lite-jquery/blob/master/LICENSE" rel="nofollow" style="display:inline;text-decoration: none;">
<img src="https://img.shields.io/github/license/shijinyu/lite-jquery.svg">
</a>
<a href="https://github.com/shijinyu/lite-jquery/network" rel="nofollow" style="display:inline;text-decoration: none;">
<img src="https://img.shields.io/github/forks/shijinyu/lite-jquery.svg">
</a>
<a href="https://github.com/shijinyu/lite-jquery/stargazers" rel="nofollow" style="display:inline;text-decoration: none;">
<img src="https://img.shields.io/github/stars/shijinyu/lite-jquery.svg">
</a>
<a href="https://github.com/shijinyu/lite-jquery/issues" rel="nofollow" style="display:inline;text-decoration: none;">
<img src="https://img.shields.io/github/issues/shijinyu/lite-jquery.svg">
</a>
</div>

----



### 说明

Pure jQuery.
更纯粹的`jQuery`库，只实现`jQuery`与dom相关的接口，与少数工具方法。总体`API`与`jQuery 3`保持一致。

##### 安装

```
npm install git://github.com/shijinyu/lite-jquery.git
```

或直接引入`./dist/lite.umd.js`

##### 使用

**script引入**

```javascript
$('selector')
```

**esm**

```javascript
import $ from 'lite-jquery';
import { extend, merge, ys } from 'lite-jquery';

$('selector');
ys.bool(true); // true

```

**commonjs**
```javascript
const $ = require('lite-jquery');
```

### 接口/实现进度

图例：

✅  已经实现且通过测试的
❎  已经实现、未测试的
❌  还未实现的
ℹ️  未计划实现的

#### Core

##### ❎ 选择器/DomReady

 - selector, [context]
 - element
 - elementArray
 - lite-jquery object
 - HTML String
 - ()
 - function

##### ✅ Length
##### ✅ each
##### ✅ toArray
##### ✅ extend
  只实现`jQuery.extend`，未实现`jQuery.fn.extend`

##### 筛选

 > ✅ 已实现jQuery类数组的去重操作。

 - 查找
   * ❌ children
   * ❌ contents
   * ❎ closest
   * ❎ find
   * ❌ next
   * ❌ nextAll
   * ❌ prev
   * ❌ prevAll
   * ❌ sibings
   * ❌ parent
   * ❌ parents
   * ℹ️ parentsUntil
   * ℹ️ nextUntil
   * ℹ️ prevUntil
 - 过滤
   * ✅ filter
   * ✅ eq
   * ✅ first
   * ✅ last
   * ❎ is
   * ❎ not
   * ❎ slice
   * ❎ has
   * ✅ map
 - 串联
   * ❌ add
   * ℹ️ addBack
   * ❌ end

##### 属性

 - ✅ attr(name|properties|key,val)
 - ✅ removeAttr(name)
 - ✅ hasAttr(name)
 - ✅ prop(name|properties)
 - ❌ removeProp(name)
 - ✅ val(value)
 - ❌ html(HTMLString)
 - ❌ text(text)
 - ✅ addClass(className)
 - ✅ removeClass(className)
 - ✅ hasClass(className)
 - ✅ toggleClass

##### CSS

 - ❌ css(name|properties|key,val)
 - ❌ offset
 - ❌ position
 - ❌ scrollTop
 - ❌ scrollLeft
 - ❌ height / innerHeight / outerHeight
 - ❌ width / innerWidth / outerWidth

##### 事件

 **移植了`jQuery`的事件系统，支持`namespace`**

 - ✅ on(eventsObject|event[, selector], fn, options{data, capture})
 - ✅ off(event[, selector], fn)
 - ✅ one
 - ❎ trigger

**事件对象**

 eventObject
   - ❌ currentTarget
   - ❌ data
   - ❌ delegateTarget
   - ❌ preventDefault
   - ❌ isDefaultPrevented
   - ❌ isPropagationStopped
   - ❌ namespace
   - ❌ pageX/pageY
   - ❌ type
   - ❌ timeStamp

##### 文档处理

 - 内部插入
    * ❌ append
    * ❌ appendTo
    * ❌ prepend
    * ❌ prependTo
 - 外部插入
    * ❌ after
    * ❌ before
    * ❌ insertAfter
    * ❌ insertBefore
 - 包裹
    * ❌ wrap
    * ❌ unwrap
    * ❌ wrapAll
 - 替换
    * ❌ replaceWith
    * ❌ replaceAll
 - 删除
    * ❌ empty
    * ❌ remove
 - 复制
    * ❌ clone

##### 效果

 - 显示隐藏
    * ❌ show / hide /toggle

 - 动画
    * ❌ animate / stop / delay
    * ❌ slide: Toggle / Up / Down
    * ❌ fade: Toggle / In / Out / To
