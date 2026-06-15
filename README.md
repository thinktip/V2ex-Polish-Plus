# V2ex-Polish-Plus
Vibe 了一版 V2ex Polish Tampermonkey 增强版，仅做了版式优化，去除了一些自己感觉用不上的功能，把脚本分开了，太大。
直接在油猴里添加两个user.js文件就可以了。

## Safari 深色首屏闪白

Safari + Tampermonkey 下，如果 V2EX 首包仍返回浅色 HTML，用户脚本无法抢到浏览器创建新文档时的最早一帧。脚本会尽量同步 V2EX 原生夜间设置，但首页等页面可能仍由站点输出浅色首包。

如果晚上仍有白色闪屏，可以在 Safari 设置 > 高级 > 样式表 中选择 `safari-v2ex-dark-prepaint.css`。这不是插件，不需要签名，只是在系统深色模式下提前把 V2EX 的页面底色压成深色。

感谢原作者Coolpace，感谢ChatGPT，感谢CCTV
V2EX Polish - 体验更现代化的 V2EX
https://github.com/coolpace/V2EX_Polish
