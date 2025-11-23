// ==UserScript==
// @name         V2eX - Polish Style
// @version      3.1
// @description  V2ex Polish Style
// @match        https://*.v2ex.com/*
// @match        https://v2ex.com/*
// @icon         https://v2ex.com/static/apple-touch-icon-180.png
// @run-at       document-start
// @grant        GM_addStyle
// ==/UserScript==

// 尽早执行：防闪烁 + 自动同步原生主题
(function () {
  const docEl = document.documentElement;
  const STORAGE_KEY = "user_preferred_theme_mode";

  // 1. 移动端检测（保持原样）
  const isMobile = /Mobi|Android|iPhone|iPad|iPod|Mobile|Phone/i.test(navigator.userAgent) || window.innerWidth <= 768;
  if (isMobile) {
    docEl.classList.add("v2p-mobile");
  }

  // 2. 读取用户上次的设置
  let currentMode = localStorage.getItem(STORAGE_KEY);

  // 3. 【防闪烁核心】在页面渲染前，立即应用上次已知的深色设置
  // 这样如果你上次是深色，这次一打开就是深色，不会闪白
  if (currentMode === 'dark') {
    docEl.classList.add("v2p-theme-dark-default");
  }

  // 4. 【自动同步原生】建立一个观察者，当 V2EX 原生 DOM 加载出来后进行核对
  // 如果你点击了 V2EX 原生的“切换主题”按钮，页面会重载，V2EX 会在 #Wrapper 加一个 Night 类
  // 我们需要捕捉这个变化并更新脚本的记忆
  const observer = new MutationObserver((mutations, obs) => {
    const wrapper = document.getElementById('Wrapper');
    if (wrapper) {
      // V2EX 原生深色模式的标志是 #Wrapper 拥有 .Night 类
      const isNativeDark = wrapper.classList.contains('Night');
      // 记录一份给后面的主题核心逻辑用
      window.__V2P_NATIVE_NIGHT__ = isNativeDark ? 1 : 0;

      if (isNativeDark) {
        // 如果原生是深色，但脚本记忆不是深色 -> 修正脚本为深色
        if (currentMode !== 'dark') {
          docEl.classList.add("v2p-theme-dark-default");
          localStorage.setItem(STORAGE_KEY, 'dark');
        }
      } else {
        // 如果原生是浅色，但脚本记忆是深色 -> 修正脚本为浅色
        // (注意：这里假设非 Night 就是浅色，如果你用晨光/水色等特殊主题，可保留不改)
        if (currentMode === 'dark') {
          docEl.classList.remove("v2p-theme-dark-default");
          localStorage.setItem(STORAGE_KEY, 'light'); // 或者 'auto'
        }
      }
      // 检测完成，断开观察，节省性能
      obs.disconnect();
    }
  });

  // 开始监听文档变化，等待 #Wrapper 出现
  observer.observe(document, { childList: true, subtree: true });

})();
(function () {
  "use strict";
  var style = `
:root {
    --zidx-serach: 100;
    --zidx-tabs: 10;
    --zidx-tools-card: 10;
    --zidx-reply-box: 99;
    --zidx-modal-header: 50;
    --zidx-modal-mask: 888;
    --zidx-toast: 999;
    --zidx-tip: 99;
    --zidx-popup: 99;
    --zidx-expand-mask: 10;
    --zidx-expand-btn: 20;
    --v2p-underline-offset: 0.5ex;
    --v2p-layout-column-gap: 25px;
    --v2p-layout-row-gap: 20px;
    --v2p-nav-height: 55px;
    --v2p-tp-item-x: 12px;
    --v2p-tp-item-y: 8px;
    --v2p-tp-tabs-pd: 10px;
    --v2p-tp-nested-pd: 10px 5px 2px 10px;
    --v2p-tp-preview-pd: 20px;
    --v2p-emoji-size: 21px;
    --v2p-box-radius: 10px;
}
/* === 搜索框防闪烁核心样式 === */
/* 只有当 html 标签确切拥有 v2p-theme-dark-default 类时，搜索框才变黑 */
html.v2p-theme-dark-default body #search-container {
    background-color: #2d333b !important;
    border-color: #444c56 !important;
    transition: background-color 0.1s ease; /* 极短的过渡，掩盖微小渲染延迟 */
}

html.v2p-theme-dark-default body #search-container #search-result {
    background-color: #22272e !important;
    border-color: #444c56 !important;
}
:root body {
    --v2p-color-main-50: #f7f9fb;
    --v2p-color-main-100: #e6e6e6;
    --v2p-color-main-200: #ececec;
    --v2p-color-main-300: #cbd5e1;
    --v2p-color-main-350: #94a3b8cc;
    --v2p-color-main-400: #94a3b8;
    --v2p-color-main-500: #64748b;
    --v2p-color-main-600: #475569;
    --v2p-color-main-700: #334155;
    --v2p-color-main-800: #1e293b;
    --v2p-color-accent-50: #ecfdf5;
    --v2p-color-accent-100: #d1fae5;
    --v2p-color-accent-200: #a7f3d0;
    --v2p-color-accent-300: #6ee7b7;
    --v2p-color-accent-400: #34d399;
    --v2p-color-accent-500: #10b981;
    --v2p-color-accent-600: #059669;
    --v2p-color-orange-50: #fff7ed;
    --v2p-color-orange-100: #ffedd5;
    --v2p-color-orange-400: #fb923c;
    --v2p-color-background: #f2f3f5;
    --v2p-color-foreground: var(--v2p-color-main-800);
    --v2p-color-selection-foreground: var(--v2p-color-main-100);
    --v2p-color-selection-background: var(--v2p-color-main-700);
    --v2p-color-selection-background-img: var(--v2p-color-main-500);
    --v2p-color-font-secondary: var(--v2p-color-main-600);
    --v2p-color-font-tertiary: var(--v2p-color-main-500);
    --v2p-color-font-quaternary: var(--v2p-color-main-400);
    --v2p-color-button-background: var(--v2p-color-main-100);
    --v2p-color-button-foreground: var(--v2p-color-main-500);
    --v2p-color-button-background-hover: var(--v2p-color-main-200);
    --v2p-color-button-foreground-hover: var(--v2p-color-main-600);
    --v2p-color-bg-content: #fff;
    --v2p-color-bg-footer: var(--v2p-color-bg-content);
    --v2p-color-bg-hover-btn: rgb(226 232 240 / 70%);
    --v2p-color-bg-subtle: #f7f7f7;
    --v2p-color-bg-input: var(--v2p-color-main-50);
    --v2p-color-bg-search: var(--v2p-color-main-100);
    --v2p-color-bg-search-active: var(--v2p-color-main-200);
    --v2p-color-bg-widget: rgb(255 255 255 / 70%);
    --v2p-color-bg-reply: var(--v2p-color-main-100);
    --v2p-color-bg-tooltip: var(--v2p-color-bg-content);
    --v2p-color-bg-tabs: var(--v2p-color-main-100);
    --v2p-color-bg-tpr: var(--v2p-color-main-100);
    --v2p-color-bg-avatar: var(--v2p-color-main-300);
    --v2p-color-bg-block: var(--v2p-color-main-100);
    --v2p-color-bg-block-darker: var(--v2p-color-main-300);
    --v2p-color-bg-link: var(--v2p-color-main-100);
    --v2p-color-bg-link-hover: var(--v2p-color-main-200);
    --v2p-color-tabs: var(--v2p-color-foreground);
    --v2p-color-heart: #ef4444;
    --v2p-color-heart-fill: #fee2e2;
    --v2p-color-mask: rgb(0 0 0 / 25%);
    --v2p-color-divider: var(--v2p-color-main-200);
    --v2p-color-border: var(--v2p-color-main-200);
    --v2p-color-input-border: var(--v2p-color-main-300);
    --v2p-color-border-darker: var(--v2p-color-main-300);
    --v2p-color-link-visited: var(--v2p-color-main-400);
    --v2p-color-error: #ef4444;
    --v2p-color-bg-error: #fee2e2;
    --v2p-color-cell-num: var(--v2p-color-main-350);
    --v2p-box-shadow: 0 3px 5px 0 rgb(0 0 0 / 4%);
    --v2p-widget-shadow: 0 9px 24px -3px rgb(0 0 0 / 6%),
        0 4px 8px -1px rgb(0 0 0 /12%);
    --v2p-toast-shadow: 0 6px 16px 0 rgb(0 0 0 / 8%),
        0 3px 6px -4px rgb(0 0 0 / 12%), 0 9px 28px 8px rgb(0 0 0 / 5%);
    --color-fade: var(--v2p-color-font-secondary);
    --color-gray: var(--v2p-color-font-secondary);
    --link-color: var(--v2p-color-foreground);
    --link-darker-color: var(--v2p-color-main-600);
    --link-hover-color: var(--v2p-color-foreground);
    --link-caution-color: var(--v2p-color-orange-400);
    --box-border-color: var(--v2p-color-border);
    --box-foreground-color: var(--v2p-color-foreground);
    --box-background-color: var(--v2p-color-bg-content);
    --box-background-alt-color: var(--v2p-color-main-100);
    --box-background-hover-color: var(--v2p-color-main-200);
    --box-border-focus-color: var(--v2p-color-main-200);
    --box-border-radius: var(--v2p-box-radius);
    --button-background-color: var(--v2p-color-button-background);
    --button-foreground-color: var(--v2p-color-button-foreground);
    --button-hover-color: var(--v2p-color-button-background-hover);
    --button-background-hover-color: var(--v2p-color-button-background-hover);
    --button-foreground-hover-color: var(--v2p-color-button-foreground-hover);
    --button-border-color: var(--v2p-color-main-300);
    --button-border-hover-color: var(--v2p-color-main-400);
    
    font-family: system-ui, sans-serif;
    color: var(--v2p-color-foreground);
    background-color: var(--v2p-color-background);
}
:root body.v2p-theme-light-default,
:root body .v2p-theme-light-default {
    --v2p-color-main-50: #f7f9fb;
    --v2p-color-main-100: #f2f2f2;
    --v2p-color-main-200: #ececec;
    --v2p-color-main-300: #cbd5e1;
    --v2p-color-main-350: #94a3b8cc;
    --v2p-color-main-400: #94a3b8;
    --v2p-color-main-500: #64748b;
    --v2p-color-main-600: #475569;
    --v2p-color-main-700: #334155;
    --v2p-color-main-800: #1e293b;
    --v2p-color-accent-50: #ecfdf5;
    --v2p-color-accent-100: #d1fae5;
    --v2p-color-accent-200: #a7f3d0;
    --v2p-color-accent-300: #6ee7b7;
    --v2p-color-accent-400: #34d399;
    --v2p-color-accent-500: #10b981;
    --v2p-color-accent-600: #059669;
    --v2p-color-orange-50: #fff7ed;
    --v2p-color-orange-100: #ffedd5;
    --v2p-color-orange-400: #fb923c;
    --v2p-color-background: #f2f3f5;
    --v2p-color-foreground: var(--v2p-color-main-700);
    --v2p-color-selection-foreground: var(--v2p-color-main-100);
    --v2p-color-selection-background: var(--v2p-color-main-700);
    --v2p-color-selection-background-img: var(--v2p-color-main-500);
    --v2p-color-font-secondary: var(--v2p-color-main-600);
    --v2p-color-font-tertiary: var(--v2p-color-main-500);
    --v2p-color-font-quaternary: var(--v2p-color-main-400);
    --v2p-color-button-background: var(--v2p-color-main-100);
    --v2p-color-button-foreground: var(--v2p-color-main-500);
    --v2p-color-button-background-hover: var(--v2p-color-main-200);
    --v2p-color-button-foreground-hover: var(--v2p-color-main-600);
    --v2p-color-bg-content: #fff;
    --v2p-color-bg-footer: var(--v2p-color-bg-content);
    --v2p-color-bg-hover-btn: rgb(226 232 240 / 70%);
    --v2p-color-bg-subtle: #f7f7f7;
    --v2p-color-bg-input: var(--v2p-color-main-50);
    --v2p-color-bg-search: var(--v2p-color-main-50);
    --v2p-color-bg-search-active: var(--v2p-color-main-200);
    --v2p-color-bg-widget: rgb(255 255 255 / 70%);
    --v2p-color-bg-reply: var(--v2p-color-main-50);
    --v2p-color-bg-tooltip: var(--v2p-color-bg-content);
    --v2p-color-bg-tabs: var(--v2p-color-main-100);
    --v2p-color-bg-tpr: var(--v2p-color-main-100);
    --v2p-color-bg-avatar: var(--v2p-color-main-300);
    --v2p-color-bg-block: var(--v2p-color-main-100);
    --v2p-color-bg-block-darker: var(--v2p-color-main-300);
    --v2p-color-bg-link: var(--v2p-color-main-100);
    --v2p-color-bg-link-hover: var(--v2p-color-main-200);
    --v2p-color-tabs: var(--v2p-color-foreground);
    --v2p-color-heart: #ef4444;
    --v2p-color-heart-fill: #fee2e2;
    --v2p-color-mask: rgb(0 0 0 / 25%);
    --v2p-color-divider: var(--v2p-color-main-200);
    --v2p-color-border: var(--v2p-color-main-200);
    --v2p-color-input-border: var(--v2p-color-main-300);
    --v2p-color-border-darker: var(--v2p-color-main-300);
    --v2p-color-link-visited: var(--v2p-color-main-400);
    --v2p-color-error: #ef4444;
    --v2p-color-bg-error: #fee2e2;
    --v2p-color-cell-num: var(--v2p-color-main-350);
    --v2p-box-shadow: 0 3px 5px 0 rgb(0 0 0 / 4%);
    --v2p-widget-shadow: 0 9px 24px -3px rgb(0 0 0 / 6%),
        0 4px 8px -1px rgb(0 0 0 /12%);
    --v2p-toast-shadow: 0 6px 16px 0 rgb(0 0 0 / 8%),
        0 3px 6px -4px rgb(0 0 0 / 12%), 0 9px 28px 8px rgb(0 0 0 / 5%);
    --color-fade: var(--v2p-color-font-secondary);
    --color-gray: var(--v2p-color-font-secondary);
    --link-color: var(--v2p-color-foreground);
    --link-darker-color: var(--v2p-color-main-600);
    --link-visited-color:var(--v2p-color-foreground);
    --link-hover-color: var(--v2p-color-foreground);
    --link-caution-color: var(--v2p-color-orange-400);
    --box-border-color: var(--v2p-color-border);
    --box-foreground-color: var(--v2p-color-foreground);
    --box-background-color: var(--v2p-color-bg-content);
    --box-background-alt-color: var(--v2p-color-main-100);
    --box-background-hover-color: var(--v2p-color-main-200);
    --box-border-focus-color: var(--v2p-color-main-200);
    --box-border-radius: var(--v2p-box-radius);
    --button-background-color: var(--v2p-color-button-background);
    --button-foreground-color: var(--v2p-color-button-foreground);
    --button-hover-color: var(--v2p-color-button-background-hover);
    --button-background-hover-color: var(--v2p-color-button-background-hover);
    --button-foreground-hover-color: var(--v2p-color-button-foreground-hover);
    --button-border-color: var(--v2p-color-main-300);
    --button-border-hover-color: var(--v2p-color-main-400);
}
:root body #Logo {
    background-image: url("https://raw.githubusercontent.com/thinktip/V2ex-Polish-Plus/refs/heads/main/v2ex%402x.svg");
    width:130px !important;
    background-size: 130px 30px !important;
}
:root body::selection {
    color: var(--v2p-color-selection-foreground);
    background-color: var(--v2p-color-selection-background);
}
:root body img::selection {
    background-color: var(--v2p-color-selection-background-img);
}
:root {
    color-scheme: light;
}
:root html,
:root body {
    min-height: 100vh;
}
body {
    scrollbar-gutter: stable;
    overflow: overlay;
    visibility: hidden;
}
body.v2p-theme-light-default {
    visibility: visible;
}
body h1 {
    font-weight: bold;
}
body a {
    cursor: default;
    text-decoration: none;
}
body a[href] {
    cursor: pointer;
}
body a:hover {
    text-decoration: underline 1px;
    text-underline-offset: var(--v2p-underline-offset);
}
body pre {
    max-width: calc(830px - 2 * var(--v2p-layout-column-gap) - 24px);
}
body #Top {
    height: var(--v2p-nav-height);
    background-color: var(--v2p-color-bg-content);
    border: none;
}
body #Bottom {
    color: var(--v2p-color-font-secondary);
    background-color: var(--v2p-color-bg-footer);
    border: none;
}
body #Bottom .content {
    flex-direction: column;
}
body #Wrapper {
    background-color: inherit;
    background-image: none;
}
body #Wrapper.Night {
    background-color: inherit;
    background-image: none;
}
body #Wrapper .content {

    gap: var(--v2p-layout-column-gap);
}
/* Logo样式 */
:root body #Logo,
#LogoMobile {
background-image: url("https://raw.githubusercontent.com/thinktip/V2ex-Polish-Plus/refs/heads/main/v2ex%402x.svg") !important;
width: 130px !important;
background-size: 130px 30px !important;
}

#LogoMobile {
background-image: url("https://raw.githubusercontent.com/thinktip/V2ex-Polish-Plus/refs/heads/main/v2ex%402x.svg") !important;
}
/* 深色模式下反转 Logo 颜色 */
html.Night #Logo {
filter: invert(1) brightness(0.9) contrast(0.9);
}

/* 布局和间距 */
body #Top,
body #Bottom {
background-color: var(--v2p-color-background) !important;
margin-top: 15px !important;
}

#Main #SecondaryTabs {
padding: 5px 20px;
background-color: var(--v2p-color-bg-tabs);
border-radius: 99px;
box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.05);
}

.sep20 {
height: 10px !important;
}

.message, .section {
margin-top: 10px;
}

.box {
padding: 10px;
border-radius: 18px !important;
}

#reply-box {
margin-top: 10px !important;
margin-bottom: 10px !important;
}

#no-comments-yet {
margin-bottom: 10px !important;
}

#reply_content {
padding: 10px;
}

body form textarea#topic_title {
margin: 10px 0;
}

/* 字体设置 - 全局 */
body,
.mll,
.mle,
#search,
.new-title-input,
#Wrapper,
h1,
.item_title,
.topic_content,
.reply_content {
font-family:ui-rounded, 'SF Pro Rounded', ui-system, -apple-system, sans-serif !important;
}

/* 标题和内容样式 */
.item_title a {
font-weight: normal !important;
}

.item_title,
.item_hot_topic_title,
.payload {
line-height: 1.6;
}

/* 头像圆角 */
img.avatar,
.avatar {
border-radius: 50% !important;
width:40px !important;
}

/* 节点和标签样式 */
.item_node {
border-color: var(--v2p-color-main-300);
}

#Main .tab_current {
background: none;
border-bottom: 2px solid var(--box-foreground-color);
border-radius: 0;
color: var(--box-content-color);
}

#Main #SecondaryTabs {
border-radius: 0 0 10px 10px;
}

/* 内容宽度限制 */
.content {
max-width: 1200px !important;
}
#Top>.content {
max-width: 1110px !important;
}

/* 成员活动条 */
.member-activity-bar {
width: auto;
}

.ml {
font-family: ui-monospace, 'SF Mono' !important;
}
.mll {
border-radius: 10px;
}

body #search-container {
border-radius:18px !important;
}
#Navcol .nav_item:hover {
    background-color: var(--box-background-hover-color);
}
#Navcol .nav_item:hover:active {
    box-shadow: none;
}
#Navcol .nav_item_current:hover {
    color: var(--box-foreground-color);
    background-color: var(--v2p-color-bg-content);
}
#Navcol .nav_item_current:active {
    box-shadow: none;
}
#Rightcol #page-outline-title {
    background-color: var(--v2p-color-button-background-hover);
}
#Rightcol .page-outline-item:hover {
    background-color: var(--box-background-hover-color);
}
body #Wrapper:has(#Singleton) {
    padding: 20px 0 0;
}
.subtle {
    background-color:var(--v2p-color-bg-subtle);
    border-radius:10px;
    border:none;
    margin-top:10px;
    padding:10px;

}
#topic-tip-box {
    box-shadow: none !important;
    display:none;
}
body #Wrapper:has(#Singleton) #Singleton {
    overflow: hidden;
    box-shadow: var(--v2p-box-shadow);
}
body #Leftbar {
    float: none;
    order: 1;
}
body #Main {
    flex: 1;
    order: 2;
    max-width: 85vw;
    margin-right: 290px;
}
body #Rightbar {
    order: 3;
    margin-right:0 !important;
    margin-left:20px;
}
body #search-container {
    height: 30px;
    margin: 0 30px;
    background-color: var(--v2p-color-bg-search);
    border: none;
    border-radius: 6px;
    transition: background-color 0.2s ease; /* 新增这行：让颜色变化更柔和 */
}
body #search-container::before {
    top: 0;
    left: 4px;
    opacity: 0.6;
    background-size: 14px 14px;
    filter: none;
}
body #search-container.active {
    background-color: var(--v2p-color-bg-search-active);
}
body #search-container #search-result {
    z-index: var(--zidx-serach);
    top: 42px;
    font-size: 14px;
    color: var(--v2p-color-font-secondary);
    background: var(--v2p-color-bg-widget);
    backdrop-filter: blur(16px);
    border: 1px solid var(--box-border-color);
    box-shadow: var(--v2p-widget-shadow);
}
body #search-container #search-result .fade {
    color: var(--v2p-color-font-secondary);
}
body #search-container #search-result .search-item {
    font-weight: bold;
    color: var(--v2p-color-foreground);
    border-radius: 5px;
}
body #search-container #search-result .search-item.active {
    color: var(--v2p-color-foreground);
}
body #search-container #search-result .search-item.active.v2p-no-active {
    background-color: rgba(0, 0, 0, 0);
}
body .box {
    color: var(--box-foreground-color);
    background-color: var(--v2p-color-bg-content);
    border: none;
    border-radius: var(--box-border-radius);
    box-shadow: var(--v2p-box-shadow);
}
body .box .header > h1 {
    font-size: 18px;
    font-weight: bold;
}
body .box .header .gray {
    color: var(--color-gray);
}
body .button {
    --button-hover-shadow: 0 1.8px 0 var(--button-border-color),
        0 1.8px 0 var(--button-background-color);
}
body .button.normal,
body .button.super {
    cursor: pointer;
    user-select: none;
    position: relative;
    display: inline-flex;
    gap: 5px;
    align-items: center;
    height: 28px;
    padding: 0 12px;
    font-family: inherit;
    font-size: 14px;
    font-weight: 500;
    line-height: 28px;
    color: var(--v2p-color-button-foreground);
    text-shadow: none;
    white-space: nowrap;
    background: var(--v2p-color-button-background);
    border: none;
    border-radius: 6px;
    outline: none;
    box-shadow:
        0 1.8px 0 var(--box-background-hover-color),
        0 1.8px 0 var(--button-background-color);
    transition:
        color 0.25s,
        background-color 0.25s,
        box-shadow 0.25s;
    vertical-align: middle;
    margin-right: 10px;
}
body .button.normal:is(:hover:enabled, :active:enabled),
body .button.super:is(:hover:enabled, :active:enabled) {
    font-weight: 500;
    color: var(--v2p-color-button-foreground-hover);
    text-shadow: none;
    background: var(--v2p-color-button-background-hover);
    border: none;
    box-shadow: var(--button-hover-shadow);
}
body .button.normal:is(.hover_now, .disable_now),
body .button.super:is(.hover_now, .disable_now) {
    color: var(--v2p-color-button-foreground) !important;
    text-shadow: none !important;
    background: var(--button-background-color) !important;
    border: none !important;
    box-shadow:
        0 1.8px 0 var(--box-background-hover-color) !important,
        0 1.8px 0 var(--button-background-color) !important;
}
body .button.normal:is(.disable_now, :disabled),
body .button.super:is(.disable_now, :disabled) {
    pointer-events: none;
    cursor: default;
    font-weight: 500;
    color: var(--v2p-color-button-foreground);
    text-shadow: none;
    opacity: 0.8;
    background: var(--button-background-color);
    box-shadow:
        0 1.8px 0 var(--box-background-hover-color),
        0 1.8px 0 var(--button-background-color);
}
body .button.normal kbd,
body .button.super kbd {
    position: relative;
    right: -4px;
    padding: 0 3px;
    font-family: inherit;
    font-size: 90%;
    line-height: initial;
    border: 1px solid var(--button-border-color);
    border-radius: 4px;
}
.button.normal {
    border-radius:90px !important;
    padding-left:20px !important;
    padding-right:20px !important;
}
.ps_container td.button {
    border-top-right-radius: 0px !important;
    border-bottom-right-radius: 0px !important;
}
.ps_container td.normal_page_right {
    border-top-right-radius: 90px !important;
    border-bottom-right-radius: 90px !important;
}



body .button.special {
    --button-hover-shadow: 0 1.8px 0 var(--v2p-color-accent-200),
        0 1.8px 0 var(--v2p-color-accent-100);
    color: var(--v2p-color-accent-500);
    border-radius:99px;
    max-width:120px;
}
body .button.special:hover,
body .button.special:hover:enabled {
    color: var(--v2p-color-accent-600);
    background: var(--v2p-color-accent-100);
    border: none;
    box-shadow: var(--button-hover-shadow);
}
body .button a {
    color: inherit;
    text-decoration: none;
}
body .badge {
    user-select: none;
    padding: 1px 3px;
    font-weight: bold;
    border: 1px solid var(--v2p-color-accent-400);
    border-radius:99px !important;
    line-height:13px;
    margin-right:5px;
}
body .badge:first-child {
    border: 1px solid var(--v2p-color-accent-400);
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
}
body .badge:last-child {
    border: 1px solid var(--v2p-color-accent-400);
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
}
body .badge.op {
    color: var(--v2p-color-accent-400);
    background-color: var(--v2p-color-accent-50);
}
body .badge.mod {
    color: var(--v2p-color-bg-content);
    background-color: var(--v2p-color-accent-400);
}
body .badge.you {
    color: var(--v2p-color-orange-400);
    background-color: var(--v2p-color-orange-50);
    border: 1px solid var(--v2p-color-orange-400);
}
body .badge.mini {
    height: 1.2em;
    font-size: 12px;
    font-weight: normal;
    line-height: 1;
}
body a.node:is(:active, :link, :visited) {
    padding: 2px 6px;
    font-size: 9px;
    color: var(--v2p-color-font-secondary);
    background-color: var(--v2p-color-bg-block);
    border-radius: 99px;
}
body a.node:is(:active, :link, :visited):hover {
    color: var(--v2p-color-font-tertiary);
    background-color: var(--v2p-color-button-background-hover);
}
body .outdated {
    font-size: 12px;
    border-color: var(--v2p-color-border);
    border-bottom: none;
}
body:is(.page_normal, .page_current):is(:link, :visited) {
    user-select: none;
    padding: 6px 9px;
    font-size: 14px;
    border: none;
    border-radius: var(--box-border-radius);
}
body .page_normal:is(:link, :visited) {
    font-weight: 500;
    background-color: var(--v2p-color-bg-content);
    box-shadow: 0 2px 2px var(--box-background-hover-color);
    transition: transform 0.25s;
}
body .page_normal:is(:link, :visited):hover {
    transform: scale(1.1) translateY(-2px);
}
body .page_current:is(:link, :visited) {
    pointer-events: none;
    font-weight: bold;
    background-color: var(--box-background-hover-color);
    box-shadow: none;
}
body .page_input {
    display: none;
}
body .dock_area {
    margin: 12px 0;
    background: var(--v2p-color-bg-block);
    border-radius:10px;
}
body .member-activity-bar {
    background-color: var(--v2p-color-divider);
}
body .member-activity-bar .member-activity-start {
    background-color: var(--v2p-color-accent-200);
}
body .member-activity-bar .member-activity-fourth {
    background-color: var(--v2p-color-accent-400);
}
body .member-activity-bar .member-activity-half {
    background-color: var(--v2p-color-accent-500);
}
body .member-activity-bar .member-activity-almost {
    background-color: var(--v2p-color-accent-600);
}
body .member-activity-bar .member-activity-done {
    background-color: var(--v2p-color-orange-400);
}
body .online {
    user-select: none;
    padding: 6px 8px;
    font-size: 13px;
    color: var(--v2p-color-bg-content);
    background: var(--v2p-color-accent-400);
    border-radius: 5px;
}
body #topic_supplement {
    resize: none;
    overflow: hidden;
    height: unset;
    min-height: 550px !important;
    max-height: 800px !important;
    font-size: 15px;
    color: currentColor;
    background-color: var(--v2p-color-bg-input);
    border: 1px solid var(--button-border-color);
    border-radius: 8px;
    transition: opacity 0.25s;
    overflow-y: auto;
}
body #topic_supplement::placeholder {
    font-size: 15px;
    color: var(--v2p-color-font-tertiary);
}
body #topic_supplement:is(:focus, :focus-within) {
    background-color: rgba(0, 0, 0, 0);
    outline: none;
    box-shadow: 0 0 0 1px var(--button-border-color);
}
body .item_hot_topic_title {
    --offset: 2.4px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-height: 1.4;
    position: relative;
    padding: var(--offset) 0;
    text-shadow: none;
}
body .item_hot_topic_title > a:hover {
    text-underline-offset: var(--offset);
}
body form textarea#topic_title {
    resize: none;
    overflow: hidden;
    height: unset;
    min-height: 75px !important;
    max-height: 800px !important;
    font-size: 15px;
    color: currentColor;
    background-color: var(--v2p-color-bg-input);
    border: 1px solid var(--button-border-color);
    border-radius: 8px;
    transition: opacity 0.25s;
}
body form textarea#topic_title::placeholder {
    font-size: 15px;
    color: var(--v2p-color-font-tertiary);
}
body form textarea#topic_title:is(:focus, :focus-within) {
    background-color: rgba(0, 0, 0, 0);
    outline: none;
    box-shadow: 0 0 0 1px var(--button-border-color);
}
body form #topic_title {
    resize: none;
    overflow: hidden;
    height: unset;
    min-height: 30px !important;
    max-height: 800px !important;
    font-size: 15px;
    color: currentColor;
    background-color: var(--v2p-color-bg-input);
    border: 1px solid var(--button-border-color);
    border-radius: 8px;
    transition: opacity 0.25s;
}
body form #topic_title::placeholder {
    font-size: 15px;
    color: var(--v2p-color-font-tertiary);
}
body form #topic_title:is(:focus, :focus-within) {
    background-color: rgba(0, 0, 0, 0);
    outline: none;
    box-shadow: 0 0 0 1px var(--button-border-color);
}
body form #topic_content {
    resize: none;
    overflow: hidden;
    height: unset;
    min-height: 120px !important;
    max-height: 800px !important;
    font-size: 15px;
    color: currentColor;
    background-color: var(--v2p-color-bg-input);
    border: 1px solid var(--button-border-color);
    border-radius: 8px;
    transition: opacity 0.25s;
}
body form #topic_content::placeholder {
    font-size: 15px;
    color: var(--v2p-color-font-tertiary);
}
body form #topic_content:is(:focus, :focus-within) {
    background-color: rgba(0, 0, 0, 0);
    outline: none;
    box-shadow: 0 0 0 1px var(--button-border-color);
}
body form[action^="/notes"] .cell {
    background-color: rgba(0, 0, 0, 0) !important;
}
body #syntax-selector .radio-group {
    padding: 3px;
    border-radius:18px;
    background-color: var(--v2p-color-background);
}
body #syntax-selector .radio-group > input[type="radio"]:checked + label {
    background-color: #fff;
    border-radius:18px;
}
body #syntax-selector .radio-group > input[type="radio"] + label {
    cursor: pointer;
    font-size: 13px;
}
body #syntax-selector label {
    color: var(--v2p-color-foreground);
}
body .snow {
    color: var(--v2p-color-font-quaternary);
}
body .orange-dot {
    background: var(--v2p-color-orange-400);
}
body .alt {
    background-color: var(--v2p-color-bg-input);
    border: 1px solid var(--button-border-color);
}
body a.btn_hero {
    border-color: var(--v2p-color-foreground);
}
body a.btn_hero:hover {
    background-color: var(--v2p-color-foreground);
}
a.op {
    border-radius:20px !important;
    padding:2px 6px !important;
    font-size:12px;
}
a.tab_current, a.tab {
    border-radius:20px !important;
    }
a.tab:active, a.tab:link, a.tab:visited {
    color:var(--v2p-color-foreground);
}
#topic_thank {
    line-height:1;
    }
body .cell_ops {
    background-color: rgba(0, 0, 0, 0);
}
a.dark:active, a.dark:link, a.dark:visited {
    color: inherit !important;;
    text-decoration: none;
}
body:is(
        .topic_content,
        .reply_content,
        .v2p-topic-preview-content,
        .v2p-topic-preview-addons,
        .v2p-reply-preview,
        .markdown_body
    )
    a[href*="v2ex.com/t"],
body:is(
        .topic_content,
        .reply_content,
        .v2p-topic-preview-content,
        .v2p-topic-preview-addons,
        .v2p-reply-preview,
        .markdown_body
    )
    a[href*="v2ex.com/t"][href^="http"],
body:is(
        .topic_content,
        .reply_content,
        .v2p-topic-preview-content,
        .v2p-topic-preview-addons,
        .v2p-reply-preview,
        .markdown_body
    )
    a[href^="/"] {
    text-decoration: underline 1.5px;
    text-underline-offset: 0.46ex;
    color: var(--v2p-color-accent-500);
    background-color: var(--v2p-color-accent-50);
}
body:is(
        .topic_content,
        .reply_content,
        .v2p-topic-preview-content,
        .v2p-topic-preview-addons,
        .v2p-reply-preview,
        .markdown_body
    )
    a[href*="v2ex.com/t"]:hover,
body:is(
        .topic_content,
        .reply_content,
        .v2p-topic-preview-content,
        .v2p-topic-preview-addons,
        .v2p-reply-preview,
        .markdown_body
    )
    a[href*="v2ex.com/t"][href^="http"]:hover,
body:is(
        .topic_content,
        .reply_content,
        .v2p-topic-preview-content,
        .v2p-topic-preview-addons,
        .v2p-reply-preview,
        .markdown_body
    )
    a[href^="/"]:hover {
    color: var(--v2p-color-accent-500);
    background-color: var(--v2p-color-accent-50);
}
body:is(
        .topic_content,
        .reply_content,
        .v2p-topic-preview-content,
        .v2p-topic-preview-addons,
        .v2p-reply-preview,
        .markdown_body
    )
    a[href^="http"],
body:is(
        .topic_content,
        .reply_content,
        .v2p-topic-preview-content,
        .v2p-topic-preview-addons,
        .v2p-reply-preview,
        .markdown_body
    )
    a[href*="/email-protection"],
body:is(
        .topic_content,
        .reply_content,
        .v2p-topic-preview-content,
        .v2p-topic-preview-addons,
        .v2p-reply-preview,
        .markdown_body
    )
    a[href^="/member/"] {
    text-decoration: underline 1.5px;
    text-underline-offset: 0.46ex;
    color: currentColor;
    background-color: var(--v2p-color-bg-link);
}
body:is(
        .topic_content,
        .reply_content,
        .v2p-topic-preview-content,
        .v2p-topic-preview-addons,
        .v2p-reply-preview,
        .markdown_body
    )
    a[href^="http"]:hover,
body:is(
        .topic_content,
        .reply_content,
        .v2p-topic-preview-content,
        .v2p-topic-preview-addons,
        .v2p-reply-preview,
        .markdown_body
    )
    a[href*="/email-protection"]:hover,
body:is(
        .topic_content,
        .reply_content,
        .v2p-topic-preview-content,
        .v2p-topic-preview-addons,
        .v2p-reply-preview,
        .markdown_body
    )
    a[href^="/member/"]:hover {
    color: currentColor;
    background-color: var(--v2p-color-bg-link-hover);
}
body:is(
        .topic_content,
        .reply_content,
        .v2p-topic-preview-content,
        .v2p-topic-preview-addons,
        .v2p-reply-preview,
        .markdown_body
    )
    a[href^="http"]:has(> .embedded_image),
body:is(
        .topic_content,
        .reply_content,
        .v2p-topic-preview-content,
        .v2p-topic-preview-addons,
        .v2p-reply-preview,
        .markdown_body
    )
    a[href*="/email-protection"]:has(> .embedded_image),
body:is(
        .topic_content,
        .reply_content,
        .v2p-topic-preview-content,
        .v2p-topic-preview-addons,
        .v2p-reply-preview,
        .markdown_body
    )
    a[href^="/member/"]:has(> .embedded_image) {
    background-color: rgba(0, 0, 0, 0);
}
body .CodeMirror {
    color: currentColor;
    background-color: var(--v2p-color-bg-input);
}
body .CodeMirror.CodeMirror-focused {
    background-color: var(--v2p-color-bg-content);
}
body .CodeMirror .CodeMirror-gutters {
    padding-right: 5px;
    background-color: var(--v2p-color-bg-input);
    border-right: 1px solid var(--v2p-color-border-darker);
}
body .CodeMirror .CodeMirror-linenumber {
    color: var(--v2p-color-font-quaternary);
}
body .CodeMirror .CodeMirror-cursors {
    background-color: var(--v2p-color-foreground);
}
body .cm-s-one-dark {
    background-color: var(--v2p-color-bg-input);
}
body #workspace {
    overflow: hidden;
    border: 1px solid var(--button-border-color);
    border-radius: 8px;
}
body .select2-container {
    width: 200px !important;
}
body .select2-container .select2-selection {
    background-color: var(--v2p-color-background);
    border: 1px solid var(--v2p-color-border);
}
body .select2-container .select2-selection .select2-selection__rendered,
body .select2-container .select2-selection .select2-selection__placeholder {
    color: var(--v2p-color-foreground);
}
body .select2-container .select2-dropdown {
    font-size: 14px;
    background: var(--v2p-color-bg-widget);
    backdrop-filter: blur(16px);
    border: 1px solid var(--box-border-color);
    border-radius: 8px;
    box-shadow: var(--v2p-widget-shadow);
    transform: translateY(5px);
}
body .select2-container .select2-dropdown .select2-search {
    padding: 5px;
}
body .select2-container
    .select2-dropdown
    .select2-search
    .select2-search__field {
    padding: 6px 4px;
    background-color: rgba(0, 0, 0, 0);
    border: 1px solid var(--v2p-color-border);
    border-radius: 4px;
}
body .select2-container
    .select2-dropdown
    .select2-search
    .select2-search__field:focus-visible {
    border-color: var(--v2p-color-font-quaternary);
    outline: none;
}
body
    .select2-container
    .select2-dropdown
    .select2-results
    > .select2-results__options {
    padding: 5px;
}
body .select2-container
    .select2-dropdown
    .select2-container--default
    .select2-results__option--selected {
    color: currentColor;
    background-color: var(--v2p-color-accent-100);
}
body .select2-container .select2-results__option {
    border-radius: 4px;
}
body
    .select2-container
    .select2-results__option--highlighted.select2-results__option--selectable {
    color: currentColor;
    background-color: var(--v2p-color-main-200);
}
body .select2-container .select2-results__option--selected {
    color: currentColor !important;
    background-color: var(--v2p-color-accent-100) !important;
}
body .problem {
    color: currentColor;
    color: var(--v2p-color-orange-400);
    background-color: var(--v2p-color-orange-50);
    border-color: var(--v2p-color-orange-400);
    border-bottom: none;
}
body .markdown_body table {
    border-top: 1px solid var(--v2p-color-border-darker);
    box-shadow: none;
}
body .markdown_body table tr th,
body .markdown_body table tr td {
    border: 1px solid var(--v2p-color-border-darker);
}
body .markdown_body table tr:nth-child(2n) {
    background-color: var(--box-background-alt-color);
}
body .markdown_body blockquote {
    margin-inline: 0;
    padding: 0 1em;
    color: var(--v2p-color-font-tertiary);
    border-left: 3px solid var(--v2p-color-border);
}
body .markdown_body pre {
    line-height: 1.5;
}
body .social_label:is(:link, :visited, :active) {
    background-color: var(--v2p-color-button-background);
    border-radius: var(--box-border-radius);
    box-shadow: none;
}
body .social_label:is(:link, :visited, :active):hover {
    background-color: var(--v2p-color-button-background-hover);
}
body .green {
    color: var(--v2p-color-accent-500);
}
body .message {
    margin: 6px 10px 8px;   /* 上右下左：这里重点是 margin-bottom: 8px; */
    color: var(--v2p-color-orange-400);
    background-color: var(--v2p-color-orange-50);
    border: none;
    border-radius: 999px;
}

body .balance_area,
body a.balance_area:is(:link, :visited) {
    display: inline-flex;
    gap: 3px;
    align-items: center;
    font-weight: 600;
    color: var(--v2p-color-foreground);
    text-shadow: none;
    background: var(--v2p-color-button-background);
}
body .balance_area:hover,
body a.balance_area:is(:link, :visited):hover {
    background: var(--v2p-color-button-background-hover);
}
body:is(.subtle) {
    background-color: var(--v2p-color-bg-subtle);
    border-left: 3px solid var(--v2p-color-accent-200);
}
body:is(.subtle) .topic_content {
    font-size: 15px;
}
body .onoffswitch label .frame::before {
    color: #fff;
    background-color: var(--v2p-color-accent-400);
}
body .onoffswitch label .frame::after {
    color: var(--v2p-color-font-secondary);
    background-color: var(--v2p-color-bg-search);
}
body select {
    color: var(--v2p-color-foreground);
    background-color: var(--v2p-color-background);
    border: 1px solid var(--v2p-color-border);
    border-radius: 4px;
    padding: 4px 6px;
}
body .ml,
body .mle,
body .mll,
body .sl,
body .sll,
body .sls {
    color: var(--v2p-color-foreground);
    background-color: var(--v2p-color-bg-content);
    border-color: var(--v2p-color-input-border);
}
body .ml:focus,
body .mle:focus,
body .mll:focus,
body .sl:focus,
body .sll:focus,
body .sls:focus {
    border-color: var(--v2p-color-input-border);
}
body input,
body select,
body textarea {
    color: var(--v2p-color-foreground);
}
body .onoffswitch {
    width: 90px;
    min-width: 90px;
    max-width: 90px;
}
.box .tag::before {
    color: var(--v2p-color-font-secondary);
}
.box .tag:link,
.box .tag:visited {
    font-size: 12px;
    color: var(--v2p-color-font-secondary);
    background-color: var(--v2p-color-main-100);
    border-radius: 99px;
}
.box .tag > li {
    opacity: 0.6;
}
.payload {
    border-radius:10px;
}
#Top .content {
    height: 100%;
}
#Top .site-nav {
    height: 100%;
    padding: 0;
}
#Top .tools {
    display: flex;
    gap: 8px 14px;
    align-items: center;
    justify-content: flex-end;
    font-size: 14px;
    font-weight: 400;
}
#Top .tools .top {
    height: 26px;
    padding: 0 6px;
    line-height: 26px;
    color: var(--v2p-color-button-foreground);
    white-space: nowrap;
    border-radius: 4px;
}
#Top .tools .top:hover {
    color: var(--v2p-color-foreground);
}
#Top .tools .top:not(.v2p-hover-btn):hover {
    background-color: var(--v2p-color-button-background-hover);
}
#Top .tools * {
    margin-left: 0;
}
#Main .box {
    overflow: auto;
    padding: 5px 12px;
}
#Main .box.node-header > .cell {
    margin: 0 -12px;
}
#Main .node-header {
    padding-top:0 !important;
}
#Main .box .cell {
    padding: var(--v2p-tp-item-x) var(--v2p-tp-item-y);
    background-image: none !important;
}
#Main .box .cell_ops {
    padding: 15px 5px;
}
#Main .box:has(form[action="/write"]) .cell:nth-child(1),
#Main .box:has(form[action="/write"]) .cell:nth-child(2) {
    border: none;
}
#Main .box:has(form[action="/write"]) .cell:has(#syntax-selector) {
    padding: 8px 0 !important;
}
#Main
    .box:has(form[action="/write"])
    .cell:has(#syntax-selector)
    .tab-alt-container {
    gap: 0 8px;
}
#Main .box:has(form[action="/write"]) .cell:has(#syntax-selector) .tab-alt {
    padding: 4px 2px;
    border-bottom-width: 2px;
    transition: none;
}
#Main
    .box:has(form[action="/write"])
    .cell:has(#syntax-selector)
    .tab-alt:not(.active):hover {
    border-color: rgba(0, 0, 0, 0);
}
#Main .box:has(form[action="/write"]) .cell#preview {
    padding: 2px 5px;
}
#Main .topic_buttons {
    display: flex;
    flex-wrap: wrap;
    column-gap: 5px;
    align-items: center;
    padding: 8px 0;
    background: none;
}
#Main .topic_buttons .topic_stats {
    float: none;
    flex: 1;
    order: 99;
    margin-left: 10px;
    padding: 0 !important;
    font-size: 12px;
    text-shadow: none;
    white-space: nowrap;
}
#Main .topic_buttons .topic_thanked {
    font-size: 12px;
}
#Main .topic_buttons a.tb:link {
    display: flex;
    flex-direction: row-reverse;
    column-gap: 5px;
    align-items: center;
    padding: 5px;
    text-shadow: none;
    white-space: nowrap;
    background: none;
    border-radius: 4px;
}
#Main .topic_buttons a.tb:link:not(.v2p-hover-btn) {
    color: var(--v2p-color-font-secondary);
}
#Main .topic_buttons a.tb:link:hover:not(.v2p-hover-btn) {
    color: currentColor;
    background: var(--v2p-color-bg-block);
}
#Main .vote:link {
    color: var(--v2p-color-font-tertiary);
    border-color: var(--v2p-color-border-darker);
    border-radius: 5px;
}
#Main .vote:link:hover {
    box-shadow: 0 2px 2px var(--v2p-color-main-200);
}
#Main .cell .topic-link {
    color: var(--v2p-color-main-600);
    text-decoration: none;
}
#Main .cell .topic-link:visited {
    color: var(--v2p-color-main-600);
}
#Main .cell .topic_info {
    pointer-events: none;
    user-select: none;
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}
#Main .cell .topic_info::after {
    content: "";
    position: absolute;
    z-index: 1;
    inset: 0 0 -6px;
    background-color: var(--v2p-color-bg-content);
}
#Main .cell .topic_info .votes,
#Main .cell .topic_info .node,
#Main .cell .topic_info strong:first-of-type,
#Main .cell .topic_info span:first-of-type,
#Main .cell .topic_info .v2p-topic-actions {
    pointer-events: auto;
    position: relative;
    z-index: 2;
}
#Main .cell .topic_info a[href^="/member"] {
    font-weight: 500;
    color: var(--v2p-color-font-tertiary);
    background-color: rgba(0, 0, 0, 0);
}
#Main .cell .count_livid {
    user-select: none;
    display: inline-block;
    padding: 3px 6px;
    font-size: 11px;
    font-weight: 400;
    white-space: nowrap;
    border-radius: 99px;
    margin-right: 0;
    color: var(--v2p-color-button-foreground);
    background-color: var(--v2p-color-bg-block);
}
#Main .cell .count_orange {
    user-select: none;
    display: inline-block;
    padding: 3px 6px;
    font-size: 11px;
    font-weight: 400;
    white-space: nowrap;
    border-radius: 99px;
    font-weight: bold;
    color: var(--v2p-color-bg-block);
    background-color: var(--v2p-color-orange-400);
}
#Main .cell .item_title .topic-link {
    font-size: 15px;
    font-weight: 500;
}
#Main .cell.item tr > td:nth-child(2) {
    width: 30px;
}
#Main .box > .cell[id^="r"]:not(:has(.cell[id^="r"])) .reply_content,
#Main
    .v2p-modal-content
    > .cell[id^="r"]:not(:has(.cell[id^="r"]))
    .reply_content {
    padding-bottom: 0;
}
#Main .cell[id^="r"] {
    --bg-reply: var(--v2p-color-bg-content);
    background-color: var(--bg-reply);
}
#Main .cell[id^="r"]:not(:has(+ .cell[id^="r"])) {
    border-bottom: none;
}
#Main .cell[id^="r"]:hover > table td:last-of-type .fr a {
    opacity: 1;
}
#Main .cell[id^="r"] .ago {
    font-size: 12px;
    color: var(--v2p-color-font-quaternary);
    white-space: nowrap;
}
#Main .cell[id^="r"] .reply_content {
    padding-bottom: 10px;
    line-height: 1.5;
}
#Main .cell[id^="r"] > table:first-of-type td:first-of-type {
    width: 40px;
}
#Main .cell[id^="r"] > table:first-of-type td:first-of-type .avatar {
    display: inline-block;
    aspect-ratio: 1;
    width: 40px !important;
    height: 40px !important;
    background-color: var(--v2p-color-bg-avatar);
    margin-top:5px;
}
#Main .cell[id^="r"] > table ~ .cell[id^="r"] {
    --bg-reply: var(--v2p-color-bg-reply);
    position: relative;
    z-index: var(--zidx-expand-btn);
    padding: var(--v2p-tp-nested-pd);
    border-left: 2px solid var(--v2p-color-border-darker);
    border-top: 1px solid var(--v2p-color-border-darker);
    border-radius: 10px;
    margin:10px 0 0 30px;
}
#Main .cell[id^="r"] > table ~ .cell[id^="r"] .cell[id^="r"] {
    padding: 0;
    box-shadow: none;
}
#Main .cell[id^="r"] > table ~ .cell[id^="r"] .cell[id^="r"].v2p-indent {

    border-left: 2px solid var(--v2p-color-border-darker);
    padding:10px 10px 2px 10px;
}
#Main .cell[id^="r"] > table ~ .cell[id^="r"] tr td:first-of-type {
    width: 25px;
}
#Main .cell[id^="r"] > table ~ .cell[id^="r"] tr td:first-of-type .avatar {
    width: 25px !important;
    height: 25px !important;
    border-radius: 4px;
}
#Main .cell[id^="r"] > table ~ .cell[id^="r"] tr td:nth-child(3) strong a {
    font-size: 13px;
}
#Main .cell[id^="r"] > table ~ .cell[id^="r"] .reply_content {
    padding-right: 5px;
}
#Main .cell[id^="r"] > table td:nth-of-type(2) {
    width: 15px;
}
#Main .cell[id^="r"] > table td:last-of-type a.dark {
    color: var(--v2p-color-font-secondary);
    text-decoration: none;
}
#Main .cell[id^="r"] > table td:last-of-type a.dark:hover {
    text-decoration: none;
}
#Main .cell[id^="r"] > table td:last-of-type .fr {
    user-select: none;
    position: relative;
    top: -3px;
}
#Main .cell[id^="r"] > table td:last-of-type .fr a {
    opacity: 0;
}
#Main .cell[id^="r"] > table td:last-of-type .fr + .sep3 {
    height: 0;
}
#Main .cell[id^="r"]:last-of-type {
    border: none;
}
#Main .cell[id^="r"] .no {
    user-select: none;
    position: relative;
    top: -4px;
    padding: 5px 10px;
    font-size: 12px;
    color: var(--v2p-color-cell-num);
    background-color: rgba(0, 0, 0, 0);
    border-radius: 5px;
}
#Main #Tabs {
    user-select: none;
    position: sticky;
    z-index: var(--zidx-tabs);
    top: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0;
    align-items: center;
    padding: var(--v2p-tp-tabs-pd);
    background-color: var(--v2p-color-bg-content);
}
#Main #Tabs .tab_current {
    margin-right:0;
}
#Main #Tabs .tab {
    margin: 3px 4px;
}
#Main #Tabs .tab.v2p-hover-btn::before {
    inset: 0;
}
#Main #SecondaryTabs {
    padding: 5px 20px;
    background-color: var(--v2p-color-bg-tabs);
    border-radius: 99px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.05);
    margin-bottom:10px;
}
#Main #SecondaryTabs a {
    color: var(--v2p-color-main-600);
}
#Main .topic_content,
#Main .reply_content {
    font-size: 15px;
    line-height: 1.6;
    color: currentColor;
}
#Main .topic_content a[href^="/member"],
#Main .reply_content a[href^="/member"] {
    position: relative;
    bottom: 1px;
    font-size: 13px;
    color: var(--v2p-color-font-tertiary);
    text-decoration: underline;
    text-underline-offset: 0.4ex;
    background-color: rgba(0, 0, 0, 0);
}
#Main .thank_area {
    font-size: 12px;
}
#Main .tab {
    user-select: none;
    color: var(--v2p-color-foreground);
    background-color: rgba(0, 0, 0, 0);
}
#Main .tab:not(.v2p-hover-btn):hover {
    background-color: var(--v2p-color-bg-block);
}
#Main .tab_current {
    user-select: none;
    color: var(--v2p-color-bg-content) !important;
    background-color: var(--v2p-color-foreground) !important;
    border-radius: 999px !important;
}
#Main #reply-box.reply-box-sticky {
    z-index: var(--zidx-reply-box);
    bottom: 20px;
    overflow: visible;
    margin: 0 -10px;
    padding: 0 22px;
    border: none;
    border-radius: var(--box-border-radius);
    outline: 2px solid var(--v2p-color-border);
}
a.topic-link:active,a.topic-link:link {
    line-height: 1.5;
}
#Main #reply-box .flex-one-row:last-of-type {
    
    justify-content: flex-start;
}
#Main #reply-box .flex-one-row:last-of-type .gray {
    margin-right: auto;
}
#Main #reply-box > .cell {
    font-size: 12px;
}
#Main #reply-box > .cell.flex-one-row {
    min-height: 45px;
    padding: 0 10px;
    border: none;
}
#Main #reply-box > .cell.flex-row-end {
    padding: 12px 10px;
    border: none;
}
#Main #reply-box > .cell:has(form) {
    padding-top: 0;
}
#Main #no-comments-yet {
    color: var(--color-gray);
    border-color: var(--color-gray);
}
#Main #notifications .cell[id^="n"]:hover .node {
    opacity: 1;
}
#Main #notifications .cell[id^="n"] .node {
    opacity: 0;
}
#Main #notifications .cell[id^="n"] .payload {
    color: var(--v2p-color-foreground);
    background-color: var(--v2p-color-bg-block);
}
#Main #notifications .cell[id^="n"] .payload:has(.embedded_video_wrapper) {
    min-width: 50%;
}
#Main #notifications .cell[id^="n"] .topic-link:visited {
    color: var(--v2p-color-font-quaternary);
}
#Main .cell_tabs .cell_tab_current {
    font-weight: bold;
    border-color: var(--v2p-color-foreground);
}
#Main .cell_tabs .cell_tab {
    color: var(--v2p-color-foreground);
}
#Main .cell_tabs .cell_tab:hover {
    border-color: var(--v2p-color-border-darker);
}
#Rightbar .cell:has(.light-toggle) {
    font-size: 13px;
}
#Rightbar .box .item_node {
    font-size: 12px;
    color: var(--v2p-color-font-secondary);
    border-color: var(--v2p-color-border);
    border-radius: 5px;
}
#Rightbar .box .item_node:hover {
    box-shadow: var(--v2p-box-shadow);
}
#Rightbar a.dark:is(:link, :active, :visited, :hover) {
    color: var(--v2p-color-font-tertiary);
}
#Rightbar a.dark:is(:link, :active, :visited, :hover):hover {
    color: var(--v2p-color-font-secondary);
}
#Bottom {
    position: sticky;
    top: 100%;
}
#Bottom a.dark {
    font-size: 13px;
    font-weight: 400;
}
#Bottom a.dark:is(:link, :active, :visited, :hover) {
    color: var(--v2p-color-font-tertiary);
}
.wwads-cn {
    border: none !important;
    box-shadow: none !important;
}
.box:has(a[href^="/advertise"]) {
    overflow: hidden;
    border: none !important;
    box-shadow: none !important;
}
.box:has(a[href^="/advertise"]) .sidebar_compliance {
    background-color: var(--v2p-color-bg-block);
}
.inner table {
table-layout: fixed;
}
/* --- 这里替换原文件中的深色模式 CSS --- */
html.v2p-theme-dark-default,
html.v2p-theme-dark-default body,
:root body.v2p-theme-dark-default,
:root .v2p-theme-dark-default,
:root[data-darkreader-scheme="dark"] body,
:root body:where(:has(#Wrapper.Night)) {
    color-scheme: dark;
    --v2p-color-main-50: unset;
    --v2p-color-main-100: #2d333b;
    --v2p-color-main-200: #374151;
    --v2p-color-main-300: #374151;
    --v2p-color-main-350: #6b7280cc;
    --v2p-color-main-400: #6b7280;
    --v2p-color-main-500: #9ca3af;
    --v2p-color-main-600: #9ca3af;
    --v2p-color-main-700: #d1d5db;
    --v2p-color-main-800: #e5e7eb;
    --v2p-color-main-900: #111827;
    --v2p-color-main-950: #030712;
    --v2p-color-border:#2d323c;
    --v2p-color-accent-50: #064e3b;
    --v2p-color-accent-100: #065f46;
    --v2p-color-accent-200: #047857;
    --v2p-color-accent-300: #059669;
    --v2p-color-accent-400: #34d399;
    --v2p-color-accent-500: #34d399;
    --v2p-color-accent-600: #6ee7b7;
    --v2p-color-orange-50: #593600;
    --v2p-color-orange-100: #9a3412;
    --v2p-color-orange-400: #fbe090;
    --v2p-color-background: #1c2128;
    --v2p-color-foreground: #adbac7;
    --v2p-color-font-secondary: var(--v2p-color-main-600);
    --v2p-color-button-background: #373e47;
    --v2p-color-button-foreground: var(--v2p-color-foreground);
    --v2p-color-button-background-hover: #444c56;
    --v2p-color-button-foreground-hover: var(--v2p-color-foreground);
    --v2p-color-bg-content: #22272e;
    --v2p-color-bg-hover-btn: var(--v2p-color-button-background-hover);
    --v2p-color-bg-subtle: #444c56;
    --v2p-color-bg-input: var(--v2p-color-background);
    --v2p-color-bg-search: var(--v2p-color-main-100);
    --v2p-color-bg-search-active: var(--v2p-color-main-200);
    --v2p-color-bg-widget: var(--v2p-color-bg-content);
    --v2p-color-bg-reply: var(--v2p-color-main-100);
    --v2p-color-bg-tooltip: var(--v2p-color-main-100);
    --v2p-color-bg-avatar: var(--v2p-color-main-300);
    --v2p-color-bg-block: #373e47;
    --v2p-color-heart: #ef4444;
    --v2p-color-heart-fill: #fca5a5;
    --v2p-color-mask: rgb(99 110 123 / 40%);
    --v2p-color-border: #444c56;
    --v2p-color-input-border: #444c56;
    --v2p-color-border-darker: #444c56;
    --v2p-box-shadow: 0 3px 5px 0 rgb(0 0 0 / 10%);
    --v2p-toast-shadow: none;
    --link-color: var(--v2p-color-foreground);
    --link-visited-color:var(--v2p-color-foreground);
    --box-background-alt-color: var(--v2p-color-main-100);
    --box-background-hover-color: var(--v2p-color-main-300);
    --box-border-color: var(--v2p-color-main-100);
    --button-hover-color: var(--button-background-hover-color);
    --button-border-color: var(--v2p-color-border);
    --button-border-hover-color: #768390;

    visibility: visible;
}

html.v2p-theme-dark-default #Logo,
html.v2p-theme-dark-default body #Logo,
:root body.v2p-theme-dark-default #Logo,
:root .v2p-theme-dark-default #Logo,
:root[data-darkreader-scheme="dark"] body #Logo,
:root body:has(#Wrapper.Night) #Logo {
    background-image: url("https://raw.githubusercontent.com/thinktip/V2ex-Polish-Plus/refs/heads/main/v2ex-alt%402x.svg");
}

html.v2p-theme-dark-default::selection,
html.v2p-theme-dark-default body::selection,
:root body.v2p-theme-dark-default::selection,
:root .v2p-theme-dark-default::selection,
:root[data-darkreader-scheme="dark"] body::selection,
:root body:has(#Wrapper.Night)::selection {
    color: var(--v2p-color-background, #1c2128);
    background-color: var(--v2p-color-foreground, #adbac7);
}

html.v2p-theme-dark-default img::selection,
html.v2p-theme-dark-default body img::selection,
:root body.v2p-theme-dark-default img::selection,
:root .v2p-theme-dark-default img::selection,
:root[data-darkreader-scheme="dark"] body img::selection,
:root body:has(#Wrapper.Night) img::selection {
    background-color: var(--v2p-color-foreground, #adbac7);
}

html.v2p-theme-dark-default #Top,
html.v2p-theme-dark-default body #Top,
:root body.v2p-theme-dark-default #Top,
:root .v2p-theme-dark-default #Top,
:root[data-darkreader-scheme="dark"] body #Top,
:root body:has(#Wrapper.Night) #Top {
    background-color: rgba(0, 0, 0, 0);
}

html.v2p-theme-dark-default #Main .cell .item_title .topic-link,
:root body.v2p-theme-dark-default #Main .cell .item_title .topic-link,
:root .v2p-theme-dark-default #Main .cell .item_title .topic-link,
:root[data-darkreader-scheme="dark"] body #Main .cell .item_title .topic-link,
:root body:has(#Wrapper.Night) #Main .cell .item_title .topic-link {
    font-weight: normal;
}

html.v2p-theme-dark-default #search-container::before,
:root body.v2p-theme-dark-default #search-container::before,
:root .v2p-theme-dark-default #search-container::before,
:root[data-darkreader-scheme="dark"] body #search-container::before,
:root body:has(#Wrapper.Night) #search-container::before {
    background-image: url("/static/img/search_icon_light.png");
}
/* --- SAFARI FIX 强制补丁 (整合版) --- */

    /* 1. Tabs 标签栏修复 */
    html.v2p-theme-dark-default #Main #Tabs .tab,
    html.v2p-theme-dark-default #Tabs .tab {
        color: var(--v2p-color-foreground) !important;
        background-color: transparent;
    }
    html.v2p-theme-dark-default #Main #Tabs .tab:hover,
    html.v2p-theme-dark-default #Tabs .tab:hover {
        background-color: var(--v2p-color-bg-block);
    }
    html.v2p-theme-dark-default #Main #Tabs .tab_current,
    html.v2p-theme-dark-default #Tabs .tab_current,
    html.v2p-theme-dark-default .v2p-mobile #Tabs a.tab_current {
        color: var(--v2p-color-bg-content) !important;
        background-color: var(--v2p-color-foreground) !important;
        border: none !important;
    }

    /* 2. Livid/Count 计数背景色修复 */
    html.v2p-theme-dark-default .count_livid,
    html.v2p-theme-dark-default #Main .cell .count_livid,
    html.v2p-theme-dawn #Main .cell .count_livid,
    html.v2p-theme-aqua #Main .cell .count_livid,

    html.v2p-theme-dark-default a.count_livid,
    html.v2p-theme-dark-default .v2p-mobile a.count_livid {
        color: var(--v2p-color-button-foreground) !important;
        background-color: var(--v2p-color-bg-block) !important;
        border: none !important;
    }

    /* 3. [新增] 移动端菜单 (Menu Body) 修复 */
    /* 强制菜单容器背景变黑 */
    html.v2p-theme-dark-default #menu-body,
    html.v2p-theme-dark-default .v2p-mobile #menu-body {
        background-color: var(--v2p-color-bg-content) !important;
        border: 1px solid var(--v2p-color-border) !important;
        box-shadow: 0 5px 15px rgba(0,0,0,0.5) !important;
    }

    /* 强制菜单内文字颜色变亮 */
    html.v2p-theme-dark-default #menu-body .cell a,
    html.v2p-theme-dark-default #menu-body .cell a.top,
    html.v2p-theme-dark-default .v2p-mobile #menu-body .cell a {
        color: var(--v2p-color-foreground) !important;
        background-color: transparent !important;
    }

    /* 修复菜单内图标可能的白底问题 */
    html.v2p-theme-dark-default #menu-body img.tool-icon {
         filter: brightness(0.8); /*稍微压暗一点图标以免太刺眼*/
    }
    html.v2p-theme-dark-default .no {
         background-color:var(--v2p-color-main-100);
         margin-top:-3px;
         border-radius:99px;
    }

.cell.item > table > tbody > tr > td:nth-child(2) {
    width: 10px !important;
    max-width: 15px !important;
}
/* ==========================================================================
   移动端楼中楼 (Nested Replies) 专属优化
   ========================================================================== */

/* 1. 针对移动端，大幅减小嵌套回复的左缩进，改用“左侧边框”来体现层级 */
.v2p-mobile #Main .cell[id^="r"] > table ~ .cell[id^="r"] {
    margin: 6px 0 6px 8px !important; /* 左缩进仅保留 8px */
    padding: 8px 6px !important;      /* 减小内边距 */
    border: none !important;
    border-left: 2px solid var(--v2p-color-divider) !important; /* 使用实线边框表示层级 */
    border-radius: 0 4px 4px 0 !important; /* 仅右侧圆角 */
    background-color: var(--v2p-color-bg-subtle) !important; /* 稍微深一点的背景 */
}

/* 2. 处理多层嵌套时的背景叠加问题，避免太深 */
.v2p-mobile #Main .cell[id^="r"] > table ~ .cell[id^="r"] .cell[id^="r"] {
    background-color: var(--v2p-color-bg-content) !important; /* 第三层变回亮色/暗色背景，形成交替感 */
    margin-left: 6px !important;
    border-left: 2px solid var(--v2p-color-accent-400) !important; /* 第三层换个边框色（可选） */
}

/* 3. 移动端嵌套回复中，头像和用户名的布局微调 */
.v2p-mobile #Main .cell[id^="r"] > table ~ .cell[id^="r"] table tr td:nth-child(1) {
    width: 28px !important; /* 稍微限制头像列宽 */
}

.v2p-mobile #Main .cell[id^="r"] > table ~ .cell[id^="r"] .avatar {
    width: 20px !important; /* 嵌套回复头像缩小，节省空间 */
    height: 20px !important;
}

/* 4. 隐藏嵌套回复中一些不必要的元素以节省空间 */
.v2p-mobile #Main .cell[id^="r"] > table ~ .cell[id^="r"] .ago {
    font-size: 10px !important; /* 时间字体变小 */
}
.v2p-mobile #Main .cell[id^="r"] > table ~ .cell[id^="r"] .no {
    display: none !important; /* 移动端嵌套内隐藏楼层号，避免干扰 */
}

/* 5. 修复移动端回复内容的行高和字体 */
.v2p-mobile .reply_content {
    font-size: 15px !important;
    line-height: 1.5 !important;
    overflow-wrap: break-word; /* 强行换行，防止长链接撑破布局 */
}

/* 6. 确保父级 Cell 在移动端不会因为 Padding 导致宽度不够 */
.v2p-mobile #Main .cell[id^="r"] {
    padding-right: 5px !important;
    padding-left: 5px !important;
}

@supports not selector(:has(*)) {
    :root #Wrapper.Night {
        --v2p-color-main-50: unset;
        --v2p-color-main-100: #2d333b;
        --v2p-color-main-200: #374151;
        --v2p-color-main-300: #374151;
        --v2p-color-main-350: #6b7280cc;
        --v2p-color-main-400: #6b7280;
        --v2p-color-main-500: #9ca3af;
        --v2p-color-main-600: #9ca3af;
        --v2p-color-main-700: #d1d5db;
        --v2p-color-main-800: #e5e7eb;
        --v2p-color-main-900: #111827;
        --v2p-color-main-950: #030712;
        --v2p-color-accent-50: #064e3b;
        --v2p-color-accent-100: #065f46;
        --v2p-color-accent-200: #047857;
        --v2p-color-accent-300: #059669;
        --v2p-color-accent-400: #34d399;
        --v2p-color-accent-500: #34d399;
        --v2p-color-accent-600: #6ee7b7;
        --v2p-color-orange-50: #593600;
        --v2p-color-orange-100: #9a3412;
        --v2p-color-orange-400: #fbe090;
        --v2p-color-background: #1c2128;
        --v2p-color-foreground: #adbac7;
        --v2p-color-font-secondary: var(--v2p-color-main-600);
        --v2p-color-button-background: #373e47;
        --v2p-color-button-foreground: var(--v2p-color-foreground);
        --v2p-color-button-background-hover: #444c56;
        --v2p-color-button-foreground-hover: var(--v2p-color-foreground);
        --v2p-color-bg-content: #22272e;
        --v2p-color-bg-hover-btn: var(--v2p-color-button-background-hover);
        --v2p-color-bg-subtle: #f7f7f7;
        --v2p-color-bg-input: var(--v2p-color-background);
        --v2p-color-bg-search: var(--v2p-color-main-100);
        --v2p-color-bg-search-active: var(--v2p-color-main-200);
        --v2p-color-bg-widget: var(--v2p-color-bg-content);
        --v2p-color-bg-reply: var(--v2p-color-main-100);
        --v2p-color-bg-tooltip: var(--v2p-color-main-100);
        --v2p-color-bg-avatar: var(--v2p-color-main-300);
        --v2p-color-bg-block: #373e47;
        --v2p-color-heart: #ef4444;
        --v2p-color-heart-fill: #fca5a5;
        --v2p-color-mask: rgb(99 110 123 / 40%);
        --v2p-color-border: #444c56;
        --v2p-color-input-border: #444c56;
        --v2p-color-border-darker: #444c56;
        --v2p-box-shadow: 0 0 0 1px var(--v2p-color-border);
        --v2p-toast-shadow: none;
        --link-color: var(--v2p-color-foreground);
        --box-background-alt-color: var(--v2p-color-main-100);
        --box-background-hover-color: var(--v2p-color-main-300);
        --button-hover-color: var(--button-background-hover-color);
        --button-border-color: var(--v2p-color-border);
        --button-border-hover-color: #768390;
        visibility: visible;
    }
    :root #Wrapper.Night #Logo {
        background-image: url("https://www.v2ex.com/static/img/v2ex-alt@2x.png");
    }
    :root #Wrapper.Night::selection {
        color: var(--v2p-color-background, #1c2128);
        background-color: var(--v2p-color-foreground, #adbac7);
    }
    :root #Wrapper.Night img::selection {
        background-color: var(--v2p-color-foreground, #adbac7);
    }
}
body.v2p-theme-dawn,
.v2p-theme-dawn {
    --v2p-color-base: 32deg 57% 95%;
    --v2p-color-surface: 35deg 100% 98%;
    --v2p-color-overlay: 33deg 43% 91%;
    --v2p-color-muted: 257deg 9% 61%;
    --v2p-color-subtle: 248deg 12% 52%;
    --v2p-color-text: 248deg 19% 40%;
    --v2p-color-love: 343deg 35% 55%;
    --v2p-color-gold: 35deg 81% 56%;
    --v2p-color-rose: 3deg 53% 67%;
    --v2p-color-pine: 197deg 53% 34%;
    --v2p-color-foam: 189deg 30% 48%;
    --v2p-color-iris: 268deg 21% 57%;
    --v2p-color-main-600: hsl(47, 48.15%, 21.26%)
    --v2p-color-accent-50: hsl(var(--v2p-color-foam) / 10%);
    --v2p-color-accent-100: hsl(var(--v2p-color-foam) / 20%);
    --v2p-color-accent-200: hsl(var(--v2p-color-foam) / 30%);
    --v2p-color-accent-300: hsl(var(--v2p-color-foam) / 40%);
    --v2p-color-accent-400: #34d399;
    --v2p-color-accent-500: hsl(var(--v2p-color-foam) / 65%);
    --v2p-color-accent-600: hsl(var(--v2p-color-foam) / 80%);
    --v2p-color-orange-50: hsl(var(--v2p-color-gold) / 10%);
    --v2p-color-orange-100: hsl(var(--v2p-color-gold) / 20%);
    --v2p-color-orange-400: hsl(var(--v2p-color-gold));
    --v2p-color-background: hsl(var(--v2p-color-base));
    --v2p-color-foreground: hsl(38.09deg 19% 40%);
    --v2p-color-selection-foreground: var(--v2p-color-foreground);
    --v2p-color-selection-background: hsl(var(--v2p-color-muted) / 20%);
    --v2p-color-selection-background-img: hsl(var(--v2p-color-muted) / 60%);
    --v2p-color-font-secondary: hsl(37.89deg 18.63% 40%);
    --v2p-color-font-tertiary: hsl(var(--v2p-color-subtle));
    --v2p-color-font-quaternary: hsl(var(--v2p-color-subtle));
    --v2p-color-button-background: hsl(var(--v2p-color-text) / 10%);
    --v2p-color-button-foreground: var(--v2p-color-foreground);
    --v2p-color-button-background-hover: hsl(var(--v2p-color-text) / 15%);
    --v2p-color-button-foreground-hover: var(--v2p-color-foreground);
    --v2p-color-bg-content: hsl(var(--v2p-color-surface));
    --v2p-color-bg-footer: var(--v2p-color-bg-content);
    --v2p-color-bg-hover-btn: rgb(152 147 165 / 10%);
    --v2p-color-bg-subtle: hsl(var(--v2p-color-pine) / 10%);
    --v2p-color-bg-input: hsl(var(--v2p-color-overlay) / 40%);
    --v2p-color-bg-search: hsl(var(--v2p-color-overlay) / 60%);
    --v2p-color-bg-search-active: hsl(var(--v2p-color-overlay) / 90%);
    --v2p-color-bg-widget: rgb(255 255 255 / 70%);
    --v2p-color-bg-reply: #faf4ed;
    --v2p-color-bg-tooltip: var(--v2p-color-bg-content);
    --v2p-color-bg-tabs: hsl(34deg 53% 34% / 10%);
    --v2p-color-bg-tpr: hsl(var(--v2p-color-text) / 10%);
    --v2p-color-bg-avatar: hsl(var(--v2p-color-overlay));
    --v2p-color-bg-block: hsl(var(--v2p-color-text) / 10%);
    --v2p-color-bg-block-darker: hsl(var(--v2p-color-text) / 25%);
    --v2p-color-bg-link: hsl(var(--v2p-color-text) / 10%);
    --v2p-color-bg-link-hover: hsl(var(--v2p-color-text) / 15%);
    --v2p-color-tabs: hsl(46.92deg 53% 34%);
    --v2p-color-heart: #eb6f92;
    --v2p-color-heart-fill: rgb(235 111 146 / 50%);
    --v2p-color-mask: rgb(0 0 0 / 25%);
    --v2p-color-divider: hsl(var(--v2p-color-muted) / 20%);
    --v2p-color-border: hsl(var(--v2p-color-muted) / 20%);
    --v2p-color-input-border: rgb(152 147 165 / 20%);
    --v2p-color-border-darker: hsl(var(--v2p-color-muted) / 40%);
    --v2p-color-link-visited: hsl(37.89, 18.63%, 60%);
    --v2p-color-error: #eb6f92;
    --v2p-color-bg-error: #fee2e2;

    --v2p-color-cell-num: hsl(var(--v2p-color-subtle));
    --v2p-box-shadow: 0 3px 5px 0 rgb(0 0 0 / 4%);
    --v2p-widget-shadow: 0 9px 24px -3px rgb(0 0 0 / 6%),
        0 4px 8px -1px rgb(0 0 0 /12%);
    --v2p-toast-shadow: 0 6px 16px 0 rgb(0 0 0 / 8%),
        0 3px 6px -4px rgb(0 0 0 / 12%), 0 9px 28px 8px rgb(0 0 0 / 5%);
    --link-color: var(--v2p-color-foreground);
    --link-visited-color:var(--v2p-color-foreground);
    --box-background-alt-color: var(--v2p-color-bg-block);
    --box-background-hover-color: var(--v2p-color-bg-link-hover);
    --button-hover-color: var(--v2p-color-button-background-hover);
    --button-border-color: var(--v2p-color-border);
    --button-border-hover-color: var(--v2p-color-border-darker);
    visibility: visible;
}
body.v2p-theme-dawn .button.special:hover,
body.v2p-theme-dawn .button.special:hover:enabled,
.v2p-theme-dawn .button.special:hover,
.v2p-theme-dawn .button.special:hover:enabled {
    text-shadow: none;
}

body.v2p-theme-aqua,
.v2p-theme-aqua {
    /* --- 核心颜色调整：从暖色 (32deg) 切换到冷色 (210-230deg) --- */

    /* 基础和表面色：非常浅、高饱和度的冷白/浅灰蓝 */
    --v2p-color-base: 220deg 18% 97%;   /* 整体背景: 略带蓝色的浅灰色 */
    --v2p-color-surface: 240deg 100% 100%; /* 内容卡片背景: 纯白或极浅蓝白 */
    --v2p-color-overlay: 210deg 12% 90%;  /* 遮罩/输入框背景: 干净的浅灰色 */

    /* 文本颜色：使用深蓝色或深灰色以提供高对比度 */
    --v2p-color-muted: 215deg 10% 55%;  /* 次要文本: 中等冷灰 */
    --v2p-color-subtle: 220deg 15% 45%; /* 次级文本: 较深的冷灰 */
    --v2p-color-text: 220deg 25% 25%;  /* 主文本: 接近黑色的深蓝灰 */

    /* 强调色：Aqua/Cyan/Blue，用于链接和高光 */
    --v2p-color-love: 345deg 60% 55%;  /* 红色/点赞: 保持一个略冷的洋红/玫瑰色 */
    --v2p-color-gold: 35deg 81% 56%;   /* 警告/金: 保持不变，或略调冷*/
    --v2p-color-rose: 3deg 53% 67%;    /* 错误/玫瑰: 保持不变 */
    --v2p-color-pine: 180deg 53% 34%;  /* 蓝绿色/主要强调色 (Pine -> Cyan) */
    --v2p-color-foam: 195deg 70% 45%;  /* 强调色 (Aqua/Foam) */
    --v2p-color-iris: 240deg 50% 60%;  /* 紫色/次要强调色 (Iris -> Blue) */

    /* --- 衍生色（强调色使用 --v2p-color-iris，以提供蓝色高光） --- */
    --v2p-color-accent-50: #ecfdf5;
    --v2p-color-accent-100: hsl(var(--v2p-color-iris) / 20%);
    --v2p-color-accent-200: hsl(var(--v2p-color-iris) / 30%);
    --v2p-color-accent-300: hsl(var(--v2p-color-iris) / 40%);
    --v2p-color-accent-400: #34d399;
    --v2p-color-accent-500: hsl(var(--v2p-color-iris) / 65%);
    --v2p-color-accent-600: hsl(var(--v2p-color-iris) / 80%);
    --v2p-color-orange-50: hsl(var(--v2p-color-gold) / 10%);
    --v2p-color-orange-100: hsl(var(--v2p-color-gold) / 20%);
    --v2p-color-orange-400: hsl(var(--v2p-color-gold));

    /* --- 背景 & 字体 --- */
    --v2p-color-background: #f2f7fa;
    --v2p-color-foreground: hsl(var(--v2p-color-text));

    --v2p-color-selection-foreground: var(--v2p-color-surface); /* 选中字体为白色 */
    --v2p-color-selection-background: hsl(var(--v2p-color-iris) / 60%); /* 选中背景为蓝色 */
    --v2p-color-selection-background-img: hsl(var(--v2p-color-iris) / 80%);

    --v2p-color-font-secondary: hsl(var(--v2p-color-subtle));
    --v2p-color-font-tertiary: hsl(var(--v2p-color-subtle));
    --v2p-color-font-quaternary: hsl(var(--v2p-color-subtle));

    /* --- 交互元素 --- */
    --v2p-color-button-background: hsl(var(--v2p-color-iris) / 10%); /* 按钮背景使用冷色调 */
    --v2p-color-button-foreground: var(--v2p-color-foreground);
    --v2p-color-button-background-hover: hsl(var(--v2p-color-iris) / 15%);
    --v2p-color-button-foreground-hover: var(--v2p-color-foreground);

    /* --- 界面元素 --- */
    --v2p-color-bg-content: hsl(var(--v2p-color-surface)); /* 内容卡片使用纯白 */
    --v2p-color-bg-footer: var(--v2p-color-bg-content);
    --v2p-color-bg-hover-btn: hsl(var(--v2p-color-iris) / 10%); /* 按钮悬停使用冷色高光 */
    --v2p-color-bg-subtle: hsl(var(--v2p-color-iris) / 10%);
    --v2p-color-bg-input: hsl(var(--v2p-color-overlay) / 50%);
    --v2p-color-bg-search: hsl(var(--v2p-color-overlay) / 70%);
    --v2p-color-bg-search-active: hsl(var(--v2p-color-overlay));
    --v2p-color-bg-widget: rgb(255 255 255 / 85%); /* 略带透明的白色 */
    --v2p-color-bg-reply: #f3f6fa; /* 浅浅的冷蓝色背景 */
    --v2p-color-bg-tooltip: var(--v2p-color-bg-content);
    --v2p-color-bg-tabs: hsl(var(--v2p-color-iris) / 5%);
    --v2p-color-bg-tpr: hsl(var(--v2p-color-text) / 10%);
    --v2p-color-bg-avatar: hsl(var(--v2p-color-overlay));
    --v2p-color-bg-block: hsl(var(--v2p-color-iris) / 5%); /* 内容块极浅蓝色背景 */
    --v2p-color-bg-block-darker: hsl(var(--v2p-color-iris) / 15%);
    --v2p-color-bg-link: hsl(var(--v2p-color-iris) / 10%);
    --v2p-color-bg-link-hover: hsl(var(--v2p-color-iris) / 15%);

    --v2p-color-tabs: #394d65; /* Tabs 使用蓝色强调 */

    /* --- 边框 & 阴影 --- */
    --v2p-color-divider: hsl(var(--v2p-color-muted) / 15%); /* 更浅的边框 */
    --v2p-color-border: hsl(var(--v2p-color-muted) / 15%);
    --v2p-color-input-border: hsl(220deg 15% 75%); /* 浅灰色冷调输入框边框 */
    --v2p-color-border-darker: hsl(var(--v2p-color-muted) / 30%);

    /* --- 其他 --- */
    --v2p-color-link-visited: hsl(var(--v2p-color-subtle));
    --v2p-color-error: #eb6f92;
    --v2p-color-bg-error: #fee2e2;
    --v2p-color-cell-num: hsl(var(--v2p-color-subtle));
    --v2p-box-shadow: 0 1px 2px 0 rgb(0 0 0 / 6%), 0 1px 3px 0 rgb(0 0 0 / 4%); /* 调整为更轻的阴影 */
    --v2p-widget-shadow: 0 6px 16px -3px rgb(0 0 0 / 4%),
        0 2px 4px -1px rgb(0 0 0 /8%); /* 调整为更轻的阴影 */
    --v2p-toast-shadow: var(--v2p-widget-shadow);

    /* --- 别名 (使用 Accent Color Blue) --- */
    --link-color: #394d65; /* 链接使用蓝色 */
    --link-visited-color:var(--v2p-color-foreground);
    --box-background-alt-color: var(--v2p-color-bg-block);
    --box-background-hover-color: var(--v2p-color-bg-link-hover);
    --button-hover-color: var(--v2p-color-button-background-hover);
    --button-border-color: var(--v2p-color-border);
    --button-border-hover-color: var(--v2p-color-border-darker);

    visibility: visible;
}

body {
    position: relative;
}
body.v2p-modal-open {
    overflow: hidden;
}
body .button.v2p-prev-btn,
body .button.v2p-next-btn {
    padding: 0 15px;
}
body #Top a:has(#Logo.v2p-logo) {
    display: inline-flex;
    align-items: center;
}
body #Logo.v2p-logo {
    width: unset;
    height: 25px;
    padding: 0 8px;
    background-image: none !important;
}
.v2p-hover-btn {
    cursor: pointer;
    user-select: none;
    position: relative;
    z-index: 1;
    margin: 0;
    text-decoration: none;
    white-space: nowrap;
    background: none;
    background-color: rgba(0, 0, 0, 0);
    transition: color 0.2s;
}
.v2p-hover-btn::before {
    content: "";
    position: absolute;
    z-index: -1;
    inset: 0 -5px;
    transform: scale(0.65);
    opacity: 0;
    background-color: var(--v2p-color-bg-hover-btn);
    border-radius: 99px;
    transition:
        background-color 0.15s,
        color 0.15s,
        transform 0.15s,
        opacity 0.15s;
}
.v2p-hover-btn:hover {
    text-decoration: none;
}
.v2p-hover-btn:hover::before {
    transform: scale(1);
    opacity: 1;
}
.v2p-hover-btn-disabled {
    pointer-events: none;
    opacity: 0.8;
}
.v2p-icon-heart {
    display: inline-flex;
    width: 14px;
    height: 14px;
    color: var(--v2p-color-heart);
}
.v2p-icon-heart svg {
    fill: var(--v2p-color-heart-fill);
}
#Main .cell[id^="r"] .v2p-auto-hide {
    overflow: hidden;
    display: inline-flex;
    width: 0;
}
#Main #reply-box .v2p-reply-preview {
    font-size: 15px;
    line-height: 1.6;
}
#Main .cell:hover .v2p-topic-preview-btn,
#Main .cell:hover .v2p-topic-ignore-btn,
#Rightbar .cell:hover .v2p-topic-preview-btn,
#Rightbar .cell:hover .v2p-topic-ignore-btn {
    visibility: visible;
}
#Rightbar .v2p-info-row {
    display: block;
    font-size: 12px;
    color: var(--v2p-color-accent-500);
    text-align: center;
}
#Rightbar .v2p-info-row:hover {
    text-decoration: none;
    background-color: var(--v2p-color-accent-50);
}
#Rightbar .v2p-topic-preview-btn {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    height: 20px;
    font-size: 12px;
    backdrop-filter: blur(8px);
    box-shadow: 0 0 0 3px var(--v2p-color-bg-content);
}

.page_current {
    padding: 2px 5px;
    border-radius: var(--box-border-radius);
    margin: 0 1px;
}
.v2p-tool-box {
    position: sticky;
    z-index: var(--zidx-tools-card);
    top: var(--v2p-layout-row-gap);
}
.v2p-tool-box .v2p-tools {
    display: grid;
    grid-auto-rows: auto;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px 15px;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: var(--v2p-color-font-secondary);
}
.v2p-tool {
    display: inline-flex;
    gap: 0 5px;
    align-items: center;
    padding: 3px 0;
}
.v2p-tool:hover {
    color: var(--v2p-color-button-foreground-hover);
}
.v2p-tool .v2p-tool-icon {
    width: 16px;
    height: 16px;
}
.v2p-topic-actions {
    display: inline-flex;
    gap: 2px 10px;
}
.v2p-topic-preview-btn {
    cursor: pointer;
    font-size: 13px;
    color: var(--v2p-color-button-foreground);
    visibility: hidden;
    background-color: var(--v2p-color-button-background-hover);
    border: none;
    border-radius: 3px;
    outline: none;
}
.v2p-topic-ignore-btn {
    cursor: pointer;
    margin-left: 8px;
    visibility: hidden;
}
.v2p-topic-preview {
    font-size: 15px;
    line-height: 1.6;
    padding: var(--v2p-tp-preview-pd);
}
.v2p-tpr-loading {
    --tpr-h: 30px;
    --tpr-h-p: 22px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 25px;
}
.v2p-tpr-loading .v2p-tpr {
    background-color: var(--v2p-color-bg-tpr);
    border-radius: 5px;
}
.v2p-tpr-loading .v2p-tpr-info {
    display: flex;
    gap: 15px;
    align-items: center;
}
.v2p-tpr-info-avatar {
    width: var(--tpr-h);
    height: var(--tpr-h);
}
.v2p-tpr-info-text {
    width: 50%;
    height: var(--tpr-h);
}
.v2p-tpr-loading .v2p-tpr-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 15px 0 20px;
}
.v2p-tpr-loading .v2p-tpr-content .v2p-tpr-content-p {
    height: var(--tpr-h-p);
}
.v2p-tpr-loading .v2p-tpr-cmt {
    display: flex;
    gap: 15px;
    padding-top: 15px;
    border-top: 1px solid var(--v2p-color-border);
}
.v2p-tpr-loading .v2p-tpr-cmt .v2p-tpr-cmt-avatar {
    width: 50px;
    height: 50px;
}
.v2p-tpr-loading .v2p-tpr-cmt .v2p-tpr-cmt-right {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 10px;
}
.v2p-tpr-loading .v2p-tpr-cmt .v2p-tpr-cmt-right .v2p-tpr-cmt-header {
    width: 50%;
    height: var(--tpr-h);
}
.v2p-tpr-loading .v2p-tpr-cmt .v2p-tpr-cmt-right .v2p-tpr-cmt-p {
    height: var(--tpr-h-p);
}
.v2p-tp-info-bar {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-bottom: 10px;
}
.v2p-tp-info,
.v2p-tp-read {
    overflow: hidden;
    display: inline-flex;
    gap: 20px;
    align-items: center;
    padding: 5px 10px;
    font-size: 13px;
    background-color: var(--v2p-color-button-background);
    border-radius: 5px;
}
.v2p-tp-read {
    cursor: pointer;
    user-select: none;
    gap: 4px;
}
.v2p-tp-read:hover {
    background-color: var(--v2p-color-button-background-hover);
}
.v2p-tp-read-icon {
    width: 16px;
    height: 16px;
}
.v2p-tp-member {
    display: inline-flex;
    gap: 5px;
    align-items: center;
    font-weight: bold;
}
.v2p-tp-avatar {
    width: 20px;
    height: 20px;
    background-color: var(--v2p-color-bg-avatar);
    border-radius: 3px;
}
.v2p-topic-preview-addons {
    margin-top: 30px;
}
#Main.v2p-topic-preview > .box {
    border: 1px solid var(--v2p-color-border);
}
a.v2p-topic-preview-title-link:hover {
    text-decoration: underline 1.5px;
    text-underline-offset: 0.46ex;
}
.v2p-dot {
    margin: 0 8px;
    font-size: 15px;
    font-weight: 800;
}
.v2p-paging {
    background: none !important;
}
.v2p-paging.cell {
    border-bottom: none;
}
.v2p-modal-mask {
    position: fixed;
    z-index: var(--zidx-modal-mask);
    inset: 0;
    overflow: hidden;
    overflow-y: auto;
    padding: min(2vh, 60px);
    background-color: var(--v2p-color-mask);
}
.v2p-popup {
    font-size: 14px;
    background: var(--v2p-color-bg-widget);
    backdrop-filter: blur(16px);
    border: 1px solid var(--box-border-color);
    border-radius: 8px;
    box-shadow: var(--v2p-widget-shadow);
    position: absolute;
    z-index: var(--zidx-popup);
    top: 0;
    left: 0;
}
.v2p-popup-content {
    overflow-y: auto;
    width: max-content;
}
.v2p-toast {
    position: fixed;
    z-index: var(--zidx-toast);
    top: 50px;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 15px;
    font-size: 14px;
    color: var(--v2p-color-background);
    background: var(--v2p-color-foreground);
    border-radius: 8px;
    box-shadow: var(--v2p-toast-shadow);
}
.v2p-modal-main {
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: 800px;
    height: 100%;
    margin: 0 auto;
    background-color: var(--v2p-color-bg-content);
    border-radius: var(--box-border-radius);
}
.v2p-modal-header {
    display: flex;
    gap: 0 20px;
    align-items: center;
    padding: 15px 20px 20px;
    background-color: var(--v2p-color-bg-content);
    border-bottom: 1px solid var(--box-border-color);
}
.v2p-modal-title {
    overflow: hidden;
    padding: 2px 0;
    font-size: 16px;
    font-weight: bold;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.v2p-modal-actions {
    display: flex;
    gap: 0 10px;
    align-items: center;
    margin-left: auto;
}
.v2p-modal-content {
    position: relative;
    overflow-y: auto;
    overscroll-behavior-y: contain;
    flex: 1;
    outline: none;
}
.v2p-modal-content #Main.v2p-topic-preview > .box {
    border: none;
    box-shadow: none;
}
.v2p-modal-comments {
    position: absolute;
    inset: 0;
    overflow-y: auto;
    padding: 0 20px;
    visibility: hidden;
}
.v2p-modal-comments.v2p-tab-content-active {
    z-index: 20;
    visibility: visible;
}
.v2p-modal-comment-tabs {
    display: flex;
    gap: 4px;
    align-items: center;
    padding: 4px 5px;
    font-size: 14px;
    font-weight: normal;
    background-color: var(--button-background-color);
    border-radius: 4px;
}
.v2p-modal-comment-tabs > [data-tab-key] {
    cursor: pointer;
    padding: 4px 5px;
    border-radius: 4px;
}
.v2p-modal-comment-tabs > [data-tab-key]:hover {
    background-color: var(--v2p-color-button-background-hover);
}
.v2p-modal-comment-tabs > [data-tab-key].v2p-tab-active {
    color: var(--v2p-color-foreground);
    background-color: var(--v2p-color-accent-100);
}
.v2p-no-pat {
    padding: 30px 20px;
    font-size: 15px;
    text-align: center;
}
.v2p-no-pat .v2p-no-pat-title {
    font-size: 16px;
    font-weight: bold;
}
.v2p-no-pat .v2p-no-pat-desc {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 15px;
}
.v2p-no-pat .v2p-no-pat-block {
    display: inline-flex;
    align-items: center;
    margin: 0 5px;
    padding: 2px 10px;
    background-color: var(--v2p-color-bg-block);
    border-radius: 2px;
}
.v2p-no-pat .v2p-no-pat-steps {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    max-width: 800px;
    margin-top: 20px;
    padding: 20px;
    background-color: var(--v2p-color-bg-block);
    border-radius: 10px;
}
.v2p-no-pat .v2p-no-pat-step {
    flex: 1;
}
.v2p-no-pat .v2p-no-pat-img {
    width: 100%;
    border-radius: 8px;
    box-shadow: var(--v2p-widget-shadow);
}
.v2p-no-pat .v2p-icon-logo {
    width: 15px;
    height: 15px;
}
.v2p-likes-box {
    user-select: none;
    position: relative;
    top: 3px;
    display: inline-flex;
    column-gap: 5px;
    align-items: center;
}
.v2p-likes-box.v2p-thanked {
    font-weight: bold;
    color: var(--v2p-color-heart);
    opacity: 0.8;
}
.v2p-likes-box.v2p-thanked .v2p-icon-heart svg {
    fill: var(--v2p-color-heart);
}
@supports not selector(:has(*)) {
    #Main .cell[id^="r"] > table:hover .v2p-controls {
        opacity: 1;
    }
}
@supports selector(:has(*)) {
    #Main .cell[id^="r"]:not(:has(.cell:hover)) > table:hover .v2p-auto-hide {
        width: auto;
    }
    #Main .cell[id^="r"]:not(:has(.cell:hover)) > table:hover .v2p-controls {
        opacity: 1;
    }
}
.v2p-controls {
    display: inline-flex;
    column-gap: 15px;
    margin-right: 15px;
    font-size: 12px;
    opacity: 0;
}
.v2p-controls svg {

    opacity: 1 !important;    /* 保证颜色一致 */
}
.v2p-controls > a {
    text-decoration: none;
}
.v2p-control {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 16px;
    height: 16px;
    padding: 4px 0;
    color: var(--v2p-color-font-tertiary);
}
.v2p-control::after {
    pointer-events: none;
    z-index: var(--zidx-tip);
    overflow: hidden;
    width: max-content;
    min-width: 30px;
    padding: 2px 5px;
    font-size: 12px;
    color: var(--v2p-color-foreground);
    text-align: center;
    white-space: nowrap;
    background-color: var(--v2p-color-bg-tooltip);
    border-radius: 4px;
    box-shadow: var(--v2p-widget-shadow);
    position: absolute;
    top: -8px;
    transform: translateY(-100%);
    opacity: 0;
}
.v2p-control:hover {
    color: var(--v2p-color-font-secondary);
}
.v2p-control.v2p-thanked {
    cursor: default;
    color: var(--v2p-color-heart);
}
.v2p-control:hover::after {
    opacity: 1;
}
.v2p-control.v2p-control-hide::after {
    content: "\u9690\u85CF\u56DE\u590D";
}
.v2p-control.v2p-control-thank::after {
    content: "\u611F\u8C22\u56DE\u590D";
}
.v2p-control.v2p-control-thank.v2p-thanked::after {
    content: "\u5DF2\u611F\u8C22";
}
.v2p-control.v2p-control-reply::after {
    content: "\u56DE\u590D";
}
.topic_buttons .v2p-tb.v2p-hover-btn {
    color: var(--v2p-color-font-secondary);
}
.topic_buttons .v2p-tb.v2p-hover-btn::after {
    display: none;
}
.topic_buttons .v2p-tb.v2p-hover-btn:hover {
    color: currentColor;
}
.v2p-tb-icon {
    width: 15px;
    height: 15px;
}
.v2p-emoji-container {
    overflow-y: auto;
    max-height: 285px;
    padding: 15px 18px;
    color: var(--v2p-color-font-secondary);
}
.v2p-member-card {
    max-width: 300px;
    max-height: 285px;
    padding: 12px;
    font-size: 13px;
    text-align: left;
}
.v2p-member-card .v2p-info {
    display: flex;
    gap: 15px;
}
.v2p-member-card .v2p-info-right {
    padding: 2px 0;
}
.v2p-member-card .v2p-avatar-box {
    overflow: hidden;
    display: inline-block;
    width: 73px;
    height: 73px;
    background-color: var(--button-background-hover-color);
    border-radius: 5px;
}
.v2p-member-card .v2p-avatar {
    width: 100%;
    height: 100%;
}
.v2p-member-card .v2p-username {
    font-size: 16px;
    font-weight: bold;
}
.v2p-member-card .v2p-no {
    margin: 5px 0;
}
.v2p-member-card .v2p-no,
.v2p-member-card .v2p-created-date {
    width: 160px;
    height: 16px;
}
.v2p-member-card .v2p-loading {
    background-color: var(--button-background-hover-color);
    border-radius: 4px;
}
.v2p-member-card .v2p-bio {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    line-height: 1.4;
    margin-top: 10px;
}
.v2p-member-card-actions {
    padding: 10px 0 0;
}
.v2p-reply-tags {
    cursor: pointer;
    display: inline-flex;
    margin: 0 0 2px;
    padding: 0 3px;
    font-size: 12px;
    background-color: var(--button-background-hover-color);
    border-radius: 3px;
}
.v2p-reply-tags-inline {
    overflow: hidden;
    max-width: 300px;
    margin: 0 5px 0 0;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.v2p-emoticons-box {
    font-size: 15px;
}
.v2p-emoji-group ~ .v2p-emoji-group {
    margin-top: 10px;
}
.v2p-emoji-title {
    margin: 0 0 10px;
    font-size: 14px;
    text-align: left;
}
.v2p-emoji-list {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 5px;
    font-size: 20px;
}
.v2p-emoji {
    cursor: pointer;
    height: 20px;
    padding: 3px;
    line-height: 20px;
    border-radius: 4px;
}
.v2p-emoji:hover {
    background-color: var(--box-background-hover-color);
}
.v2p-emoji > img {
    height: 100%;
}
.v2p-decode {
    cursor: copy;
    position: relative;
    padding: 2px 4px;
    font-size: 13px;
    color: var(--v2p-color-orange-400);
    text-decoration: none;
    background-color: var(--v2p-color-orange-50);
}
.v2p-decode::after {
    pointer-events: none;
    z-index: var(--zidx-tip);
    overflow: hidden;
    width: max-content;
    min-width: 30px;
    padding: 2px 5px;
    font-size: 12px;
    color: var(--v2p-color-foreground);
    text-align: center;
    white-space: nowrap;
    background-color: var(--v2p-color-bg-tooltip);
    border-radius: 4px;
    box-shadow: var(--v2p-widget-shadow);
    content: attr(data-title);
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translate(-50%, -100%);
    opacity: 0;
}
.v2p-decode:hover {
    color: var(--v2p-color-orange-400);
}
.v2p-decode:hover::after {
    opacity: 1;
}
.v2p-reply-content {
    position: relative;
}
.v2p-reply-content .v2p-expand-btn.normal.button {
    position: absolute;
    z-index: var(--zidx-expand-btn);
    bottom: 5px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;
    font-weight: 400;
}
.v2p-reply-content.v2p-collapsed::before {
    pointer-events: none;
    content: "";
    position: absolute;
    z-index: var(--zidx-expand-mask);
    right: 0;
    bottom: 0;
    left: 0;
    height: 130px;
    background: linear-gradient(to top, var(--bg-reply) 10px, transparent);
}
.v2p-reply-content.v2p-collapsed .reply_content a,
.v2p-reply-content.v2p-collapsed .reply_content .embedded_video {
    pointer-events: none;
}
.v2p-reply-content.v2p-collapsed .v2p-expand-btn.normal.button {
    bottom: 10px;
    transform: translateX(-50%);
}
.cell[id^="r"] .cell[id^="r"] .v2p-reply-content .v2p-expand-btn.normal.button {
    color: var(--v2p-color-button-foreground);
    background: var(--v2p-color-button-background-hover);
    box-shadow: var(--button-hover-shadow);
}
.v2p-empty-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 20px;
    font-size: 14px;
    color: var(--v2p-color-font-secondary);
}
.v2p-empty-content .v2p-text-emoji {
    font-size: 20px;
}
.v2p-topic-reply-ref {
    margin: 0 -10px 15px;
    padding: 5px 10px;
    font-size: 13px;
    color: var(--v2p-color-font-tertiary);
    background-color: var(--v2p-color-bg-block);
    border-radius: 5px;
}
.v2p-topic-reply-box {
    margin-top: 50px;
    padding: 30px 0;
    font-size: 14px;
    line-height: 1.55;
    color: var(--v2p-color-font-secondary);
    border-top: 1px solid var(--v2p-color-divider);
}
.v2p-topic-reply ~ .v2p-topic-reply {
    margin-top: 15px;
}
.v2p-topic-reply-member {
    display: inline;
    font-weight: bold;
    color: var(--v2p-color-main-700);
}
.v2p-topic-reply-avatar {
    position: relative;
    top: 2px;
    overflow: hidden;
    width: 15px;
    height: 15px;
    margin-right: 5px;
    object-fit: cover;
    background-color: var(--v2p-color-bg-avatar);
    border-radius: 2px;
}
.v2p-topic-reply-content {
    display: inline;
}
.v2p-topic-reply-tip {
    margin-top: 20px;
    font-size: 13px;
    color: var(--v2p-color-font-quaternary);
    text-align: center;
}
.v2p-reply-wrap {
    resize: none;
    overflow: hidden;
    height: unset;
    margin-bottom:10px;
    min-height: 140px !important;
    max-height: 800px !important;
    font-size: 15px;
    color: currentColor;
    background-color: var(--v2p-color-bg-input);
    border: 1px solid var(--button-border-color);
    border-radius: 8px;
    transition: opacity 0.25s;
}
.v2p-reply-wrap::placeholder {
    font-size: 15px;
    color: var(--v2p-color-font-tertiary);
}
.v2p-reply-wrap:is(:focus, :focus-within) {
    background-color: rgba(0, 0, 0, 0);
    outline: none;
    box-shadow: 0 0 0 1px var(--button-border-color);
}
.v2p-reply-wrap #reply_content {
    background-color: rgba(0, 0, 0, 0);
    border: none;
}
.v2p-reply-wrap #reply_content::placeholder {
    font-size: 14px;
    color: var(--v2p-color-font-tertiary);
}
.v2p-reply-wrap #reply_content:focus {
    background-color: var(--v2p-color-bg-content);
    outline: none;
}
.v2p-reply-upload-bar {
    cursor: pointer;
    padding: 6px 10px;
    font-size: 12px;
    color: var(--v2p-color-font-tertiary);
    background-color: var(--v2p-color-bg-input);
    border-top: 1px dashed var(--v2p-color-border-darker);
}
.v2p-reply-upload-bar-disabled {
    pointer-events: none;
}
.v2p-footer {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 35px 10px 20px;
    font-size: 12px;
    color: var(--v2p-color-font-tertiary);
    border-top: 1px solid var(--v2p-color-divider);
}
.v2p-footer a:hover {
    text-decoration: none;
}
.v2p-footer-logo {
    --logo-size: 16px;
    position: absolute;
    top: calc(-1 * (var(--logo-size) + 5px) / 2);
    left: 50%;
    transform: translateX(-50%);
    display: inline-flex;
    box-sizing: border-box;
    padding: 3px 25px;
    background-color: var(--v2p-color-bg-footer);
}
.v2p-footer-logo svg {
    width: var(--logo-size);
}
.v2p-footer-text {
    display: inline-flex;
    align-items: center;
    justify-content: flex-start;
    width: 240px;
    color: var(--v2p-color-font-secondary);
}
.v2p-footer-links {
    display: inline-flex;
    gap: 0 8px;
    align-items: center;
}
.v2p-footer-link {
    padding: 4px 5px;
    color: currentColor;
}
.v2p-footer-brand {
    display: inline-flex;
    gap: 0 15px;
    align-items: center;
    justify-content: flex-end;
    width: 240px;
}
.v2p-footer-brand .v2p-github-ref {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    padding: 2px 0;
}
.v2p-color-mode-toggle {
    width: 22px;
    height: 22px;
    opacity: 0.8;
}
.v2p-color-mode-toggle:hover {
    opacity: 1;
}
.v2p-reply-tabs {
    display: flex;
    gap: 0 6px;
    align-items: center;
    font-size: 14px;
}
.v2p-reply-tabs .v2p-reply-tab {
    cursor: pointer;
    padding: 2px 3px;
}
.v2p-reply-tabs .v2p-reply-tab.active {
    text-decoration: underline;
    text-decoration-color: var(--v2p-color-font-tertiary);
    text-decoration-thickness: 2px;
    text-underline-offset: 4px;
}
.v2p-select-dropdown {
    padding: 5px;
    font-size: 12px;
    border-radius: 5px;
}
.v2p-select-item {
    cursor: pointer;
    padding: 5px 10px;
    white-space: nowrap;
    border-radius: 4px;
}
.v2p-select-item:hover {
    background-color: var(--v2p-color-button-background-hover);
}
.v2p-select-item.v2p-select-item-active {
    background-color: var(--v2p-color-accent-50);
}
.v2p-preview-retry,
.v2p-topic-preview-retry,
a.v2p-preview-retry,
a.v2p-topic-preview-retry,
a:link.v2p-preview-retry,
a:link.v2p-topic-preview-retry {
    text-decoration: underline 1px;
    text-underline-offset: var(--v2p-underline-offset);
    cursor: pointer;
}
.v2p-indent .v2p-member-ref {
    display: none;
}
.v2p-member-ref + br {
    display: none;
}
.v2p-member-ref + br + b {
    display: none;
}
.v2p-member-ref.v2p-member-ref-show {
    display: inline;
}
.v2p-layout-toggle {
    display: inline-block;
    width: 18px;
    height: 18px;
    padding: 4px 2px;
    color: var(--v2p-color-font-tertiary);
}
.v2p-content-layout.v2p-content-layout {
    max-width: 2000px;
}
.v2p-content-layout.v2p-content-layout .v2p-horizontal-layout {
    display: flex;
    flex-wrap: wrap;
    gap: var(--v2p-layout-column-gap);
}
.v2p-left-side {
    flex: 1;
}
.v2p-left-side > .box {
    position: sticky;
    top: var(--v2p-layout-row-gap);
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 2 * var(--v2p-layout-row-gap));
}
.v2p-left-side > .box > .header {
    flex-shrink: 0;
}
.v2p-left-side .v2p-left-side-content {
    overflow: auto;
    flex: 1;
    border-bottom: 1px solid var(--box-border-color);
}
.v2p-right-side {
    flex: 1;
}
.v2p-register-days {
    display: inline-flex;
    align-items: center;
    margin-left: 2px;
    padding: 0 2px;
    color: var(--v2p-color-orange-400);
    background-color: var(--v2p-color-orange-100);
    border-radius: 2px;
}
.v2p-register-days.v2p-register-days-large {
    display: inline-flex;
    margin-left: 10px;
    padding: 2px 5px;
    font-size: 16px;
    line-height: 1.4;
    border-radius: 4px;
}
.v2p-topics-hot-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 50px 0;
    color: currentColor;
}
.v2p-topics-hot-loading .v2p-icon-loading {
    width: 40px;
}
.v2p-topics-hot-header {
    display: flex;
    align-items: center;
}
.v2p-topics-hot-picker {
    cursor: pointer;
    display: inline-flex;
    gap: 4px;
    align-items: center;
    margin-left: auto;
    padding: 1px 6px;
    font-size: 13px;
    background-color: var(--v2p-color-button-background);
    border-radius: 4px;
}
.v2p-topics-hot-picker:hover {
    background-color: var(--v2p-color-button-background-hover);
}
.v2p-topics-hot-icon {
    position: relative;
    top: -2px;
    width: 1em;
    height: 1em;
}
.v2p-tag-block {
    margin-bottom: 10px;
}
@supports (filter: blur(6px)) {
    .v2p-hide-account {
        opacity: 0.5;
        filter: blur(6px);
    }
}
@supports not (filter: blur(6px)) {
    .v2p-hide-account {
        opacity: 0;
    }
}
@supports (filter: blur(6px)) {
    .v2p-hide-balance {
        opacity: 0.5;
        filter: blur(6px);
    }
    .v2p-hide-balance:hover {
        opacity: 1;
        filter: none;
    }
}
@supports not (filter: blur(6px)) {
    .v2p-hide-balance {
        opacity: 0;
    }
    .v2p-hide-balance:hover {
        opacity: 1;
    }
}
.v2p-member-name {
    display: flex;
    align-items: center;
}
.v2p-settings-header.page-content-header {
    gap: 10px;
}
.v2p-settings-header.page-content-header .v2p-settings-icon {
    width: 40px;
    height: 40px;
    margin: 0;
}
.v2p-settings-header.page-content-header .v2p-settings-title {
    padding: 0;
    white-space: nowrap;
}
.v2p-settings-header.page-content-header .v2p-settings-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
}
.v2p-link-preview-btn {
    cursor: pointer;
    user-select: none;
    display: inline-flex;
    height: 100%;
    margin-left: 5px;
    padding: 0 5px;
    font-size: 12px;
    color: var(--v2p-color-bg-content);
    background-color: var(--v2p-color-accent-500);
    border-radius: 3px;
}
.v2p-link-preview-btn:hover {
    background-color: var(--v2p-color-accent-600);
}
#site-header #site-header-menu #menu-entry {
    border-radius:999px;
    }

#node_sidebar.v2p-node-sidebar-flamewar {
    background-color: var(--v2p-color-orange-50);
    border: var(--v2p-color-orange-50);
    border-radius: var(--v2p-box-radius);
}
.v2p-mobile .content {
    padding: 0 !important;
    }
.v2p-mobile #site-header #site-header-menu #menu-body {
    border-radius:18px !important;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
    border: var(--v2p-color-orange-50);

}
.v2p-mobile .v2p-likes-box {
    vertical-align: middle !important;
    top:0;
}
.v2p-mobile a.dark {
    font-weight:bold;
    font-size:12px;
    }
.v2p-mobile #site-header #site-header-menu #menu-body a {
    font-size:14px !important;
}
.v2p-mobile #Tabs a {
    font-size:13px !important;
    border-radius:999px;
    margin:2px;
    }
.v2p-mobile #search-container {
    border-radius:18px !important;
    }
.v2p-mobile .box .header > h1 {
    font-size: 16px !important;
    }
.v2p-mobile .box .header {
    font-size: 12px !important;
    }
.v2p-mobile a.op, .v2p-mobile a.tag .v2p-mobile .no {
    border-radius:999px !important;
    padding:2px 6px;
    font-size:11px;
    }
.v2p-mobile .mll {
    font-size: 16px;
}

.v2p-mobile .mll::placeholder {
    font-size: 16px !important;
}

.v2p-mobile form table td:first-child {
    width: 100px !important;

}


/* 只把“内容那一格”变成 flex，不影响右边计数 */
.v2p-mobile .cell.item td:nth-child(3) {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
}

/* 去掉两块空白行 */
.v2p-mobile .cell.item td:nth-child(3) > .sep5 {
    display: none;
}

/* 主题标题：排第一行，占满整行 */
.v2p-mobile .cell.item td:nth-child(3) > .item_title {
    order: 1;
    width: 100%;
    display: block;
    padding:3px 0;
}

/* 第一行 small fade（节点 + 作者）→ 合并行左侧 */
.v2p-mobile .cell.item td:nth-child(3) > span.small.fade:first-of-type {
    order: 2;
    display: inline;
    margin-top:8px;
}
.v2p-mobile .cell.item td:nth-child(3) > span.small.fade:last-of-type {
    display: none !important;
}
/* 第二个 small fade（时间 + 最后回复）→ 合并行右侧 */
.v2p-mobile .cell.item td:nth-child(3) > span.small.fade:last-of-type {
    order: 3;
    display: inline;
    margin-left: .5em;
}



.v2p-mobile #site-header {
    background-color:transparent !important;
    border-bottom:none !important;
    height: 50px;
    padding:10px;
    margin:auto;
    max-width:1000px;
    }
.v2p-mobile .box {
    border-radius: 0 !important;
    padding:5px 15px !important;
    margin: 0 0 10px 0;

}
.v2p-mobile .cell {
    padding:5px 8px !important;
}
.v2p-mobile .cell.item table tr > td:last-child {

    min-width: 30px !important;
    vertical-align: top !important;
}

.v2p-mobile .cell.item table tr > td[width="70"] {
    width:35px !important;
}
.v2p-mobile .item_title {
font-size:15px;
}
.v2p-mobile .topic_content {
    font-size:15px;
    line-height:1.5;
}
.v2p-mobile #topic-tip-box {
display:none;
}
#reply-box .cell {
border:none;
}
.v2p-mobile #no-comments-yet {
background-color:var(--v2p-color-bg-content);
margin: 0 auto 10px auto;
box-shadow: var(--v2p-box-shadow);
border:none;
color: var(--box-foreground-color);
width:50%;
align:center;
}
.v2p-mobile .avatar {
    width: 30px !important;
    max-height: 30px !important;
    border-radius: 50%;
    object-fit: cover;
    overflow: hidden;
    margin:0;
}
.v2p-mobile .cell .avatar {
    margin-top:5px;
}
.v2p-mobile a.node {
    font-size:11px !important;
    }
.v2p-mobile .small a {
    font-weight:500;
}
.v2p-mobile .small {
    font-size:11px;
}
.v2p-mobile small.gray a {
    font-weight:bold;
}

.v2p-mobile .v2p-reply-wrap #reply_content {
    height:110px !important;
    }
.v2p-mobile a.count_livid:active, .v2p-mobile a.count_livid:link, a.count_livid:visited {
    padding: 3px !important;
    font-size: 10px;
    font-weight: normal;
    border-radius: 999px !important;
    display: inline-flex;          /* 支持自动居中 + 自适应 */
    align-items: center;           /* 垂直居中 */
    justify-content: center;       /* 水平居中 */
    min-width: 10px;               /* 最小宽度，确保初始为圆形 */
    height: 10px;                  /* 高度固定，这很关键 */
    padding: 0px;
    background-color: var(--button-background-color) !important;
    color: var(--button-foreground-color) !important;
    }

    /* ==== 移动端 Tabs 横向滚动设置 ==== */
.v2p-mobile #Main #Tabs,
.v2p-mobile #Tabs {
    display: flex;
    flex-wrap: nowrap;          /* 不换行，所有 tab 在一行 */
    overflow-x: auto;           /* 横向可滚动 */
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;  /* 惯性滚动 */
    scrollbar-width: none;      /* Firefox 隐藏滚动条 */
}

/* WebKit 浏览器隐藏滚动条 */
.v2p-mobile #Main #Tabs::-webkit-scrollbar,
.v2p-mobile #Tabs::-webkit-scrollbar {
    display: none;
}

/* 每个 Tab 固定为内容宽度，避免被压缩 */
.v2p-mobile #Tabs .tab,
.v2p-mobile #Tabs .tab_current {
    flex: 0 0 auto;
}
.v2p-mobile .fr {
  display: inline-flex;
  align-items: center;
  gap: 2px; /* 按钮之间的横向间距，可按需调整 */
}

/*处理详情页header内容排版 */
/* 1. 设置父容器为相对定位，作为定位基准 */
.v2p-mobile .header {
    position: relative;
    display: block; /* 确保是块级显示 */
}

/* 2. 处理头像 (.fr)
   将其从右上角移除，改为绝对定位到左侧“第二行”的位置 */
.v2p-mobile .header > .fr {
    float: none;        /* 取消原有的向右浮动 */
    position: absolute; /* 绝对定位 */
    top: 36px;
    left: 8px;        /* 靠左对齐，数值取决于 header 的 padding */
    margin: 0;          /* 清除可能存在的 margin */
}

/* 3. 处理导航链接 (无需特殊 CSS，它们会自动回到第一行左侧)
   因为头像变成了 absolute，导航链接自然占据了文档流的最开始位置 */

/* 4. 处理标题 (h1)
   给左侧增加内边距，防止文字叠在头像上，形成“左图右文”效果 */
.v2p-mobile .header > h1 {
    margin: 15px 0 0 0;   /* 在导航和标题之间增加间距 */
    padding-left: 40px; /* 【核心】左侧留白 = 头像宽度(36px) + 间距 */
    display: block;
}

/* 5. 处理底部元数据 (small)
   同样左侧留白，并强制换行显示在标题下方 */
.v2p-mobile .header > small {
    display: block;     /* 确保独占一行 */
    padding-left: 40px; /* 对齐标题 */
    margin-top: 5px;    /* 微调间距 */
}

/* 6. 隐藏原有的分割线 (可选，为了布局更紧凑) */
.v2p-mobile .header > .sep {
    display: none;
}
.v2p-mobile .cell > table > tbody > tr > td:first-child {
width:30px !important;
}
.v2p-mobile #notifications .cell > table > tbody > tr > td:nth-child(2) {
    padding-left:10px !important;
}
.v2p-mobile .v2p-indent {
    background-color: var(--bg-reply);
    border-left: 2px solid var(--v2p-color-border-darker);
    border-top: 1px solid var(--v2p-color-border-darker);
    --bg-reply: var(--v2p-color-bg-reply);
    position: relative;
    z-index: var(--zidx-expand-btn);
    padding: var(--v2p-tp-nested-pd);
    border-radius: 10px;
    margin: 10px 0 0 5px;
}
/* 让 svg 图标统一垂直对齐 */
.v2p-mobile .fr svg {
  vertical-align: middle !important;
}
#LogoMobile {
background-image: url("https://raw.githubusercontent.com/thinktip/V2ex-Polish-Plus/refs/heads/main/v2ex%402x.svg") !important;
}
/* 深色模式下反转 Logo 颜色 */
html.Night #site-header-logo #LogoMobile {
    filter: invert(1) brightness(1.2) contrast(1.1);
}
@media (min-width: 600px) {
    .v2p-mobile .box {
        border-radius: 18px !important;
    }
}
`;

  // 尽早注入 CSS
  if (typeof GM_addStyle !== "undefined") {
    GM_addStyle(style);
  } else {
    // 理论上油猴一定有 GM_addStyle，这里只是兜底
    const el = document.createElement("style");
    el.type = "text/css";
    el.textContent = style;
    (document.head || document.documentElement).appendChild(el);
  }

    // ========= 2. 主题模式 & 类名处理 =========
  // 依次：亮色 → 晨光 → 水色 → 暗色 → 跟随系统
  const THEME_MODES = ["light", "dawn", "aqua", "dark", "auto"];

  const STORAGE_KEY = "user_preferred_theme_mode";
  const TOGGLE_SELECTOR = ".v2p-color-mode-toggle";

  // 记录站点原生的 SITE_NIGHT（0: 浅色, 1: 深色）
  let nativeNight = null;

  // 检测当前页原生的深色 / 浅色状态：
  // 1) 优先用第一个 IIFE 写入的 window.__V2P_NATIVE_NIGHT__
  // 2) 其次看 <link> 里是 tomorrow.css 还是 tomorrow-night.css
  // 3) 再不行就扫一遍 <script> 里的 SITE_NIGHT
    function detectNativeNight() {
    if (nativeNight !== null) return nativeNight;

    // 0. 如果前面的 MutationObserver 已经写好了，就直接用
    if (typeof window !== "undefined" && typeof window.__V2P_NATIVE_NIGHT__ === "number") {
      nativeNight = window.__V2P_NATIVE_NIGHT__;
      return nativeNight;
    }

    try {
      // 1. 看 Wrapper / body / html 有没有 Night 类（有些页面 / 移动端会这么标）
      const wrapper = document.getElementById("Wrapper");
      const body = document.body;
      const docEl = document.documentElement;

      if (wrapper && wrapper.classList.contains("Night")) {
        nativeNight = 1;
        return nativeNight;
      }
      if (body && body.classList.contains("Night")) {
        nativeNight = 1;
        return nativeNight;
      }
      if (docEl && docEl.classList.contains("Night")) {
        nativeNight = 1;
        return nativeNight;
      }

      // 2. 看代码高亮的 CSS，是 tomorrow 还是 tomorrow-night
      const head = document.head || document.documentElement;
      if (head) {
        const link = head.querySelector(
          'link[href*="tomorrow-night.css"], link[href*="tomorrow.css"]',
        );
        if (link) {
          const href = link.getAttribute("href") || "";
          if (href.includes("tomorrow-night.css")) {
            nativeNight = 1;
            return nativeNight;
          }
          if (href.includes("tomorrow.css")) {
            nativeNight = 0;
            return nativeNight;
          }
        }
      }

      // 3. 扫一遍 <script> 里的 SITE_NIGHT = 0/1
      const scripts = document.querySelectorAll("script");
      for (const s of scripts) {
        const txt = s.textContent || "";
        const m = txt.match(/SITE_NIGHT\s*=\s*(\d)/);
        if (m) {
          nativeNight = Number(m[1]) === 1 ? 1 : 0;
          return nativeNight;
        }
      }

      // 4. 移动端顶栏的图标：<img class="site-theme-toggle mobile">
      // 一般规则是：当前是暗色 → 图标是“Light”；当前是亮色 → 图标是“Dark”
      const mobileToggleImg =
        document.querySelector("#menu-body img.site-theme-toggle.mobile") ||
        document.querySelector("img.site-theme-toggle");
      if (mobileToggleImg) {
        const src = mobileToggleImg.getAttribute("src") || "";
        const alt = (mobileToggleImg.getAttribute("alt") || "").toLowerCase();

        if (src.includes("toggle-light") || alt.includes("light")) {
          // 图标提示“切到 Light”，说明当前是 Dark
          nativeNight = 1;
          return nativeNight;
        }
        if (src.includes("toggle-dark") || alt.includes("dark")) {
          // 图标提示“切到 Dark”，说明当前是 Light
          nativeNight = 0;
          return nativeNight;
        }
      }
    } catch (err) {
      // ignore
    }

    // 实在判断不出来，就当成浅色
    nativeNight = 0;
    return nativeNight;
  }


    // 根据 isDark 同步：
  // 1) 请求原始的 night toggle URL，修改服务端 SITE_NIGHT
  // 2) 尽量把当前页面的 tomorrow*.css 也切到对应版本，避免代码高亮闪屏
  // 3) 同步移动端菜单里的图标
  function syncNativeNight(isDark) {
    const target = isDark ? 1 : 0;
    const current = detectNativeNight();
    if (current === target) return;

    nativeNight = target;

    // ① 通知服务端切换 SITE_NIGHT
    try {
      // 先按桌面端的选择器找
      let legacy = document.querySelector(
        "#Rightbar .light-toggle, #Top .light-toggle, .top .light-toggle",
      );

      // 如果是移动端，可能没有 light-toggle class，用 href 来兜底
      if (!legacy) {
        legacy = document.querySelector('a[href*="/settings/night/toggle"]');
      }

      const href = legacy && legacy.getAttribute("href");
      if (href) {
        fetch(href, { method: "GET", credentials: "include" }).catch(() => {});
      }
    } catch (err) {
      // ignore
    }

    // ② 同步当前页面的 tomorrow / tomorrow-night CSS（代码高亮）
    try {
      const head = document.head || document.documentElement;
      if (head) {
        const link = head.querySelector(
          'link[href*="tomorrow-night.css"], link[href*="tomorrow.css"]',
        );
        if (link) {
          const href = link.getAttribute("href") || "";
          if (target === 1) {
            // 切到 tomorrow-night.css
            if (href.includes("tomorrow.css") && !href.includes("tomorrow-night.css")) {
              link.href = href.replace("tomorrow.css", "tomorrow-night.css");
            }
          } else {
            // 切回 tomorrow.css
            if (href.includes("tomorrow-night.css")) {
              link.href = href.replace("tomorrow-night.css", "tomorrow.css");
            }
          }
        }
      }
    } catch (err) {
      // ignore
    }

    // ③ 同步移动端菜单里的图标显示
    try {
      const mobileToggleImg =
        document.querySelector("#menu-body img.site-theme-toggle.mobile") ||
        document.querySelector("img.site-theme-toggle");

      if (mobileToggleImg) {
        if (target === 1) {
          // 当前暗色 → 图标应该显示 Light
          mobileToggleImg.src = "/static/img/toggle-light.png";
          mobileToggleImg.alt = "Light";
        } else {
          // 当前亮色 → 图标应该显示 Dark
          mobileToggleImg.src = "/static/img/toggle-dark.png";
          mobileToggleImg.alt = "Dark";
        }
      }
    } catch (err) {
      // ignore
    }
  }


  // 缓存当前主题模式，减少对 localStorage 的访问
  let currentMode = null;

  function getSavedMode() {
    if (currentMode && THEME_MODES.includes(currentMode)) return currentMode;

    const raw = localStorage.getItem(STORAGE_KEY);
    if (THEME_MODES.includes(raw)) {
      currentMode = raw;
      return raw;
    }

    // 本地没有记录时，根据站点原生 SITE_NIGHT 决定初始模式：
    // SITE_NIGHT = 1 → 我们默认用 v2p-theme-dark-default
    // SITE_NIGHT = 0 → 默认用 v2p-theme-light-default
    const native = detectNativeNight();
    currentMode = native === 1 ? "dark" : "light";
    try {
      localStorage.setItem(STORAGE_KEY, currentMode);
    } catch (e) {}
    return currentMode;
  }



  function isSystemDark() {
    try {
      return (
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    } catch {
      return false;
    }
  }

  /**
   * 给元素应用主题类（返回当前是否为深色）
   */
  function applyThemeToElement(element, effectiveMode) {
    if (!element) return false;

    const cls = element.classList;
    const toRemove = [];

    cls.forEach((c) => {
      if (c.startsWith("v2p-theme-") || c === "Night") {
        toRemove.push(c);
      }
    });
    toRemove.forEach((c) => cls.remove(c));

    let isDark = false;
    switch (effectiveMode) {
      case "dark":
        cls.add("v2p-theme-dark-default", "Night");
        isDark = true;
        break;
      case "light":
        cls.add("v2p-theme-light-default");
        break;
      case "dawn":
        cls.add("v2p-theme-dawn");
        break;
      case "aqua":
        cls.add("v2p-theme-aqua");
        break;
      default:
        break;
    }
    return isDark;
  }

  /**
   * 同时确保 html 和 body 都应用主题
   */
  function ensureThemeOnBothElements(mode) {
    const html = document.documentElement;
    const body = document.body;
    const wrapper = document.getElementById("Wrapper"); // ★ 新增

    // 仅在 auto 模式下检测一次系统主题，避免重复调用 matchMedia
    let effectiveMode = mode;
    if (mode === "auto") {
      effectiveMode = isSystemDark() ? "dark" : "light";
    }

    let isDark = effectiveMode === "dark";

    if (html) applyThemeToElement(html, effectiveMode);
    if (body) applyThemeToElement(body, effectiveMode);
    if (wrapper) applyThemeToElement(wrapper, effectiveMode); // ★ 新增

    return isDark;
  }

  /**
   * 更新右侧切换按钮的文案/状态（可以按需求再优化文案）
   */
  function updateToggleButtons(mode, isDark) {
    const toggles = document.querySelectorAll(TOGGLE_SELECTOR);
    const nameMap = {
      light: "亮色",
      dark: "暗色",
      dawn: "晨光",
      aqua: "水蓝",
      auto: "跟随系统",
    };

    toggles.forEach((btn) => {
      btn.setAttribute("data-theme-mode", mode);
      btn.setAttribute("aria-pressed", isDark ? "true" : "false");

      const label = nameMap[mode] || "";
      if (label) {
        btn.setAttribute("aria-label", label);
        btn.title = label;
      }

      // ★ 移动端菜单里的图片按钮
      const mobileImg = btn.querySelector("img.site-theme-toggle.mobile");
      if (mobileImg) {
        if (isDark) {
          mobileImg.src = "/static/img/toggle-light.png";
          mobileImg.alt = "Light";
        } else {
          mobileImg.src = "/static/img/toggle-dark.png";
          mobileImg.alt = "Dark";
        }
        return;
      }

      // ① PC 端 / 顶部 .light-toggle：用 SVG 图标
      if (btn.classList.contains("light-toggle")) {
        btn.innerHTML = isDark
          ? '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>'
          : '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path></svg>';

        return;
      }

      // ② 其它纯文字按钮，用文字显示当前模式
      if (!btn.children.length) {
        if (!btn.dataset.originalLabel) {
          btn.dataset.originalLabel = btn.textContent || "";
        }
        btn.textContent = label || btn.dataset.originalLabel;
      }
    });
  }

  /**
   * 点击切换主题：按数组顺序循环
   */
  /**
   * 确保页面上存在主题切换按钮：
   * - 优先使用已经带有 .v2p-color-mode-toggle 的元素
   * - 否则复用 V2EX 右侧 / 顶部原生的 .light-toggle 按钮并加上 class
   */
  function ensureToggleButtons() {
    let toggles = document.querySelectorAll(TOGGLE_SELECTOR);
    if (toggles.length) return toggles;

    // ① PC 端 / 顶部原有的 light-toggle 按钮
    const legacyToggles = document.querySelectorAll(
      "#Rightbar .light-toggle, #Top .light-toggle, .top .light-toggle",
    );
    legacyToggles.forEach((el) => {
      el.classList.add("v2p-color-mode-toggle");
    });

    // ② 移动端菜单里的图片按钮：<img class="site-theme-toggle mobile">
    const mobileToggleImg = document.querySelector(
      "#menu-body img.site-theme-toggle.mobile",
    );
    if (mobileToggleImg) {
      const mobileBtn = mobileToggleImg.closest("a") || mobileToggleImg;

      // 让它也变成脚本识别的「主题按钮」
      mobileBtn.classList.add("v2p-color-mode-toggle", "light-toggle");

      // 删除原来的 img，交给 updateToggleButtons 注入 SVG
      mobileToggleImg.remove();
    }

    toggles = document.querySelectorAll(TOGGLE_SELECTOR);
    return toggles;
  }

  function bindToggleEvents() {
    const toggles = ensureToggleButtons();
    if (!toggles.length) return;

    const current = currentMode || getSavedMode();
    const isDark = ensureThemeOnBothElements(current);
    updateToggleButtons(current, isDark);
    syncNativeNight(isDark);

    toggles.forEach((btn) => {
      btn.addEventListener(
        "click",
        (e) => {
          e.preventDefault();
          e.stopPropagation();

          const cur = currentMode || getSavedMode();
          const idx = THEME_MODES.indexOf(cur);
          const nextIndex = idx === -1 ? 0 : (idx + 1) % THEME_MODES.length;
          const next = THEME_MODES[nextIndex];

          currentMode = next;
          localStorage.setItem(STORAGE_KEY, next);

          const dark = ensureThemeOnBothElements(next);
          updateToggleButtons(next, dark);
          // 当切到 v2p-theme-dark-default 时，通知原站进入夜间（SITE_NIGHT=1）
          // 其它几种浅色主题则同步到 SITE_NIGHT=0
          syncNativeNight(dark);
        },
        { passive: false },
      );
    });

    // 系统主题变化时，如果是 auto，就跟着变
    if (window.matchMedia) {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", () => {
        if ((currentMode || getSavedMode()) === "auto") {
          const dark = ensureThemeOnBothElements("auto");
          updateToggleButtons("auto", dark);
          syncNativeNight(dark);

        }
      });
    }
  }

  // ========= 3. 尽可能早地应用主题，减少“先默认再变色”的闪一下 =========

  // 初始化当前主题模式并尽可能早地应用，减少“先默认再变色”的闪烁
  currentMode = getSavedMode();
  // 先对 html / body 打类（即使 body 还没挂上来也问题不大）
  ensureThemeOnBothElements(currentMode);

  // body 还没出现时，用 MutationObserver 再补一刀
  if (!document.body) {
    const mo = new MutationObserver(() => {
      if (document.body) {
        ensureThemeOnBothElements(currentMode);
        mo.disconnect();
      }
    });
    mo.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  // ========= 4. 移动端 Tabs 横向滚动 & 位置记忆 =========
  function initMobileTabsScroll() {
    const body = document.body;
    if (!body || !body.classList.contains("v2p-mobile")) return;

    // Tabs 容器：兼容首页 / 其他页面
    const tabs = document.querySelector("#Main #Tabs, #Tabs");
    if (!tabs) return;

    const STORAGE_KEY = "v2p-mobile-tabs-scroll";

    // 针对不同页面生成一个 key，避免互相干扰
    const pageKey = (() => {
      const path = location.pathname || "/";
      const search = location.search || "";
      try {
        const params = new URLSearchParams(search);
        const tab = params.get("tab") || "";
        // 首页 tab 列表，用 tab 名区分；其他页面用路径
        return tab ? `home?tab=${tab}` : path;
      } catch {
        return path + search;
      }
    })();

    const fullKey = `${STORAGE_KEY}:${pageKey}`;

    // 恢复滚动位置或居中当前 tab
    const restoreOrCenter = () => {
      const saved = localStorage.getItem(fullKey);

      if (saved != null) {
        const val = Number(saved);
        if (!Number.isNaN(val)) {
          tabs.scrollLeft = val;
          return;
        }
      }

      // 没有保存记录时，让当前 tab 居中显示
      const current = tabs.querySelector(".tab_current");
      if (!current) return;

      const parentRect = tabs.getBoundingClientRect();
      const itemRect = current.getBoundingClientRect();
      const offset =
        itemRect.left -
        parentRect.left -
        (parentRect.width - itemRect.width) / 2;

      tabs.scrollLeft += offset;
    };

    // 等布局完成后再滚动，避免计算不准
    (window.requestAnimationFrame || setTimeout)(restoreOrCenter, 0);

    // 监听滚动，保存位置（用 rAF 做个简单节流）
    let ticking = false;
    tabs.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;

        (window.requestAnimationFrame || setTimeout)(() => {
          ticking = false;
          localStorage.setItem(fullKey, String(tabs.scrollLeft));
        }, 16);
      },
      { passive: true },
    );
  }

  // DOMReady 后再绑定按钮事件 + 监听 Wrapper 动态变化
  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  onReady(() => {
    bindToggleEvents();
    initMobileTabsScroll(); // ★ 新增：初始化移动端 Tabs 横向滚动 & 记忆
    // 监听主容器的 DOM 变化，防止部分页面局部刷新后主题类丢失
    const wrapper = document.getElementById("Wrapper");
    if (wrapper) {
      let reapplyScheduled = false;
      const mo = new MutationObserver(() => {
        // 使用 requestAnimationFrame 做简单节流，避免频繁重复执行
        if (reapplyScheduled) return;
        reapplyScheduled = true;
        (window.requestAnimationFrame || setTimeout)(() => {
          reapplyScheduled = false;
          ensureThemeOnBothElements(currentMode || getSavedMode());
        });
      });
      mo.observe(wrapper, {
        childList: true,
        subtree: true,
      });
    }
  });
})();
