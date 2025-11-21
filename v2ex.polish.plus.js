// ==UserScript==
// @name         V2eX - Polish+
// @version      4.2
// @description  V2ex Polish+
// @match        https://*.v2ex.com/*
// @match        https://v2ex.com/*
// @icon         https://v2ex.com/static/apple-touch-icon-180.png
// @run-at       document-start
// ==/UserScript==

"use strict";

var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) =>
  function __init() {
    return (fn && (res = (0, fn[__getOwnPropNames(fn)[0]])((fn = 0))), res);
  };

// src/contents/polyfill.ts
var init_polyfill = __esm({
  "src/contents/polyfill.ts"() {
    "use strict";
    {
      if (!window.requestIdleCallback) {
        window.requestIdleCallback = function (callback) {
          const start = Date.now();
          return setTimeout(function () {
            callback({
              didTimeout: false,
              timeRemaining: function () {
                return Math.max(0, 50 - (Date.now() - start));
              },
            });
          }, 1);
        };
      }
      if (!window.cancelIdleCallback) {
        window.cancelIdleCallback = function (id) {
          clearTimeout(id);
        };
      }
    }
  },
});

// src/constants.ts
var EXTENSION_NAME,
  emojiLinks,
  emoticons,
  READABLE_CONTENT_HEIGHT,
  MAX_CONTENT_HEIGHT,
  READING_CONTENT_LIMIT,
  dataExpiryTime,
  imgurClientIdPool,
  defaultOptions;
var init_constants = __esm({
  "src/constants.ts"() {
    "use strict";
    EXTENSION_NAME = "V2EX_Polish";
    emojiLinks = {
      // B 站表情。
      ["[\u8131\u5355doge]" /* 脱单doge */]: {
        ld: "https://i.imgur.com/L62ZP7V.png",
        hd: "https://i.imgur.com/3mPhudo.png",
      },
      ["[doge]" /* doge */]: {
        ld: "https://i.imgur.com/agAJ0Rd.png",
        hd: "https://i.imgur.com/HZL0hOa.png",
      },
      ["[\u8FA3\u773C\u775B]" /* 辣眼睛 */]: {
        ld: "https://i.imgur.com/n119Wvk.png",
        hd: "https://i.imgur.com/A5WXoZJ.png",
      },
      ["[\u7591\u60D1]" /* 疑惑 */]: {
        ld: "https://i.imgur.com/U3hKhrT.png",
        hd: "https://i.imgur.com/3gCygBS.png",
      },
      ["[\u6342\u8138]" /* 捂脸 */]: {
        ld: "https://i.imgur.com/14cwgsI.png",
        hd: "https://i.imgur.com/fLp3t8s.png",
      },
      ["[\u54E6\u547C]" /* 哦呼 */]: {
        ld: "https://i.imgur.com/km62MY2.png",
        hd: "https://i.imgur.com/CXXgF4E.png",
      },
      ["[\u50B2\u5A07]" /* 傲娇 */]: {
        ld: "https://i.imgur.com/TkdeN49.png",
        hd: "https://i.imgur.com/m7IlCrD.png",
      },
      ["[\u601D\u8003]" /* 思考 */]: {
        ld: "https://i.imgur.com/MAyk5GN.png",
        hd: "https://i.imgur.com/eRJTCx7.png",
      },
      ["[\u5403\u74DC]" /* 吃瓜 */]: {
        ld: "https://i.imgur.com/Ug1iMq4.png",
        hd: "https://i.imgur.com/Gy3nwkC.png",
      },
      ["[\u65E0\u8BED]" /* 无语 */]: {
        ld: "https://i.imgur.com/e1q9ScT.png",
        hd: "https://i.imgur.com/wMfcBqD.png",
      },
      ["[\u5927\u54ED]" /* 大哭 */]: {
        ld: "https://i.imgur.com/YGIx7lh.png",
        hd: "https://i.imgur.com/SNHJxtv.png",
      },
      ["[\u9178\u4E86]" /* 酸了 */]: {
        ld: "https://i.imgur.com/5FDsp6L.png",
        hd: "https://i.imgur.com/wnQBodT.png",
      },
      ["[\u6253call]" /* 打call */]: {
        ld: "https://i.imgur.com/pmNOo2w.png",
        hd: "https://i.imgur.com/4GfTlV0.png",
      },
      ["[\u6B6A\u5634]" /* 歪嘴 */]: {
        ld: "https://i.imgur.com/XzEYBoY.png",
        hd: "https://i.imgur.com/84ycU43.png",
      },
      ["[\u661F\u661F\u773C]" /* 星星眼 */]: {
        ld: "https://i.imgur.com/2spsghH.png",
        hd: "https://i.imgur.com/oEIJRru.png",
      },
      ["[OK]" /* OK */]: {
        ld: "https://i.imgur.com/6DMydmQ.png",
        hd: "https://i.imgur.com/PE2dyjY.png",
      },
      ["[\u8DEA\u4E86]" /* 跪了 */]: {
        ld: "https://i.imgur.com/TYtySHv.png",
        hd: "https://i.imgur.com/0pjsMf0.png",
      },
      ["[\u54CD\u6307]" /* 响指 */]: {
        ld: "https://i.imgur.com/Ac88cMm.png",
        hd: "https://i.imgur.com/nkoevMu.png",
      },
      ["[\u8C03\u76AE]" /* 调皮 */]: {
        ld: "https://i.imgur.com/O6ZZSLk.png",
        hd: "https://i.imgur.com/ggHTLzH.png",
      },
      ["[\u7B11\u54ED]" /* 笑哭 */]: {
        ld: "https://i.imgur.com/NIvxivj.png",
        hd: "https://i.imgur.com/h8edr5G.png",
      },
      ["[\u55D1\u74DC\u5B50]" /* 嗑瓜子 */]: {
        ld: "https://i.imgur.com/rjR4rdr.png",
        hd: "https://i.imgur.com/GMzq0tq.png",
      },
      ["[\u559C\u6781\u800C\u6CE3]" /* 喜极而泣 */]: {
        ld: "https://i.imgur.com/N9E3iZ2.png",
        hd: "https://i.imgur.com/L1N27tb.png",
      },
      ["[\u60CA\u8BB6]" /* 惊讶 */]: {
        ld: "https://i.imgur.com/aptfuiN.png",
        hd: "https://i.imgur.com/cuzxGOI.png",
      },
      ["[\u7ED9\u5FC3\u5FC3]" /* 给心心 */]: {
        ld: "https://i.imgur.com/4aXVwxJ.png",
        hd: "https://i.imgur.com/q663Mor.png",
      },
      ["[\u5446]" /* 呆 */]: {
        ld: "https://i.imgur.com/c1Q76Cd.png",
        hd: "https://i.imgur.com/xMXlmxm.png",
      },
      // 小红薯表情。
      ["[\u54ED\u60F9R]" /* 哭惹 */]: {
        ld: "https://i.imgur.com/HgxsUD2.png",
        hd: "https://i.imgur.com/0aOdQJd.png",
      },
      ["[\u54C7R]" /* 哇 */]: {
        ld: "https://i.imgur.com/OZySWIG.png",
        hd: "https://i.imgur.com/ngoi2I6.png",
      },
      ["[\u6C57\u989CR]" /* 汗颜 */]: {
        ld: "https://i.imgur.com/jrVZoLi.png",
        hd: "https://i.imgur.com/O8alqc1.png",
      },
      ["[\u5BB3\u7F9ER]" /* 害羞 */]: {
        ld: "https://i.imgur.com/OVQjxIr.png",
        hd: "https://i.imgur.com/1PeoVR5.png",
      },
      ["[\u840C\u840C\u54D2R]" /* 萌萌哒 */]: {
        ld: "https://i.imgur.com/Ue1kikn.png",
        hd: "https://i.imgur.com/vOHzwus.png",
      },
      ["[\u5077\u7B11R]" /* 偷笑 */]: {
        ld: "https://i.imgur.com/aF7QiE5.png",
        hd: "https://i.imgur.com/WneGpK9.png",
      },
      ["[\u4E70\u7206R]" /* 买爆 */]: {
        ld: "https://i.imgur.com/2JhZFtb.png",
        hd: "https://i.imgur.com/za9t585.png",
      },
      ["[\u8272\u8272R]" /* 色色 */]: {
        ld: "https://i.imgur.com/ZA1jRv1.png",
        hd: "https://i.imgur.com/mEGRKJy.png",
      },
      ["[\u62A0\u9F3BR]" /* 抠鼻 */]: {
        ld: "https://i.imgur.com/pYtTFnj.png",
        hd: "https://i.imgur.com/ErnQrMJ.png",
      },
      ["[\u9ED1\u85AF\u95EE\u53F7R]" /* 黑薯问号 */]: {
        ld: "https://i.imgur.com/aCjmFLD.png",
        hd: "https://i.imgur.com/i4Wgtyv.png",
      },
      ["[\u6276\u5899R]" /* 扶墙 */]: {
        ld: "https://i.imgur.com/RV7y6tR.png",
        hd: "https://i.imgur.com/PjhjZsJ.png",
      },
      ["[\u9119\u89C6R]" /* 鄙视 */]: {
        ld: "https://i.imgur.com/LaO5dh3.png",
        hd: "https://i.imgur.com/StrGaFx.png",
      },
      ["[\u8E72R]" /* 蹲 */]: {
        ld: "https://i.imgur.com/t876WSv.png",
        hd: "https://i.imgur.com/jdTq0YI.png",
      },
      ["[\u5E86\u795DR]" /* 庆祝 */]: {
        ld: "https://i.imgur.com/wQw2kD0.png",
        hd: "https://i.imgur.com/lx6jrkm.png",
      },
      ["[\u516DR]" /* 六 */]: {
        ld: "https://i.imgur.com/JqoC4L5.png",
        hd: "https://i.imgur.com/cUVWKc2.png",
      },
      ["[\u53EFR]" /* 可 */]: {
        ld: "https://i.imgur.com/I70yy88.png",
        hd: "https://i.imgur.com/nRgXwUT.png",
      },
      ["[\u52A0\u4E00R]" /* 加一 */]: {
        ld: "https://i.imgur.com/hpVvbVh.png",
        hd: "https://i.imgur.com/abBCCK9.png",
      },
    };
    emoticons = [
      {
        title: "\u6D41\u884C",
        list: [
          "[\u8131\u5355doge]" /* 脱单doge */,
          "[doge]" /* doge */,
          "[\u6253call]" /* 打call */,
          "[\u661F\u661F\u773C]" /* 星星眼 */,
          "[\u5403\u74DC]" /* 吃瓜 */,
          "[OK]" /* OK */,
          "[\u54E6\u547C]" /* 哦呼 */,
          "[\u601D\u8003]" /* 思考 */,
          "[\u7591\u60D1]" /* 疑惑 */,
          "[\u8FA3\u773C\u775B]" /* 辣眼睛 */,
          "[\u50B2\u5A07]" /* 傲娇 */,
          "[\u6342\u8138]" /* 捂脸 */,
          "[\u65E0\u8BED]" /* 无语 */,
          "[\u5927\u54ED]" /* 大哭 */,
          "[\u9178\u4E86]" /* 酸了 */,
          "[\u6B6A\u5634]" /* 歪嘴 */,
          "[\u8C03\u76AE]" /* 调皮 */,
          "[\u7B11\u54ED]" /* 笑哭 */,
          "[\u55D1\u74DC\u5B50]" /* 嗑瓜子 */,
          "[\u559C\u6781\u800C\u6CE3]" /* 喜极而泣 */,
          "[\u60CA\u8BB6]" /* 惊讶 */,
          "[\u7ED9\u5FC3\u5FC3]" /* 给心心 */,
          "[\u5446]" /* 呆 */,
          "[\u8DEA\u4E86]" /* 跪了 */,
          "[\u54CD\u6307]" /* 响指 */,
          "[\u54C7R]" /* 哇 */,
          "[\u840C\u840C\u54D2R]" /* 萌萌哒 */,
          "[\u5BB3\u7F9ER]" /* 害羞 */,
          "[\u5077\u7B11R]" /* 偷笑 */,
          "[\u54ED\u60F9R]" /* 哭惹 */,
          "[\u6C57\u989CR]" /* 汗颜 */,
          "[\u8272\u8272R]" /* 色色 */,
          "[\u62A0\u9F3BR]" /* 抠鼻 */,
          "[\u9119\u89C6R]" /* 鄙视 */,
          "[\u4E70\u7206R]" /* 买爆 */,
          "[\u9ED1\u85AF\u95EE\u53F7R]" /* 黑薯问号 */,
          "[\u6276\u5899R]" /* 扶墙 */,
          "[\u8E72R]" /* 蹲 */,
          "[\u53EFR]" /* 可 */,
          "[\u516DR]" /* 六 */,
          "[\u52A0\u4E00R]" /* 加一 */,
          "[\u5E86\u795DR]" /* 庆祝 */,
        ],
      },
      {
        title: "\u5C0F\u9EC4\u8138",
        list: [
          "\u{1F600}",
          "\u{1F601}",
          "\u{1F602}",
          "\u{1F923}",
          "\u{1F605}",
          "\u{1F60A}",
          "\u{1F60B}",
          "\u{1F618}",
          "\u{1F970}",
          "\u{1F617}",
          "\u{1F929}",
          "\u{1F914}",
          "\u{1F928}",
          "\u{1F610}",
          "\u{1F611}",
          "\u{1F644}",
          "\u{1F60F}",
          "\u{1F62A}",
          "\u{1F62B}",
          "\u{1F971}",
          "\u{1F61C}",
          "\u{1F612}",
          "\u{1F614}",
          "\u{1F628}",
          "\u{1F630}",
          "\u{1F631}",
          "\u{1F975}",
          "\u{1F621}",
          "\u{1F973}",
          "\u{1F97A}",
          "\u{1F92D}",
          "\u{1F9D0}",
          "\u{1F60E}",
          "\u{1F913}",
          "\u{1F62D}",
          "\u{1F911}",
          "\u{1F92E}",
        ],
      },
      {
        title: "\u624B\u52BF",
        list: [
          "\u{1F64B}",
          "\u{1F64E}",
          "\u{1F645}",
          "\u{1F647}",
          "\u{1F937}",
          "\u{1F90F}",
          "\u{1F449}",
          "\u270C\uFE0F",
          "\u{1F918}",
          "\u{1F919}",
          "\u{1F44C}",
          "\u{1F90C}",
          "\u{1F44D}",
          "\u{1F44E}",
          "\u{1F44B}",
          "\u{1F91D}",
          "\u{1F64F}",
          "\u{1F44F}",
        ],
      },
      {
        title: "\u5E86\u795D",
        list: ["\u2728", "\u{1F389}", "\u{1F38A}"],
      },
      {
        title: "\u5176\u4ED6",
        list: [
          "\u{1F47B}",
          "\u{1F921}",
          "\u{1F414}",
          "\u{1F440}",
          "\u{1F4A9}",
          "\u{1F434}",
          "\u{1F984}",
          "\u{1F427}",
          "\u{1F436}",
          "\u{1F412}",
          "\u{1F648}",
          "\u{1F649}",
          "\u{1F64A}",
          "\u{1F435}",
        ],
      },
    ];
    READABLE_CONTENT_HEIGHT = 250;
    MAX_CONTENT_HEIGHT = 550;
    READING_CONTENT_LIMIT = 150;
    dataExpiryTime = 60 * 60 * 1e3;
    imgurClientIdPool = [
      "3107b9ef8b316f3",
      // 以下 Client ID 来自「V2EX Plus」
      "442b04f26eefc8a",
      "59cfebe717c09e4",
      "60605aad4a62882",
      "6c65ab1d3f5452a",
      "83e123737849aa9",
      "9311f6be1c10160",
      "c4a4a563f698595",
      "81be04b9e4a08ce",
    ];
    defaultOptions = {
      openInNewTab: false,
      autoCheckIn: {
        enabled: true,
      },
      theme: {
        autoSwitch: false,
      },
      reply: {
        preload: "off",
        layout: "vertical",
      },
      replyContent: {
        autoFold: true,
        hideReplyTime: true,
        hideRefName: true,
        showImgInPage: true,
      },
      nestedReply: {
        display: "indent",
        multipleInsideOne: "nested",
      },
      userTag: {
        display: "inline",
      },
      contextMenu: {
        enabled: true,
      },
    };
  },
});

// src/icons.ts
var iconLogo, iconGitHub;
var init_icons = __esm({
  "src/icons.ts"() {
    "use strict";
    iconLogo = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 88 88"><g style="mix-blend-mode:passthrough"><path d="M87.92 86.098v-.052a.592.592 0 0 0 0-.07L44.978.72l-.059-.105c-.16-.3-.415-.511-.705-.586a.961.961 0 0 0-.841.19 1.315 1.315 0 0 0-.336.378l-.058.115a2571.004 2571.004 0 0 1-8.695 17.172c-.59 1.024-.59 2.382 0 3.406 3.856 7.57 7.7 15.142 11.532 22.718.641 1.108.641 2.58 0 3.688C39.5 60.23 32.826 73.406 26.45 85.993c-.291.661-.086 1.482.46 1.84.16.104.341.158.525.158h18.52c.415.003.797-.272.992-.713l.635-1.285 8.585-17.023c.142-.317.383-.552.67-.653a.949.949 0 0 1 .855.116c.156.1.289.245.386.423l8.506 16.723.787 1.558c.199.433.575.702.985.704h.518c.087.009.175.009.263 0h17.74c.617 0 1.119-.601 1.123-1.347a1.615 1.615 0 0 0-.08-.396Z" fill="currentColor" style="mix-blend-mode:passthrough"/><path d="m38.551 48.541.62-1.232a3.095 3.095 0 0 0 0-3.02l-3.807-7.446-4.377-8.511c-.155-.308-.406-.527-.697-.61a.957.957 0 0 0-.85.17 1.252 1.252 0 0 0-.4.502L.132 86.002c-.29.658-.085 1.477.46 1.83.161.113.345.17.532.168h16.981c.41 0 .788-.27.985-.705l.65-1.302c.029-.048.055-.098.08-.15l.729-1.408c6.047-12.103 11.839-23.66 17.9-35.7.038-.062.072-.127.102-.194Z" fill="currentColor" style="mix-blend-mode:passthrough"/></g></svg>
`;
    iconGitHub = `
<svg viewBox="0 0 24 24" aria-hidden="true">
  <path fill="currentColor" clip-rule="evenodd" d="M12 2C6.477 2 2 6.463 2 11.97c0 4.404 2.865 8.14 6.839 9.458.5.092.682-.216.682-.48 0-.236-.008-.864-.013-1.695-2.782.602-3.369-1.337-3.369-1.337-.454-1.151-1.11-1.458-1.11-1.458-.908-.618.069-.606.069-.606 1.003.07 1.531 1.027 1.531 1.027.892 1.524 2.341 1.084 2.91.828.092-.643.35-1.083.636-1.332-2.22-.251-4.555-1.107-4.555-4.927 0-1.088.39-1.979 1.029-2.675-.103-.252-.446-1.266.098-2.638 0 0 .84-.268 2.75 1.022A9.607 9.607 0 0 1 12 6.82c.85.004 1.705.114 2.504.336 1.909-1.29 2.747-1.022 2.747-1.022.546 1.372.202 2.386.1 2.638.64.696 1.028 1.587 1.028 2.675 0 3.83-2.339 4.673-4.566 4.92.359.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .267.18.577.688.48 3.97-1.32 6.833-5.054 6.833-9.458C22 6.463 17.522 2 12 2Z"></path>
</svg>
`;
  },
});

// src/utils.ts
function getOS() {
  const userAgent = window.navigator.userAgent.toLowerCase();
  const macosPlatforms = /(macintosh|macintel|macppc|mac68k|macos)/i;
  const windowsPlatforms = /(win32|win64|windows|wince)/i;
  const iosPlatforms = /(iphone|ipad|ipod)/i;
  let os = null;
  if (macosPlatforms.test(userAgent)) {
    os = "macos";
  } else if (iosPlatforms.test(userAgent)) {
    os = "ios";
  } else if (windowsPlatforms.test(userAgent)) {
    os = "windows";
  } else if (userAgent.includes("android")) {
    os = "android";
  } else if (userAgent.includes("linux")) {
    os = "linux";
  }
  return os;
}
function formatTimestamp(timestamp, { format = "YMD" } = {}) {
  const date = new Date(
    timestamp.toString().length === 10 ? timestamp * 1e3 : timestamp,
  );
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const YMD = `${year}-${month}-${day}`;
  if (format === "YMDHM") {
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    return `${YMD} ${hour}:${minute}`;
  }
  if (format === "YMDHMS") {
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    const second = date.getSeconds().toString().padStart(2, "0");
    return `${YMD} ${hour}:${minute}:${second}`;
  }
  return YMD;
}
function isSameDay(timestamp1, timestamp2) {
  const date1 = new Date(timestamp1);
  const date2 = new Date(timestamp2);
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}
function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function deepMerge(target, source) {
  const result = {};
  for (const key in target) {
    const targetProp = target[key];
    const sourceProp = source[key];
    if (isObject(targetProp) && isObject(sourceProp)) {
      result[key] = deepMerge(targetProp, sourceProp);
    } else if (Reflect.has(source, key)) {
      result[key] = sourceProp;
    } else {
      result[key] = targetProp;
    }
  }
  for (const key in source) {
    if (!Reflect.has(target, key)) {
      result[key] = source[key];
    }
  }
  return result;
}
function getRunEnv() {
  if (typeof chrome === "object" && typeof chrome.extension !== "undefined") {
    return "chrome";
  }
  if (typeof browser === "object" && typeof browser.extension !== "undefined") {
    return "web-ext";
  }
  return null;
}
function isBrowserExtension() {
  return false;
}
function escapeHTML(htmlString) {
  return htmlString.replace(/[<>&"'']/g, (match) => {
    switch (match) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case '"':
        return "&quot;";
      case "'":
        return "&#39;";
      default:
        return match;
    }
  });
}
function injectScript(scriptSrc) {
  const script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", scriptSrc);
  document.body.appendChild(script);
}
function isValidSettings(settings) {
  return (
    !!settings &&
    typeof settings === "object" &&
    "options" /* Options */ in settings
  );
}
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function getV2P_Settings() {
  let noteId;
  {
    const res = await fetch(`${V2EX_ORIGIN}/notes`);
    const htmlText = await res.text();
    const $page = $(htmlText);
    const $note = $page.find(
      '.note_item > .note_item_title > a[href^="/notes"]',
    );
    $note.each((_, dom) => {
      const $dom = $(dom);
      if ($dom.text().startsWith(mark)) {
        const href = $dom.attr("href");
        if (typeof href === "string") {
          const id = href.split("/").at(2);
          noteId = id;
        }
        return false;
      }
    });
  }
  if (noteId) {
    const res = await fetch(`${V2EX_ORIGIN}/notes/edit/${noteId}`);
    const htmlText = await res.text();
    const $editor = $(htmlText).find("#note_content.note_editor");
    const value = $editor.val();
    if (typeof value === "string") {
      const syncSettings = JSON.parse(value.replace(mark, ""));
      if (isValidSettings(syncSettings)) {
        return { noteId, config: syncSettings };
      }
    }
  }
}
async function setV2P_Settings(storageSettings, signal) {
  const data = await getV2P_Settings();
  const updating = !!data;
  const formData = new FormData();
  const syncVersion = updating
    ? data.config["settings-sync" /* SyncInfo */].version + 1
    : 1;
  const syncInfo = {
    version: syncVersion,
    lastSyncTime: Date.now(),
  };
  formData.append(
    "content",
    mark +
      JSON.stringify({
        ...storageSettings,
        ["settings-sync" /* SyncInfo */]: syncInfo,
      }),
  );
  formData.append("syntax", "0");
  if (updating) {
    const { noteId } = data;
    await fetch(`${V2EX_ORIGIN}/notes/edit/${noteId}`, {
      method: "POST",
      body: formData,
      signal,
    });
  } else {
    formData.append("parent_id", "0");
    await fetch(`${V2EX_ORIGIN}/notes/new`, {
      method: "POST",
      body: formData,
      signal,
    });
  }
  await setStorage("settings-sync" /* SyncInfo */, syncInfo);
  return syncInfo;
}
function getStorage(useCache = true) {
  return new Promise((resolve, reject) => {
    if (useCache) {
      if (window.__V2P_StorageCache) {
        resolve(window.__V2P_StorageCache);
      }
    }
    if (!isBrowserExtension()) {
      const data = { ["options" /* Options */]: defaultOptions };
      if (typeof window !== "undefined") {
        window.__V2P_StorageCache = data;
      }
      resolve(data);
    }
  });
}
function getStorageSync() {
  const storage = window.__V2P_StorageCache;
  if (!storage) {
    throw new Error(
      `${EXTENSION_NAME}: \u65E0\u53EF\u7528\u7684 Storage \u7F13\u5B58\u6570\u636E`,
    );
  }
  return storage;
}
async function setStorage(storageKey, storageItem) {
  switch (storageKey) {
    case "options" /* Options */:
    case "api" /* API */:
    case "daily" /* Daily */:
    case "settings-sync" /* SyncInfo */:
    case "reading-list" /* ReadingList */:
      try {
        // await chrome.storage.sync.set({ [storageKey]: storageItem });
        if (
          storageKey !== "api" /* API */ &&
          storageKey !== "settings-sync" /* SyncInfo */ &&
          typeof $ !== "undefined"
        ) {
          const settings = await getStorage(false);
          if (controller) {
            controller.abort();
          }
          controller = new AbortController();
          setV2P_Settings(settings, controller.signal);
        }
      } catch (err) {
        if (String(err).includes("QUOTA_BYTES_PER_ITEM quota exceeded")) {
          console.error(
            `${EXTENSION_NAME}: \u65E0\u6CD5\u8BBE\u7F6E ${storageKey}\uFF0C \u5355\u4E2A item \u4E0D\u80FD\u8D85\u51FA 8 KB\uFF0C\u8BE6\u60C5\u67E5\u770B\uFF1Ahttps://developer.chrome.com/docs/extensions/reference/storage/#storage-areas`,
          );
        }
        console.error(err);
        throw new Error(`\u274C \u65E0\u6CD5\u8BBE\u7F6E\uFF1A${storageKey}`);
      }
      break;
    default:
      throw new Error(`\u672A\u77E5\u7684 storageKey\uFF1A ${storageKey}`);
  }
}
var V2EX_ORIGIN, mark, controller;
var init_utils = __esm({
  "src/utils.ts"() {
    "use strict";
    init_constants();
    V2EX_ORIGIN =
      typeof window !== "undefined" &&
      window.location.origin.includes("v2ex.com")
        ? window.location.origin
        : "https://www.v2ex.com" /* Origin */;
    mark = `${EXTENSION_NAME}_settings`;
    controller = null;
  },
});

// src/contents/globals.ts
function updateCommentCells() {
  $commentCells = $commentBox.find('.cell[id^="r_"]');
  $commentTableRows = $commentCells.find("> table > tbody > tr");
}
var $body,
  $wrapper,
  $wrapperContent,
  $main,
  $topicList,
  $infoCard,
  $topicContentBox,
  $topicHeader,
  $commentBox,
  $commentCells,
  $commentTableRows,
  $replyBox,
  $replyForm,
  $replyTextArea,
  replyTextArea,
  loginName,
  topicOwnerName,
  pathTopicId;
var init_globals = __esm({
  "src/contents/globals.ts"() {
    "use strict";
    $body = $(document.body);
    $wrapper = $("#Wrapper");
    $wrapperContent = $wrapper.find("> .content");
    $main = $("#Main");
    $topicList = $(
      "#Main #Tabs ~ .cell.item, #Main #TopicsNode > .cell, #Main .cell.item:has(.item_title > .topic-link)",
    );
    $infoCard = $('#Rightbar > .box:has("#member-activity")');
    // 主题内容区域
    $topicContentBox = $("#Main .box:has(.topic_buttons)");
    if ($topicContentBox.length === 0) {
      // 移动端 / 特殊布局兜底：不依赖 #Main
      $topicContentBox = $(".box:has(.topic_buttons)");
    }
    $topicHeader = $topicContentBox.find(".header");

    // 评论列表区域
    $commentBox = $('#Main .box:has(.cell[id^="r_"])');
    if ($commentBox.length === 0) {
      // 移动端兜底：不依赖 #Main
      $commentBox = $('.box:has(.cell[id^="r_"])');
    }
    $commentCells = $commentBox.find('.cell[id^="r_"]');
    $commentTableRows = $commentCells.find("> table > tbody > tr");
    $replyBox = $("#reply-box");
    $replyForm = $replyBox.find('form[action^="/t"]');
    $replyTextArea = $("#reply_content");
    replyTextArea = document.querySelector("#reply_content");
    loginName = $('#Top .tools > a[href^="/member"]').text();
    topicOwnerName = $topicHeader.find('> small > a[href^="/member"]').text();
    pathTopicId = window.location.pathname.match(/\/t\/(\d+)/)?.at(1);
  },
});

// node_modules/.pnpm/lucide@0.445.0/node_modules/lucide/dist/esm/createElement.js
var createElement, createElement$1;
var init_createElement = __esm({
  "node_modules/.pnpm/lucide@0.445.0/node_modules/lucide/dist/esm/createElement.js"() {
    "use strict";
    createElement = (tag, attrs, children = []) => {
      const element = document.createElementNS(
        "http://www.w3.org/2000/svg",
        tag,
      );
      Object.keys(attrs).forEach((name) => {
        element.setAttribute(name, String(attrs[name]));
      });
      if (children.length) {
        children.forEach((child) => {
          const childElement = createElement(...child);
          element.appendChild(childElement);
        });
      }
      return element;
    };
    createElement$1 = ([tag, attrs, children]) =>
      createElement(tag, attrs, children);
  },
});

// node_modules/.pnpm/lucide@0.445.0/node_modules/lucide/dist/esm/replaceElement.js
var getAttrs, getClassNames, combineClassNames, toPascalCase, replaceElement;
var init_replaceElement = __esm({
  "node_modules/.pnpm/lucide@0.445.0/node_modules/lucide/dist/esm/replaceElement.js"() {
    "use strict";
    init_createElement();
    getAttrs = (element) =>
      Array.from(element.attributes).reduce((attrs, attr) => {
        attrs[attr.name] = attr.value;
        return attrs;
      }, {});
    getClassNames = (attrs) => {
      if (typeof attrs === "string") return attrs;
      if (!attrs || !attrs.class) return "";
      if (attrs.class && typeof attrs.class === "string") {
        return attrs.class.split(" ");
      }
      if (attrs.class && Array.isArray(attrs.class)) {
        return attrs.class;
      }
      return "";
    };
    combineClassNames = (arrayOfClassnames) => {
      const classNameArray = arrayOfClassnames.flatMap(getClassNames);
      return classNameArray
        .map((classItem) => classItem.trim())
        .filter(Boolean)
        .filter((value, index, self) => self.indexOf(value) === index)
        .join(" ");
    };
    toPascalCase = (string) =>
      string.replace(
        /(\w)(\w*)(_|-|\s*)/g,
        (g0, g1, g2) => g1.toUpperCase() + g2.toLowerCase(),
      );
    replaceElement = (element, { nameAttr, icons, attrs }) => {
      const iconName = element.getAttribute(nameAttr);
      if (iconName == null) return;
      const ComponentName = toPascalCase(iconName);
      const iconNode = icons[ComponentName];
      if (!iconNode) {
        return;
      }
      const elementAttrs = getAttrs(element);
      const [tag, iconAttributes, children] = iconNode;
      const iconAttrs = {
        ...iconAttributes,
        "data-lucide": iconName,
        ...attrs,
        ...elementAttrs,
      };
      const classNames = combineClassNames([
        "lucide",
        `lucide-${iconName}`,
        elementAttrs,
        attrs,
      ]);
      if (classNames) {
        Object.assign(iconAttrs, {
          class: classNames,
        });
      }
      const svgElement = createElement$1([tag, iconAttrs, children]);
      return element.parentNode?.replaceChild(svgElement, element);
    };
  },
});

// node_modules/.pnpm/lucide@0.445.0/node_modules/lucide/dist/esm/defaultAttributes.js
var defaultAttributes;
var init_defaultAttributes = __esm({
  "node_modules/.pnpm/lucide@0.445.0/node_modules/lucide/dist/esm/defaultAttributes.js"() {
    "use strict";
    defaultAttributes = {
      xmlns: "http://www.w3.org/2000/svg",
      width: 24,
      height: 24,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": 2,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
    };
  },
});

// node_modules/.pnpm/lucide@0.445.0/node_modules/lucide/dist/esm/icons/book-open-check.js
var BookOpenCheck;
var init_book_open_check = __esm({
  "node_modules/.pnpm/lucide@0.445.0/node_modules/lucide/dist/esm/icons/book-open-check.js"() {
    "use strict";
    init_defaultAttributes();
    BookOpenCheck = [
      "svg",
      defaultAttributes,
      [
        ["path", { d: "M12 21V7" }],
        ["path", { d: "m16 12 2 2 4-4" }],
        [
          "path",
          {
            d: "M22 6V4a1 1 0 0 0-1-1h-5a4 4 0 0 0-4 4 4 4 0 0 0-4-4H3a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h6a3 3 0 0 1 3 3 3 3 0 0 1 3-3h6a1 1 0 0 0 1-1v-1.3",
          },
        ],
      ],
    ];
  },
});

// node_modules/.pnpm/lucide@0.445.0/node_modules/lucide/dist/esm/icons/chevron-down.js
var ChevronDown;
var init_chevron_down = __esm({
  "node_modules/.pnpm/lucide@0.445.0/node_modules/lucide/dist/esm/icons/chevron-down.js"() {
    "use strict";
    init_defaultAttributes();
    ChevronDown = ["svg", defaultAttributes, [["path", { d: "m6 9 6 6 6-6" }]]];
  },
});

// node_modules/.pnpm/lucide@0.445.0/node_modules/lucide/dist/esm/icons/chevrons-up.js
var ChevronsUp;
var init_chevrons_up = __esm({
  "node_modules/.pnpm/lucide@0.445.0/node_modules/lucide/dist/esm/icons/chevrons-up.js"() {
    "use strict";
    init_defaultAttributes();
    ChevronsUp = [
      "svg",
      defaultAttributes,
      [
        ["path", { d: "m17 11-5-5-5 5" }],
        ["path", { d: "m17 18-5-5-5 5" }],
      ],
    ];
  },
});

// node_modules/.pnpm/lucide@0.445.0/node_modules/lucide/dist/esm/icons/eye-off.js
var EyeOff;
var init_eye_off = __esm({
  "node_modules/.pnpm/lucide@0.445.0/node_modules/lucide/dist/esm/icons/eye-off.js"() {
    "use strict";
    init_defaultAttributes();
    EyeOff = [
      "svg",
      defaultAttributes,
      [
        [
          "path",
          {
            d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
          },
        ],
        ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242" }],
        [
          "path",
          {
            d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
          },
        ],
        ["path", { d: "m2 2 20 20" }],
      ],
    ];
  },
});

// node_modules/.pnpm/lucide@0.445.0/node_modules/lucide/dist/esm/icons/heart.js
var Heart;
var init_heart = __esm({
  "node_modules/.pnpm/lucide@0.445.0/node_modules/lucide/dist/esm/icons/heart.js"() {
    "use strict";
    init_defaultAttributes();
    Heart = [
      "svg",
      defaultAttributes,
      [
        [
          "path",
          {
            d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
          },
        ],
      ],
    ];
  },
});

// node_modules/.pnpm/lucide@0.445.0/node_modules/lucide/dist/esm/icons/house.js
var House;
var init_house = __esm({
  "node_modules/.pnpm/lucide@0.445.0/node_modules/lucide/dist/esm/icons/house.js"() {
    "use strict";
    init_defaultAttributes();
    House = [
      "svg",
      defaultAttributes,
      [
        ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" }],
        [
          "path",
          {
            d: "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
          },
        ],
      ],
    ];
  },
});

// node_modules/.pnpm/lucide@0.445.0/node_modules/lucide/dist/esm/icons/message-square-plus.js
var MessageSquarePlus;
var init_message_square_plus = __esm({
  "node_modules/.pnpm/lucide@0.445.0/node_modules/lucide/dist/esm/icons/message-square-plus.js"() {
    "use strict";
    init_defaultAttributes();
    MessageSquarePlus = [
      "svg",
      defaultAttributes,
      [
        [
          "path",
          {
            d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
          },
        ],
        ["path", { d: "M12 7v6" }],
        ["path", { d: "M9 10h6" }],
      ],
    ];
  },
});

// node_modules/.pnpm/lucide@0.445.0/node_modules/lucide/dist/esm/icons/message-square.js
var MessageSquare;
var init_message_square = __esm({
  "node_modules/.pnpm/lucide@0.445.0/node_modules/lucide/dist/esm/icons/message-square.js"() {
    "use strict";
    init_defaultAttributes();
    MessageSquare = [
      "svg",
      defaultAttributes,
      [
        [
          "path",
          {
            d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
          },
        ],
      ],
    ];
  },
});

// node_modules/.pnpm/lucide@0.445.0/node_modules/lucide/dist/esm/icons/moon.js
var Moon;
var init_moon = __esm({
  "node_modules/.pnpm/lucide@0.445.0/node_modules/lucide/dist/esm/icons/moon.js"() {
    "use strict";
    init_defaultAttributes();
    Moon = [
      "svg",
      defaultAttributes,
      [["path", { d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" }]],
    ];
  },
});

// node_modules/.pnpm/lucide@0.445.0/node_modules/lucide/dist/esm/icons/package-plus.js
var PackagePlus;
var init_package_plus = __esm({
  "node_modules/.pnpm/lucide@0.445.0/node_modules/lucide/dist/esm/icons/package-plus.js"() {
    "use strict";
    init_defaultAttributes();
    PackagePlus = [
      "svg",
      defaultAttributes,
      [
        ["path", { d: "M16 16h6" }],
        ["path", { d: "M19 13v6" }],
        [
          "path",
          {
            d: "M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14",
          },
        ],
        ["path", { d: "m7.5 4.27 9 5.15" }],
        ["polyline", { points: "3.29 7 12 12 20.71 7" }],
        ["line", { x1: "12", x2: "12", y1: "22", y2: "12" }],
      ],
    ];
  },
});

// node_modules/.pnpm/lucide@0.445.0/node_modules/lucide/dist/esm/icons/panel-right.js
var PanelRight;
var init_panel_right = __esm({
  "node_modules/.pnpm/lucide@0.445.0/node_modules/lucide/dist/esm/icons/panel-right.js"() {
    "use strict";
    init_defaultAttributes();
    PanelRight = [
      "svg",
      defaultAttributes,
      [
        ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
        ["path", { d: "M15 3v18" }],
      ],
    ];
  },
});

// node_modules/.pnpm/lucide@0.445.0/node_modules/lucide/dist/esm/icons/panel-top.js
var PanelTop;
var init_panel_top = __esm({
  "node_modules/.pnpm/lucide@0.445.0/node_modules/lucide/dist/esm/icons/panel-top.js"() {
    "use strict";
    init_defaultAttributes();
    PanelTop = [
      "svg",
      defaultAttributes,
      [
        ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
        ["path", { d: "M3 9h18" }],
      ],
    ];
  },
});

// node_modules/.pnpm/lucide@0.445.0/node_modules/lucide/dist/esm/icons/smile.js
var Smile;
var init_smile = __esm({
  "node_modules/.pnpm/lucide@0.445.0/node_modules/lucide/dist/esm/icons/smile.js"() {
    "use strict";
    init_defaultAttributes();
    Smile = [
      "svg",
      defaultAttributes,
      [
        ["circle", { cx: "12", cy: "12", r: "10" }],
        ["path", { d: "M8 14s1.5 2 4 2 4-2 4-2" }],
        ["line", { x1: "9", x2: "9.01", y1: "9", y2: "9" }],
        ["line", { x1: "15", x2: "15.01", y1: "9", y2: "9" }],
      ],
    ];
  },
});

// node_modules/.pnpm/lucide@0.445.0/node_modules/lucide/dist/esm/icons/square-arrow-up-right.js
var SquareArrowUpRight;
var init_square_arrow_up_right = __esm({
  "node_modules/.pnpm/lucide@0.445.0/node_modules/lucide/dist/esm/icons/square-arrow-up-right.js"() {
    "use strict";
    init_defaultAttributes();
    SquareArrowUpRight = [
      "svg",
      defaultAttributes,
      [
        ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
        ["path", { d: "M8 8h8v8" }],
        ["path", { d: "m8 16 8-8" }],
      ],
    ];
  },
});

// node_modules/.pnpm/lucide@0.445.0/node_modules/lucide/dist/esm/icons/star.js
var Star;
var init_star = __esm({
  "node_modules/.pnpm/lucide@0.445.0/node_modules/lucide/dist/esm/icons/star.js"() {
    "use strict";
    init_defaultAttributes();
    Star = [
      "svg",
      defaultAttributes,
      [
        [
          "polygon",
          {
            points:
              "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2",
          },
        ],
      ],
    ];
  },
});

// node_modules/.pnpm/lucide@0.445.0/node_modules/lucide/dist/esm/icons/sun.js
var Sun;
var init_sun = __esm({
  "node_modules/.pnpm/lucide@0.445.0/node_modules/lucide/dist/esm/icons/sun.js"() {
    "use strict";
    init_defaultAttributes();
    Sun = [
      "svg",
      defaultAttributes,
      [
        ["circle", { cx: "12", cy: "12", r: "4" }],
        ["path", { d: "M12 2v2" }],
        ["path", { d: "M12 20v2" }],
        ["path", { d: "m4.93 4.93 1.41 1.41" }],
        ["path", { d: "m17.66 17.66 1.41 1.41" }],
        ["path", { d: "M2 12h2" }],
        ["path", { d: "M20 12h2" }],
        ["path", { d: "m6.34 17.66-1.41 1.41" }],
        ["path", { d: "m19.07 4.93-1.41 1.41" }],
      ],
    ];
  },
});

// node_modules/.pnpm/lucide@0.445.0/node_modules/lucide/dist/esm/icons/twitter.js
var Twitter;
var init_twitter = __esm({
  "node_modules/.pnpm/lucide@0.445.0/node_modules/lucide/dist/esm/icons/twitter.js"() {
    "use strict";
    init_defaultAttributes();
    Twitter = [
      "svg",
      defaultAttributes,
      [
        [
          "path",
          {
            d: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",
          },
        ],
      ],
    ];
  },
});

// node_modules/.pnpm/lucide@0.445.0/node_modules/lucide/dist/esm/lucide.js
var createIcons;
var init_lucide = __esm({
  "node_modules/.pnpm/lucide@0.445.0/node_modules/lucide/dist/esm/lucide.js"() {
    "use strict";
    init_replaceElement();
    init_createElement();
    init_book_open_check();
    init_chevron_down();
    init_chevrons_up();
    init_eye_off();
    init_heart();
    init_house();
    init_message_square_plus();
    init_message_square();
    init_moon();
    init_package_plus();
    init_panel_right();
    init_panel_top();
    init_smile();
    init_square_arrow_up_right();
    init_star();
    init_sun();
    init_twitter();
    createIcons = ({
      icons = {},
      nameAttr = "data-lucide",
      attrs = {},
    } = {}) => {
      if (!Object.values(icons).length) {
        throw new Error(
          "Please provide an icons object.\nIf you want to use all the icons you can import it like:\n `import { createIcons, icons } from 'lucide';\nlucide.createIcons({icons});`",
        );
      }
      if (typeof document === "undefined") {
        throw new Error("`createIcons()` only works in a browser environment.");
      }
      const elementsToReplace = document.querySelectorAll(`[${nameAttr}]`);
      Array.from(elementsToReplace).forEach((element) =>
        replaceElement(element, { nameAttr, icons, attrs }),
      );
      if (nameAttr === "data-lucide") {
        const deprecatedElements = document.querySelectorAll("[icon-name]");
        if (deprecatedElements.length > 0) {
          Array.from(deprecatedElements).forEach((element) =>
            replaceElement(element, { nameAttr: "icon-name", icons, attrs }),
          );
        }
      }
    };
  },
});

// src/components/toast.ts
function createToast(props) {
  const { message, duration = 3e3 } = props;
  const $existTosat = $(".v2p-toast");
  if ($existTosat.length > 0) {
    $existTosat.remove();
  }
  const $toast = $(`<div class="v2p-toast">${message}</div>`).hide();
  $body.append($toast);
  $toast.fadeIn("fast");
  if (duration !== 0) {
    setTimeout(() => {
      $toast.fadeOut("fast", () => {
        $toast.remove();
      });
    }, duration);
  }
  return {
    clear() {
      $toast.remove();
    },
  };
}
var init_toast = __esm({
  "src/components/toast.ts"() {
    "use strict";
    init_globals();
  },
});

// src/contents/helpers.ts
function focusReplyInput() {
  if (replyTextArea instanceof HTMLTextAreaElement) {
    replyTextArea.focus();
  }
}
function insertTextToReplyInput(text) {
  if (replyTextArea instanceof HTMLTextAreaElement) {
    const startPos = replyTextArea.selectionStart;
    const endPos = replyTextArea.selectionEnd;
    const valueToStart = replyTextArea.value.substring(0, startPos);
    const valueFromEnd = replyTextArea.value.substring(
      endPos,
      replyTextArea.value.length,
    );
    replyTextArea.value = `${valueToStart}${text}${valueFromEnd}`;
    focusReplyInput();
    replyTextArea.selectionStart = replyTextArea.selectionEnd =
      startPos + text.length;
  }
}

async function addToReadingList(params) {}
function customEscape(str) {
  return str.replace(
    /[^a-zA-Z0-9_.!~*'()-]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0")}`,
  );
}
function decodeBase64TopicPage() {
  const dataTitle = "\u70B9\u51FB\u590D\u5236";
  if (window.__V2P_DecodeStatus === "decodeed") {
    createToast({
      message:
        "\u5DF2\u89E3\u6790\u5B8C\u672C\u9875\u6240\u6709\u7684 Base64 \u5B57\u7B26\u4E32",
    });
  } else {
    const $topicContentBox2 = $("#Main .box:has(.topic_content)");
    const $commentBox2 = $('#Main .box:has(.cell[id^="r_"])');
    const $commentCells2 = $commentBox2.find('.cell[id^="r_"]');
    let count = 0;
    const excludeList = [
      "boss",
      "bilibili",
      "Bilibili",
      "Encrypto",
      "encrypto",
      "Window10",
      "airpords",
      "Windows7",
    ];
    const convertHTMLText = (text, excludeTextList) => {
      if (text.length % 4 !== 0 || text.length <= 8) {
        return text;
      }
      if (excludeList.includes(text)) {
        return text;
      }
      if (text.includes("=")) {
        const paddingIndex = text.indexOf("=");
        if (
          paddingIndex !== text.length - 1 &&
          paddingIndex !== text.length - 2
        ) {
          return text;
        }
      }
      if (excludeTextList?.some((excludeText) => excludeText.includes(text))) {
        return text;
      }
      try {
        const decodedStr = decodeURIComponent(customEscape(window.atob(text)));
        count += 1;
        return `${text}<span class="v2p-decode-block">(<ins class="v2p-decode" data-title="${dataTitle}">${decodedStr}</ins>)</span>`;
      } catch (err) {
        if (err instanceof Error) {
          console.error(`\u89E3\u6790 Base64 \u51FA\u9519\uFF1A${err.message}`);
        }
        return text;
      }
    };
    const base64regex = /[A-z0-9+/=]+/g;
    const contentHandler = (_, content) => {
      const excludeTextList = [
        ...content.getElementsByTagName("a"),
        ...content.getElementsByTagName("img"),
      ].map((ele) => ele.outerHTML);
      content.innerHTML = content.innerHTML.replace(base64regex, (htmlText) =>
        convertHTMLText(htmlText, excludeTextList),
      );
    };
    $commentCells2.find(".reply_content").each(contentHandler);
    $topicContentBox2.find(".topic_content").each(contentHandler);
    if (count === 0) {
      createToast({
        message: "\u672C\u9875\u672A\u53D1\u73B0 Base64 \u5B57\u7B26\u4E32",
      });
    } else {
      window.__V2P_DecodeStatus = "decodeed";
      createToast({
        message: `\u2705 \u5DF2\u89E3\u6790\u672C\u9875\u6240\u6709\u7684 Base64 \u5B57\u7B26\u4E32\uFF0C\u5171 ${count} \u6761`,
      });
    }
    $(".v2p-decode").on("click", (ev) => {
      const text = ev.target.innerText;
      void navigator.clipboard.writeText(text).then(() => {
        ev.target.dataset.title = "\u2705 \u5DF2\u590D\u5236";
        setTimeout(() => {
          ev.target.dataset.title = dataTitle;
        }, 1e3);
      });
    });
  }
}
function postTask(expression, callback) {
  if (!isBrowserExtension()) {
    const result = Function(`"use strict"; ${expression}`)();
    callback?.(result);
  } else {
    if (callback) {
      if (window.__V2P_Tasks) {
        window.__V2P_Tasks.set(Date.now(), callback);
      } else {
        window.__V2P_Tasks = /* @__PURE__ */ new Map([[Date.now(), callback]]);
      }
    }
    const messageData = {
      from: 0 /* Content */,
      payload: { task: { id: Date.now(), expression } },
    };
    window.postMessage(messageData);
  }
}
function loadIcons() {
  setTimeout(() => {
    createIcons({
      attrs: {
        width: "100%",
        height: "100%",
      },
      icons: {
        MessageSquarePlus,
        MessageSquare,
        BookOpenCheck,
        ChevronsUp,
        Heart,
        EyeOff,
        Sun,
        Moon,
        Smile,
        PackagePlus,
        Star,
        Twitter,
        ChevronDown,
        ArrowUpRightSquare: SquareArrowUpRight,
        House,
      },
    });
  }, 0);
}
function transformEmoji(textValue) {
  return textValue.replace(/\[[^\]]+\]/g, (x) => {
    if (Object.hasOwn(emojiLinks, x)) {
      const emojiLink = emojiLinks[x].ld;
      if (typeof emojiLink === "string") {
        return `${emojiLink} `;
      }
    }
    return x;
  });
}
function getTagsText(tags) {
  return tags.map((it) => it.name).join("\uFF0C");
}
function setTheme(type) {
  // Theme application is now handled entirely by v2p.theme.js userscript.
  // This stub is kept only for backward compatibility.
}

function toggleTheme({ $toggle, prefersDark, themeType = "light-default" }) {
  // Theme switching (classes, colors, icons) is now fully handled by v2p.theme.js.
  // This function is kept as a no-op so that existing calls in v2p.js do not break.
}

function replaceEmojiWithHD($emojiImgs) {
  if ($emojiImgs.length > 0) {
    const srcMap = /* @__PURE__ */ new Map();
    Object.values(emojiLinks).forEach(({ ld, hd }) => {
      srcMap.set(ld, hd);
    });
    $emojiImgs.each((_, img) => {
      const $img = $(img);
      const src = $img.attr("src");
      if (typeof src === "string") {
        const hd = srcMap.get(src);
        if (typeof hd === "string") {
          $img.attr("src", hd);
          $img.css({
            width: "var(--v2p-emoji-size)",
            height: "var(--v2p-emoji-size)",
          });
        }
      }
    });
  }
}
function replaceCommentEmojiWithHD($cells = $commentCells) {
  const srcMap = /* @__PURE__ */ new Map();
  Object.values(emojiLinks).forEach(({ ld, hd }) => {
    srcMap.set(ld, hd);
  });
  const $embedImages = $cells.find(
    `.reply_content .embedded_image, .payload .embedded_image`,
  );
  if ($embedImages.length > 0) {
    replaceEmojiWithHD($embedImages);
  }
}

function getRegisterDays(created) {
  const registerDays = Math.ceil((Date.now() / 1e3 - created) / (60 * 60 * 24));
  return registerDays;
}
var init_helpers = __esm({
  "src/contents/helpers.ts"() {
    "use strict";
    init_lucide();
    init_toast();
    init_constants();
    init_utils();
    init_globals();
  },
});

// src/contents/common.ts
var common_exports = {};
var init_common = __esm({
  "src/contents/common.ts"() {
    "use strict";
    init_polyfill();
    init_constants();
    init_icons();
    init_utils();
    init_globals();
    init_helpers();
    if ($("#site-header").length > 0) {
      $body.addClass("v2p-mobile");
    }
    void (async () => {
      const isBrowserExt = isBrowserExtension();
      const storage = await getStorage();
      const options = storage["options" /* Options */];
      if (options.theme.mode === "compact") {
        $body.addClass("v2p-mode-compact");
      }
      const $toggle = $("#Rightbar .light-toggle").addClass(
        "v2p-color-mode-toggle",
      );
      const syncInfo = storage["settings-sync" /* SyncInfo */];

      if (syncInfo) {
        const lastCheckTime = syncInfo.lastCheckTime;
        const twoHours = 2 * 60 * 1e3 * 60;
        const neverChecked = !lastCheckTime;
        if (
          (lastCheckTime && Date.now() - lastCheckTime >= twoHours) ||
          neverChecked
        ) {
          const isSignInPage = window.location.href.includes("/signin");
          if (!isSignInPage) {
            void getV2P_Settings().then(async (res) => {
              const settings = res?.config;
              const remoteSyncInfo = settings?.["settings-sync" /* SyncInfo */];
              if (settings && remoteSyncInfo) {
                if (syncInfo.version < remoteSyncInfo.version || neverChecked) {
                }
              }
            });
          }
        }
      }
      {
        const $toggleImg = $toggle.find("> img");
        const alt = $toggleImg.prop("alt");
        if (alt === "Light") {
          $toggle.prop("title", "\u4F7F\u7528\u6DF1\u8272\u4E3B\u9898");
          $toggleImg.replaceWith('<i data-lucide="moon"></i>');
        } else if (alt === "Dark") {
          $toggle.prop("title", "\u4F7F\u7528\u6D45\u8272\u4E3B\u9898");
          $toggleImg.replaceWith('<i data-lucide="sun"></i>');
        }
      }
      {
        $("#Top .site-nav .tools > .top").addClass("v2p-hover-btn");
      }
      if (options.hideAccount) {
        const faviconLink = $("link[rel~='icon']");
        faviconLink.prop("href", "https://v2p.app/favicon.svg");
        $("#Logo").append(`<i data-lucide="house"></i>`).addClass("v2p-logo");
        $("#Top").find('a[href^="/member/"]').remove();
        $infoCard
          .find(
            'a[href^="/member/"], table:nth-of-type(1) td:nth-of-type(3) .fade',
          )
          .addClass("v2p-hide-account");
        $infoCard.find(".balance_area").addClass("v2p-hide-balance");
      }
    })();
  },
});

// src/services.ts
async function legacyRequest(url, options) {
  const res = await fetch(url, options);
  if (res.ok) {
    return res.json();
  }
  throw new Error("\u8C03\u7528 V2EX API v1 \u51FA\u9519", {
    cause: res.status,
  });
}
async function fetchUserInfo(memberName, options) {
  try {
    const member = await legacyRequest(
      `${V2EX_LEGACY_API}/members/show.json?username=${memberName}`,
      options,
    );
    return member;
  } catch (err) {
    if (err instanceof Error) {
      if (err.name === "AbortError") {
        throw new Error("\u8BF7\u6C42\u88AB\u53D6\u6D88");
      } else if (err.cause === 404) {
        throw new Error(
          "\u67E5\u65E0\u6B64\u7528\u6237\uFF0C\u7591\u4F3C\u5DF2\u88AB\u5C01\u7981",
          { cause: err.cause },
        );
      }
    }
    throw new Error("\u83B7\u53D6\u7528\u6237\u4FE1\u606F\u5931\u8D25");
  }
}
async function request(url, options) {
  const storage = await getStorage();
  const PAT = storage["api" /* API */]?.pat;
  const res = await fetch(url, {
    ...options,
    headers: { Authorization: PAT ? `Bearer ${PAT}` : "", ...options?.headers },
  });
  {
    const limit = res.headers.get("X-Rate-Limit-Limit");
    const reset = res.headers.get("X-Rate-Limit-Reset");
    const remaining = res.headers.get("X-Rate-Limit-Remaining");
    const api = {
      pat: PAT,
      limit: limit ? Number(limit) : void 0,
      reset: reset ? Number(reset) : void 0,
      remaining: remaining ? Number(remaining) : void 0,
    };
    void setStorage("api" /* API */, api);
  }
  const resultData = await res.json();
  if (typeof resultData.success === "boolean" && !resultData.success) {
    throw new Error(resultData.message, { cause: resultData });
  }
  return resultData;
}
function fetchTopic(topicId, options) {
  return request(`${V2EX_API}/topics/${topicId}`, {
    method: "GET",
    ...options,
  });
}
async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);
  const randomIndex = Math.floor(Math.random() * imgurClientIdPool.length);
  const clidenId = imgurClientIdPool[randomIndex];
  const res = await fetch("https://api.imgur.com/3/upload", {
    method: "POST",
    headers: { Authorization: `Client-ID ${clidenId}` },
    body: formData,
  });
  if (res.ok) {
    const resData = await res.json();
    if (resData.success) {
      return resData.data.link;
    }
  }
  throw new Error("\u4E0A\u4F20\u5931\u8D25");
}
async function refreshMoney() {
  const res = await fetch("/ajax/money", { method: "POST" });
  const data = await res.text();
  $("#money").html(data);
}

function getOnceToken(replyId) {
  // 1. 当前脚本里的 window.once
  if (typeof window.once === "string" && window.once) {
    return window.once;
  }

  // 2. 尝试从页面原始 window 取（油猴环境）
  try {
    if (
      typeof unsafeWindow !== "undefined" &&
      typeof unsafeWindow.once === "string" &&
      unsafeWindow.once
    ) {
      return unsafeWindow.once;
    }
  } catch (e) {
    // ignore
  }

  // 3. 从 DOM 中原生的感谢链接解析 once
  //    尝试根据 replyId 定位 thank_area
  if (typeof replyId === "string" || typeof replyId === "number") {
    const selector = `#thank_area_${replyId} a.thank[href*="once="]`;
    const $link = $(selector);
    if ($link.length) {
      const href = $link.attr("href") || "";
      const match = href.match(/[?&]once=([^&]+)/);
      if (match && match[1]) {
        return match[1];
      }
    }
  }

  // 4. 兜底：随便找一个带 once 的链接（比如顶部的登出、夜间模式切换等）
  const $anyLink = $('a[href*="once="]').first();
  if ($anyLink.length) {
    const href = $anyLink.attr("href") || "";
    const match = href.match(/[?&]once=([^&]+)/);
    if (match && match[1]) {
      return match[1];
    }
  }

  // 实在拿不到，返回空字符串（让请求至少不是 "undefined"）
  return "";
}

async function thankReply(params) {
  try {
    const once = getOnceToken(params.replyId);

    const res = await fetch(
      `/thank/reply/${params.replyId}?once=${encodeURIComponent(once)}`,
      {
        method: "POST",
      },
    );
    const data = await res.json();
    postTask(`window.once = ${data.once}`);
    window.once = data.once;
    if (data.success) {
      $("#thank_area_" + params.replyId)
        .addClass("thanked")
        .html("\u611F\u8C22\u5DF2\u53D1\u9001");
      params.onSuccess?.();
      await refreshMoney();
    } else {
      alert(data.message);
    }
  } catch {
    params.onFail?.();
  }
}
async function crawlTopicPage(path, page = "1") {
  const res = await fetch(`${V2EX_ORIGIN}${path}?p=${page}`);
  const htmlText = await res.text();
  return htmlText;
}
async function getCommentPreview(params) {
  const formData = new FormData();
  formData.append("text", params.text);
  const res = await fetch(`${V2EX_ORIGIN}/preview/${params.syntax}`, {
    method: "POST",
    body: formData,
  });
  if (res.ok) {
    const renderedContent = await res.text();
    return renderedContent;
  } else {
    throw new Error("\u9884\u89C8\u5931\u8D25");
  }
}
var V2EX_LEGACY_API, V2EX_API;
var init_services = __esm({
  "src/services.ts"() {
    "use strict";
    init_constants();
    init_helpers();
    init_utils();
    V2EX_LEGACY_API = `${V2EX_ORIGIN}/api`;
    V2EX_API = `${V2EX_ORIGIN}/api/v2`;
  },
});

// src/components/button.ts
function createButton(props) {
  const { children, className = "", type = "button", tag = "button" } = props;
  const $button = $(
    `<${tag} class="normal button ${className}">${children}</${tag}>`,
  );
  if (tag === "button") {
    $button.prop("type", type);
  }
  return $button;
}
var init_button = __esm({
  "src/components/button.ts"() {
    "use strict";
  },
});

// src/components/modal.ts
function createModal(props) {
  const { root, title, onMount, onOpen, onClose } = props;
  const $mask = $('<div class="v2p-modal-mask">');
  const $content = $('<div class="v2p-modal-content">');
  const $closeBtn = createButton({
    children: "\u5173\u95ED<kbd>Esc</kbd>",
    className: "v2p-modal-close-btn",
  });
  const $title = $(`<div class="v2p-modal-title">${title ?? ""}</div>`);
  const $actions = $('<div class="v2p-modal-actions">').append($closeBtn);
  const $header = $('<div class="v2p-modal-header">').append($title, $actions);
  const $main2 = $('<div class="v2p-modal-main">')
    .append($header, $content)
    .on("click", (ev) => {
      ev.stopPropagation();
    });
  const $container = $mask.append($main2).hide();
  const modalElements = {
    $mask,
    $main: $main2,
    $header,
    $container,
    $title,
    $actions,
    $content,
  };
  let boundEvent = false;
  let mouseDownTarget;
  const mouseDownHandler = (ev) => {
    mouseDownTarget = ev.target;
  };
  const mouseUpHandler = (ev) => {
    if (
      mouseDownTarget === $mask.get(0) &&
      ev.target === $mask.get(0) &&
      ev.currentTarget === ev.target
    ) {
      handleModalClose();
    }
  };
  const keyupHandler = (ev) => {
    if (ev.key === "Escape") {
      handleModalClose();
    }
  };
  const handleModalClose = () => {
    $mask.off("mousedown", mouseDownHandler);
    $mask.off("mouseup", mouseUpHandler);
    $(document).off("keydown", keyupHandler);
    boundEvent = false;
    $container.fadeOut("fast");
    document.body.classList.remove("v2p-modal-open");
    onClose?.(modalElements);
  };
  const handleModalOpen = () => {
    if (root && !$container.parent().length) {
      root.append($container);
      $closeBtn.on("click", handleModalClose);
      onMount?.(modalElements);
    }
    setTimeout(() => {
      if (!boundEvent) {
        $mask.on("mousedown", mouseDownHandler);
        $mask.on("mouseup", mouseUpHandler);
        $(document).on("keydown", keyupHandler);
        boundEvent = true;
      }
    });
    $container.fadeIn("fast");
    document.body.classList.add("v2p-modal-open");
    onOpen?.(modalElements);
  };
  return { ...modalElements, open: handleModalOpen, close: handleModalClose };
}
var init_modal = __esm({
  "src/components/modal.ts"() {
    "use strict";
    init_button();
  },
});

// src/contents/topic/content.ts
function handleTopicImgHeight() {
  const $topicContentImgs = $topicContentBox.find(
    ".topic_content .embedded_image",
  );
  $topicContentImgs.each((_, img) => {
    const $img = $(img);
    const height = $img.height() ?? 0;
    const shouldWrap = height > 600;
    if (shouldWrap) {
      const collapsedCSS = {
        maxHeight: `${READABLE_CONTENT_HEIGHT}px`,
        overflow: "hidden",
        paddingBottom: "0",
        "--bg-reply": "var(--v2p-color-bg-content)",
      };
      const $contentBox = $(
        '<div class="v2p-reply-content v2p-collapsed">',
      ).css(collapsedCSS);
      const $expandBtn = createButton({
        children: "\u5C55\u5F00\u56FE\u7247",
        className: "v2p-expand-btn",
      });
      const toggleContent = () => {
        const collapsed = $contentBox.hasClass("v2p-collapsed");
        $contentBox
          .toggleClass("v2p-collapsed")
          .css(
            collapsed
              ? { maxHeight: "none", overflow: "auto", paddingBottom: "40px" }
              : collapsedCSS,
          );
        $expandBtn.html(
          collapsed ? "\u6536\u8D77\u56FE\u7247" : "\u5C55\u5F00\u56FE\u7247",
        );
      };
      $expandBtn.on("click", () => {
        toggleContent();
      });
      $contentBox.append($img.clone()).replaceAll($img).append($expandBtn);
    }
  });
}
function handleContent() {
  const storage = getStorageSync();
  const options = storage["options" /* Options */];
  if (options.openInNewTab) {
    $topicContentBox
      .find(".topic_content a[href]")
      .prop("target", "_blank")
      .prop("rel", "noopener noreferrer");
  }
  {
    const $topicContents = $topicContentBox.find(".subtle > .topic_content");
    const textLength = $topicContents.text().length;
    if (textLength >= 200) {
      $topicContents.each((_, topicContent) => {
        if (textLength >= 400) {
          topicContent.style.fontSize = "14px";
        }
        topicContent.style.fontSize = "14.5px";
      });
    }
  }
  {
    const $topicBtns = $(".topic_buttons");
    const $topicBtn = $topicBtns.find(".tb").addClass("v2p-tb v2p-hover-btn");
    const $favoriteBtn = $topicBtn.eq(0);
    $favoriteBtn.append(
      '<span class="v2p-tb-icon"><i data-lucide="star"></i></span>',
    );
    $topicBtn
      .eq(1)
      .append('<span class="v2p-tb-icon"><i data-lucide="twitter"></i></span>');
    $topicBtn
      .eq(2)
      .append('<span class="v2p-tb-icon"><i data-lucide="eye-off"></i></span>');
    $topicBtn
      .eq(3)
      .append('<span class="v2p-tb-icon"><i data-lucide="heart"></i></span>');
    if (pathTopicId) {
      $topicBtns.append(
        ` &nbsp;<a href="${"https://v2p.app/share" /* Share */}/${pathTopicId}" target="_blank" class="tb v2p-tb v2p-hover-btn">\u5206\u4EAB<span class="v2p-tb-icon"><i data-lucide="arrow-up-right-square"></i></span></a>`,
      );
    }
    loadIcons();
  }
  window.requestIdleCallback(() => {
    handleTopicImgHeight();
  });
}
function processReplyContent($cellDom) {
  if ($cellDom.find(".v2p-reply-content").length > 0) {
    return;
  }
  const $replyContent = $cellDom.find(".reply_content");
  const contentHeight = $replyContent.height() ?? 0;
  const shouldCollapsed =
    contentHeight + READABLE_CONTENT_HEIGHT >= MAX_CONTENT_HEIGHT;
  if (shouldCollapsed) {
    const collapsedCSS = {
      maxHeight: `${READABLE_CONTENT_HEIGHT}px`,
      overflow: "hidden",
      paddingBottom: "0",
    };
    const $contentBox = $('<div class="v2p-reply-content v2p-collapsed">').css(
      collapsedCSS,
    );
    const $expandBtn = createButton({
      children: "\u5C55\u5F00\u56DE\u590D",
      className: "v2p-expand-btn",
    });
    const toggleContent = () => {
      const collapsed = $contentBox.hasClass("v2p-collapsed");
      $contentBox
        .toggleClass("v2p-collapsed")
        .css(
          collapsed
            ? { maxHeight: "none", overflow: "auto", paddingBottom: "40px" }
            : collapsedCSS,
        );
      $expandBtn.html(
        collapsed ? "\u6536\u8D77\u56DE\u590D" : "\u5C55\u5F00\u56DE\u590D",
      );
    };
    $expandBtn.on("click", () => {
      toggleContent();
    });
    $contentBox
      .append($replyContent.clone())
      .replaceAll($replyContent)
      .append($expandBtn);
  }
}
function updateMemberTag() {}

function openTagsSetter() {}

function handleTopicImg() {
  const $imgs = $(".embedded_image");
  if ($imgs.length > 0) {
    const modal = createModal({
      root: $body,
      onMount: ({ $main: $main2, $header, $content }) => {
        $main2.css({
          width: "auto",
          height: "auto",
          display: "flex",
          "justify-content": "center",
          "background-color": "transparent",
          "pointer-events": "none",
        });
        $header.remove();
        $content.css({
          display: "flex",
          "justify-content": "center",
          "align-items": "center",
          "pointer-events": "none",
        });
      },
      onOpen: ({ $content }) => {
        $content.empty();
      },
    });
    $imgs.each((_, img) => {
      const $img = $(img);
      if (img instanceof HTMLImageElement) {
        $img.parent().removeAttr("href");
        if (img.clientWidth !== img.naturalWidth) {
          $img.css({ cursor: "zoom-in" });
          $img.on("click", () => {
            const $clonedImg = $img.clone();
            $clonedImg.css({ cursor: "default", "pointer-events": "auto" });
            modal.open();
            modal.$content.append($clonedImg);
          });
        }
      }
    });
  }
}
var init_content = __esm({
  "src/contents/topic/content.ts"() {
    "use strict";
    init_button();
    init_modal();
    init_constants();
    init_use_topic_preview();
    init_utils();
    init_globals();
    init_helpers();
  },
});

// src/contents/dom.ts
function getCommentDataList({
  options,
  $commentTableRows: $commentTableRows2,
  $commentCells: $commentCells2,
}) {
  return $commentTableRows2
    .map((idx, tr) => {
      const id = $commentCells2[idx].id;
      const $tr = $(tr);
      const $td = $tr.find("> td:nth-child(3)");
      const thanked = $tr
        .find("> td:last-of-type > .fr")
        .find("> .thank_area")
        .hasClass("thanked");
      const $member = $td.find("> strong > a");
      const memberName = $member.text();
      const memberLink = $member.prop("href");
      const memberAvatar = $tr.find(".avatar").prop("src");
      const $content = $td.find("> .reply_content");
      const content = $content.text();
      const likes = Number($td.find("span.small").text());
      const floor = $td.find("span.no").text();
      const memberNameMatches = Array.from(
        content.matchAll(/@([a-zA-Z0-9]+)/g),
      );
      const refMemberNames =
        memberNameMatches.length > 0
          ? memberNameMatches.map(([, name]) => {
              return name;
            })
          : void 0;
      const floorNumberMatches = Array.from(content.matchAll(/#(\d+)/g));
      const refFloors =
        floorNumberMatches.length > 0
          ? floorNumberMatches.map(([, floor2]) => {
              return floor2;
            })
          : void 0;
      let contentHtml = void 0;
      if (refMemberNames) {
        const canHideRefName =
          options.nestedReply.display === "indent" &&
          !!options.replyContent.hideRefName;
        if (canHideRefName) {
          if (refMemberNames.length === 1) {
            contentHtml = $content.html();
            const pattern = /(@<a href="\/member\/\w+">[\w\s]+<\/a>)\s+/g;
            const replacement = '<span class="v2p-member-ref">$1</span> ';
            contentHtml = contentHtml.replace(pattern, replacement);
          }
        }
      }
      return {
        id,
        memberName,
        memberLink,
        memberAvatar,
        content,
        contentHtml,
        likes,
        floor,
        index: idx,
        refMemberNames,
        refFloors,
        thanked,
      };
    })
    .get();
}
function handleNestedComment({
  options,
  $commentCells: $commentCells2,
  commentDataList: commentDataList2,
}) {
  const display = options.nestedReply.display;
  if (display !== "off") {
    $commentCells2.each((i, cellDom) => {
      const $cellDom = $(cellDom);
      const dataFromIndex = commentDataList2.at(i);
      if (options.replyContent.autoFold) {
        processReplyContent($cellDom);
      }
      const currentComment =
        dataFromIndex?.id === cellDom.id
          ? dataFromIndex
          : commentDataList2.find((data) => data.id === cellDom.id);
      if (currentComment) {
        const { refMemberNames, refFloors } = currentComment;
        if (!refMemberNames || refMemberNames.length === 0) {
          return;
        }
        const moreThanOneRefMember = refMemberNames.length > 1;
        if (
          options.nestedReply.multipleInsideOne === "off" &&
          refMemberNames.length > 1
        ) {
          return;
        }
        for (const refName of moreThanOneRefMember
          ? refMemberNames.toReversed()
          : refMemberNames) {
          for (let j = i - 1; j >= 0; j--) {
            const { memberName: compareName, floor: eachFloor } =
              commentDataList2.at(j) || {};
            if (compareName === refName) {
              let refCommentIdx = j;
              const firstRefFloor = moreThanOneRefMember
                ? refFloors?.toReversed().at(0)
                : refFloors?.at(0);
              if (firstRefFloor && firstRefFloor !== eachFloor) {
                const targetIdx = commentDataList2
                  .slice(0, j)
                  .findIndex(
                    (data) =>
                      data.floor === firstRefFloor &&
                      data.memberName === refName,
                  );
                if (targetIdx >= 0) {
                  refCommentIdx = targetIdx;
                }
              }
              if (display === "indent") {
                cellDom.classList.add("v2p-indent");
              }
              $commentCells2.eq(refCommentIdx).append(cellDom);
              return;
            }
          }
        }
      }
    });
  }
}
var init_dom = __esm({
  "src/contents/dom.ts"() {
    "use strict";
    init_content();
  },
});

var invalidTemplate, topicDataCache;
var init_use_topic_preview = __esm({
  "src/use-topic-preview.ts"() {
    "use strict";
    init_lucide();
    init_button();
    init_modal();
    init_constants();
    init_dom();
    init_globals();
    init_helpers();
    init_content();
    init_icons();
    init_services();
    init_utils();
    invalidTemplate = (tip) => `
<div class="v2p-no-pat">
  <div class="v2p-no-pat-title">${tip}</div>
  <div class="v2p-no-pat-desc">
    \u8BF7\u524D\u5F80<span class="v2p-no-pat-block"><span class="v2p-icon-logo">${iconLogo}</span> <span style="margin: 0 5px;">></span> \u8BBE\u7F6E</span> \u8FDB\u884C\u8BBE\u7F6E\u3002
  </div>

  <div class="v2p-no-pat-steps">
    <div class="v2p-no-pat-step">
      <div style="font-weight:bold;margin-bottom:10px;font-size:15px;">1. \u5728\u6269\u5C55\u7A0B\u5E8F\u5217\u8868\u4E2D\u627E\u5230\u5E76\u70B9\u51FB\u300CV2EX Polish\u300D\u3002</div>
      <img class="v2p-no-pat-img" src="https://i.imgur.com/UfNkuTF.png">
    </div>
    <div class="v2p-no-pat-step">
      <div style="font-weight:bold;margin-bottom:10px;font-size:15px;">2. \u5728\u5F39\u51FA\u7684\u5C0F\u7A97\u53E3\u4E2D\u627E\u5230\u300C\u2699\uFE0F \u6309\u94AE\u300D\uFF0C\u8F93\u5165 PAT\u3002</div>
      <img class="v2p-no-pat-img" src="https://i.imgur.com/O6hP86A.png">
    </div>
  </div>
</div>
`;
    topicDataCache = /* @__PURE__ */ new Map();
  },
});

var init_topic_list = __esm({
  "src/contents/home/topic-list.ts"() {
    "use strict";
    init_toast();
    init_constants();
    init_services();
    init_use_topic_preview();
    init_utils();
    init_globals();
  },
});

// src/contents/home/index.ts
var home_exports = {};
var init_home = __esm({
  "src/contents/home/index.ts"() {
    "use strict";
    init_constants();
    init_utils();
    init_globals();
    init_helpers();
    init_topic_list();
    function handleNodeNavToggle() {
      // 1. 查找包含“节点导航”文本的标题区域
      // 这里的筛选逻辑是为了确保只定位到正确的那个 box
      const $headerSpan = $(".box .cell span.fade").filter((_, el) => {
        return $(el).text().includes("节点导航");
      });

      if ($headerSpan.length === 0) return;

      // 2. 获取容器和需要折叠的内容
      // 逻辑：找到父级 .box，然后选取除了第一个子元素（标题栏）以外的所有子元素
      const $box = $headerSpan.closest(".box");
      const $content = $box.children().not(":first-child");

      // 3. 定义存储 Key
      const STORAGE_KEY = "v2p_nav_collapsed";

      // 4. 创建切换按钮
      // 使用 v2p-hover-btn 类以保持样式一致，行内样式微调位置
      const $toggleBtn = $(
        '<a href="javascript:void(0);" class="v2p-hover-btn" style="margin-left: 10px; font-size: 12px; text-decoration: none;"></a>',
      );

      // 5. 定义切换状态的逻辑
      const applyState = (isCollapsed) => {
        if (isCollapsed) {
          $content.hide();
          $toggleBtn.text("[展开]");
          // 稍微减小 box 的下边距，折叠后看起来更紧凑
          $box.css("margin-bottom", "10px");
        } else {
          $content.show();
          $toggleBtn.text("[收起]");
          $box.css("margin-bottom", "");
        }
        // 存储状态：'1' 为折叠，'0' 为展开
        localStorage.setItem(STORAGE_KEY, isCollapsed ? "1" : "0");
      };

      // 6. 绑定点击事件
      $toggleBtn.on("click", function () {
        const currentText = $(this).text();
        const isNowCollapsed = currentText === "[收起]"; // 如果当前是[收起]，点击后就变成折叠
        applyState(isNowCollapsed);
      });

      // 7. 初始化：读取存储的状态并应用
      const savedState = localStorage.getItem(STORAGE_KEY) === "1";
      applyState(savedState);

      // 8. 将按钮插入到“节点导航”文字后面
      $headerSpan.append($toggleBtn);
    }
    void (async () => {
      const storage = await getStorage();
      const options = storage["options" /* Options */];
      {
        $("#Main .tab").addClass("v2p-hover-btn");
        if (options.openInNewTab) {
          $(
            '#Main .topic-link, .item_hot_topic_title > a, .item_node, a[href="/write"]',
          ).prop("target", "_blank");
        }
      }
      handleNodeNavToggle();

      loadIcons();
    })();
  },
});

// node_modules/.pnpm/@floating-ui+utils@0.2.3/node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs
function clamp(start, value, end) {
  return max(start, min(value, end));
}
function evaluate(value, param) {
  return typeof value === "function" ? value(param) : value;
}
function getSide(placement) {
  return placement.split("-")[0];
}
function getAlignment(placement) {
  return placement.split("-")[1];
}
function getOppositeAxis(axis) {
  return axis === "x" ? "y" : "x";
}
function getAxisLength(axis) {
  return axis === "y" ? "height" : "width";
}
function getSideAxis(placement) {
  return ["top", "bottom"].includes(getSide(placement)) ? "y" : "x";
}
function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);
  let mainAlignmentSide =
    alignmentAxis === "x"
      ? alignment === (rtl ? "end" : "start")
        ? "right"
        : "left"
      : alignment === "start"
        ? "bottom"
        : "top";
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [
    getOppositeAlignmentPlacement(placement),
    oppositePlacement,
    getOppositeAlignmentPlacement(oppositePlacement),
  ];
}
function getOppositeAlignmentPlacement(placement) {
  return placement.replace(
    /start|end/g,
    (alignment) => oppositeAlignmentMap[alignment],
  );
}
function getSideList(side, isStart, rtl) {
  const lr = ["left", "right"];
  const rl = ["right", "left"];
  const tb = ["top", "bottom"];
  const bt = ["bottom", "top"];
  switch (side) {
    case "top":
    case "bottom":
      if (rtl) return isStart ? rl : lr;
      return isStart ? lr : rl;
    case "left":
    case "right":
      return isStart ? tb : bt;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === "start", rtl);
  if (alignment) {
    list = list.map((side) => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}
function getOppositePlacement(placement) {
  return placement.replace(
    /left|right|bottom|top/g,
    (side) => oppositeSideMap[side],
  );
}
function expandPaddingObject(padding) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...padding,
  };
}
function getPaddingObject(padding) {
  return typeof padding !== "number"
    ? expandPaddingObject(padding)
    : {
        top: padding,
        right: padding,
        bottom: padding,
        left: padding,
      };
}
function rectToClientRect(rect) {
  const { x, y, width, height } = rect;
  return {
    width,
    height,
    top: y,
    left: x,
    right: x + width,
    bottom: y + height,
    x,
    y,
  };
}
var min, max, oppositeSideMap, oppositeAlignmentMap;
var init_floating_ui_utils = __esm({
  "node_modules/.pnpm/@floating-ui+utils@0.2.3/node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs"() {
    "use strict";
    min = Math.min;
    max = Math.max;
    oppositeSideMap = {
      left: "right",
      right: "left",
      bottom: "top",
      top: "bottom",
    };
    oppositeAlignmentMap = {
      start: "end",
      end: "start",
    };
  },
});

// node_modules/.pnpm/@floating-ui+core@1.6.3/node_modules/@floating-ui/core/dist/floating-ui.core.mjs
function computeCoordsFromPlacement(_ref, placement, rtl) {
  let { reference, floating } = _ref;
  const sideAxis = getSideAxis(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const alignLength = getAxisLength(alignmentAxis);
  const side = getSide(placement);
  const isVertical = sideAxis === "y";
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  let coords;
  switch (side) {
    case "top":
      coords = {
        x: commonX,
        y: reference.y - floating.height,
      };
      break;
    case "bottom":
      coords = {
        x: commonX,
        y: reference.y + reference.height,
      };
      break;
    case "right":
      coords = {
        x: reference.x + reference.width,
        y: commonY,
      };
      break;
    case "left":
      coords = {
        x: reference.x - floating.width,
        y: commonY,
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y,
      };
  }
  switch (getAlignment(placement)) {
    case "start":
      coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case "end":
      coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }
  return coords;
}
async function detectOverflow(state, options) {
  var _await$platform$isEle;
  if (options === void 0) {
    options = {};
  }
  const { x, y, platform: platform2, rects, elements, strategy } = state;
  const {
    boundary = "clippingAncestors",
    rootBoundary = "viewport",
    elementContext = "floating",
    altBoundary = false,
    padding = 0,
  } = evaluate(options, state);
  const paddingObject = getPaddingObject(padding);
  const altContext = elementContext === "floating" ? "reference" : "floating";
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = rectToClientRect(
    await platform2.getClippingRect({
      element: (
        (_await$platform$isEle = await (platform2.isElement == null
          ? void 0
          : platform2.isElement(element))) != null
          ? _await$platform$isEle
          : true
      )
        ? element
        : element.contextElement ||
          (await (platform2.getDocumentElement == null
            ? void 0
            : platform2.getDocumentElement(elements.floating))),
      boundary,
      rootBoundary,
      strategy,
    }),
  );
  const rect =
    elementContext === "floating"
      ? {
          x,
          y,
          width: rects.floating.width,
          height: rects.floating.height,
        }
      : rects.reference;
  const offsetParent = await (platform2.getOffsetParent == null
    ? void 0
    : platform2.getOffsetParent(elements.floating));
  const offsetScale = (await (platform2.isElement == null
    ? void 0
    : platform2.isElement(offsetParent)))
    ? (await (platform2.getScale == null
        ? void 0
        : platform2.getScale(offsetParent))) || {
        x: 1,
        y: 1,
      }
    : {
        x: 1,
        y: 1,
      };
  const elementClientRect = rectToClientRect(
    platform2.convertOffsetParentRelativeRectToViewportRelativeRect
      ? await platform2.convertOffsetParentRelativeRectToViewportRelativeRect({
          elements,
          rect,
          offsetParent,
          strategy,
        })
      : rect,
  );
  return {
    top:
      (clippingClientRect.top - elementClientRect.top + paddingObject.top) /
      offsetScale.y,
    bottom:
      (elementClientRect.bottom -
        clippingClientRect.bottom +
        paddingObject.bottom) /
      offsetScale.y,
    left:
      (clippingClientRect.left - elementClientRect.left + paddingObject.left) /
      offsetScale.x,
    right:
      (elementClientRect.right -
        clippingClientRect.right +
        paddingObject.right) /
      offsetScale.x,
  };
}
async function convertValueToCoords(state, options) {
  const { placement, platform: platform2, elements } = state;
  const rtl = await (platform2.isRTL == null
    ? void 0
    : platform2.isRTL(elements.floating));
  const side = getSide(placement);
  const alignment = getAlignment(placement);
  const isVertical = getSideAxis(placement) === "y";
  const mainAxisMulti = ["left", "top"].includes(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = evaluate(options, state);
  let { mainAxis, crossAxis, alignmentAxis } =
    typeof rawValue === "number"
      ? {
          mainAxis: rawValue,
          crossAxis: 0,
          alignmentAxis: null,
        }
      : {
          mainAxis: 0,
          crossAxis: 0,
          alignmentAxis: null,
          ...rawValue,
        };
  if (alignment && typeof alignmentAxis === "number") {
    crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
  }
  return isVertical
    ? {
        x: crossAxis * crossAxisMulti,
        y: mainAxis * mainAxisMulti,
      }
    : {
        x: mainAxis * mainAxisMulti,
        y: crossAxis * crossAxisMulti,
      };
}
var computePosition, flip, offset, shift;
var init_floating_ui_core = __esm({
  "node_modules/.pnpm/@floating-ui+core@1.6.3/node_modules/@floating-ui/core/dist/floating-ui.core.mjs"() {
    "use strict";
    init_floating_ui_utils();
    init_floating_ui_utils();
    computePosition = async (reference, floating, config) => {
      const {
        placement = "bottom",
        strategy = "absolute",
        middleware = [],
        platform: platform2,
      } = config;
      const validMiddleware = middleware.filter(Boolean);
      const rtl = await (platform2.isRTL == null
        ? void 0
        : platform2.isRTL(floating));
      let rects = await platform2.getElementRects({
        reference,
        floating,
        strategy,
      });
      let { x, y } = computeCoordsFromPlacement(rects, placement, rtl);
      let statefulPlacement = placement;
      let middlewareData = {};
      let resetCount = 0;
      for (let i = 0; i < validMiddleware.length; i++) {
        const { name, fn } = validMiddleware[i];
        const {
          x: nextX,
          y: nextY,
          data,
          reset,
        } = await fn({
          x,
          y,
          initialPlacement: placement,
          placement: statefulPlacement,
          strategy,
          middlewareData,
          rects,
          platform: platform2,
          elements: {
            reference,
            floating,
          },
        });
        x = nextX != null ? nextX : x;
        y = nextY != null ? nextY : y;
        middlewareData = {
          ...middlewareData,
          [name]: {
            ...middlewareData[name],
            ...data,
          },
        };
        if (reset && resetCount <= 50) {
          resetCount++;
          if (typeof reset === "object") {
            if (reset.placement) {
              statefulPlacement = reset.placement;
            }
            if (reset.rects) {
              rects =
                reset.rects === true
                  ? await platform2.getElementRects({
                      reference,
                      floating,
                      strategy,
                    })
                  : reset.rects;
            }
            ({ x, y } = computeCoordsFromPlacement(
              rects,
              statefulPlacement,
              rtl,
            ));
          }
          i = -1;
        }
      }
      return {
        x,
        y,
        placement: statefulPlacement,
        strategy,
        middlewareData,
      };
    };
    flip = function (options) {
      if (options === void 0) {
        options = {};
      }
      return {
        name: "flip",
        options,
        async fn(state) {
          var _middlewareData$arrow, _middlewareData$flip;
          const {
            placement,
            middlewareData,
            rects,
            initialPlacement,
            platform: platform2,
            elements,
          } = state;
          const {
            mainAxis: checkMainAxis = true,
            crossAxis: checkCrossAxis = true,
            fallbackPlacements: specifiedFallbackPlacements,
            fallbackStrategy = "bestFit",
            fallbackAxisSideDirection = "none",
            flipAlignment = true,
            ...detectOverflowOptions
          } = evaluate(options, state);
          if (
            (_middlewareData$arrow = middlewareData.arrow) != null &&
            _middlewareData$arrow.alignmentOffset
          ) {
            return {};
          }
          const side = getSide(placement);
          const initialSideAxis = getSideAxis(initialPlacement);
          const isBasePlacement =
            getSide(initialPlacement) === initialPlacement;
          const rtl = await (platform2.isRTL == null
            ? void 0
            : platform2.isRTL(elements.floating));
          const fallbackPlacements =
            specifiedFallbackPlacements ||
            (isBasePlacement || !flipAlignment
              ? [getOppositePlacement(initialPlacement)]
              : getExpandedPlacements(initialPlacement));
          const hasFallbackAxisSideDirection =
            fallbackAxisSideDirection !== "none";
          if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
            fallbackPlacements.push(
              ...getOppositeAxisPlacements(
                initialPlacement,
                flipAlignment,
                fallbackAxisSideDirection,
                rtl,
              ),
            );
          }
          const placements2 = [initialPlacement, ...fallbackPlacements];
          const overflow = await detectOverflow(state, detectOverflowOptions);
          const overflows = [];
          let overflowsData =
            ((_middlewareData$flip = middlewareData.flip) == null
              ? void 0
              : _middlewareData$flip.overflows) || [];
          if (checkMainAxis) {
            overflows.push(overflow[side]);
          }
          if (checkCrossAxis) {
            const sides2 = getAlignmentSides(placement, rects, rtl);
            overflows.push(overflow[sides2[0]], overflow[sides2[1]]);
          }
          overflowsData = [
            ...overflowsData,
            {
              placement,
              overflows,
            },
          ];
          if (!overflows.every((side2) => side2 <= 0)) {
            var _middlewareData$flip2, _overflowsData$filter;
            const nextIndex =
              (((_middlewareData$flip2 = middlewareData.flip) == null
                ? void 0
                : _middlewareData$flip2.index) || 0) + 1;
            const nextPlacement = placements2[nextIndex];
            if (nextPlacement) {
              return {
                data: {
                  index: nextIndex,
                  overflows: overflowsData,
                },
                reset: {
                  placement: nextPlacement,
                },
              };
            }
            let resetPlacement =
              (_overflowsData$filter = overflowsData
                .filter((d) => d.overflows[0] <= 0)
                .sort((a, b) => a.overflows[1] - b.overflows[1])[0]) == null
                ? void 0
                : _overflowsData$filter.placement;
            if (!resetPlacement) {
              switch (fallbackStrategy) {
                case "bestFit": {
                  var _overflowsData$filter2;
                  const placement2 =
                    (_overflowsData$filter2 = overflowsData
                      .filter((d) => {
                        if (hasFallbackAxisSideDirection) {
                          const currentSideAxis = getSideAxis(d.placement);
                          return (
                            currentSideAxis === initialSideAxis || // Create a bias to the `y` side axis due to horizontal
                            // reading directions favoring greater width.
                            currentSideAxis === "y"
                          );
                        }
                        return true;
                      })
                      .map((d) => [
                        d.placement,
                        d.overflows
                          .filter((overflow2) => overflow2 > 0)
                          .reduce((acc, overflow2) => acc + overflow2, 0),
                      ])
                      .sort((a, b) => a[1] - b[1])[0]) == null
                      ? void 0
                      : _overflowsData$filter2[0];
                  if (placement2) {
                    resetPlacement = placement2;
                  }
                  break;
                }
                case "initialPlacement":
                  resetPlacement = initialPlacement;
                  break;
              }
            }
            if (placement !== resetPlacement) {
              return {
                reset: {
                  placement: resetPlacement,
                },
              };
            }
          }
          return {};
        },
      };
    };
    offset = function (options) {
      if (options === void 0) {
        options = 0;
      }
      return {
        name: "offset",
        options,
        async fn(state) {
          var _middlewareData$offse, _middlewareData$arrow;
          const { x, y, placement, middlewareData } = state;
          const diffCoords = await convertValueToCoords(state, options);
          if (
            placement ===
              ((_middlewareData$offse = middlewareData.offset) == null
                ? void 0
                : _middlewareData$offse.placement) &&
            (_middlewareData$arrow = middlewareData.arrow) != null &&
            _middlewareData$arrow.alignmentOffset
          ) {
            return {};
          }
          return {
            x: x + diffCoords.x,
            y: y + diffCoords.y,
            data: {
              ...diffCoords,
              placement,
            },
          };
        },
      };
    };
    shift = function (options) {
      if (options === void 0) {
        options = {};
      }
      return {
        name: "shift",
        options,
        async fn(state) {
          const { x, y, placement } = state;
          const {
            mainAxis: checkMainAxis = true,
            crossAxis: checkCrossAxis = false,
            limiter = {
              fn: (_ref) => {
                let { x: x2, y: y2 } = _ref;
                return {
                  x: x2,
                  y: y2,
                };
              },
            },
            ...detectOverflowOptions
          } = evaluate(options, state);
          const coords = {
            x,
            y,
          };
          const overflow = await detectOverflow(state, detectOverflowOptions);
          const crossAxis = getSideAxis(getSide(placement));
          const mainAxis = getOppositeAxis(crossAxis);
          let mainAxisCoord = coords[mainAxis];
          let crossAxisCoord = coords[crossAxis];
          if (checkMainAxis) {
            const minSide = mainAxis === "y" ? "top" : "left";
            const maxSide = mainAxis === "y" ? "bottom" : "right";
            const min3 = mainAxisCoord + overflow[minSide];
            const max3 = mainAxisCoord - overflow[maxSide];
            mainAxisCoord = clamp(min3, mainAxisCoord, max3);
          }
          if (checkCrossAxis) {
            const minSide = crossAxis === "y" ? "top" : "left";
            const maxSide = crossAxis === "y" ? "bottom" : "right";
            const min3 = crossAxisCoord + overflow[minSide];
            const max3 = crossAxisCoord - overflow[maxSide];
            crossAxisCoord = clamp(min3, crossAxisCoord, max3);
          }
          const limitedCoords = limiter.fn({
            ...state,
            [mainAxis]: mainAxisCoord,
            [crossAxis]: crossAxisCoord,
          });
          return {
            ...limitedCoords,
            data: {
              x: limitedCoords.x - x,
              y: limitedCoords.y - y,
            },
          };
        },
      };
    };
  },
});

// node_modules/.pnpm/@floating-ui+dom@1.4.5/node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs
function getWindow(node) {
  var _node$ownerDocument;
  return (
    (node == null
      ? void 0
      : (_node$ownerDocument = node.ownerDocument) == null
        ? void 0
        : _node$ownerDocument.defaultView) || window
  );
}
function getComputedStyle$1(element) {
  return getWindow(element).getComputedStyle(element);
}
function isNode(value) {
  return value instanceof getWindow(value).Node;
}
function getNodeName(node) {
  if (isNode(node)) {
    return (node.nodeName || "").toLowerCase();
  }
  return "#document";
}
function isHTMLElement(value) {
  return (
    value instanceof HTMLElement ||
    value instanceof getWindow(value).HTMLElement
  );
}
function isShadowRoot(node) {
  if (typeof ShadowRoot === "undefined") {
    return false;
  }
  return (
    node instanceof getWindow(node).ShadowRoot || node instanceof ShadowRoot
  );
}
function isOverflowElement(element) {
  const { overflow, overflowX, overflowY, display } =
    getComputedStyle$1(element);
  return (
    /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) &&
    !["inline", "contents"].includes(display)
  );
}
function isTableElement(element) {
  return ["table", "td", "th"].includes(getNodeName(element));
}
function isContainingBlock(element) {
  const safari = isSafari();
  const css = getComputedStyle$1(element);
  return (
    css.transform !== "none" ||
    css.perspective !== "none" ||
    (css.containerType ? css.containerType !== "normal" : false) ||
    (!safari && (css.backdropFilter ? css.backdropFilter !== "none" : false)) ||
    (!safari && (css.filter ? css.filter !== "none" : false)) ||
    ["transform", "perspective", "filter"].some((value) =>
      (css.willChange || "").includes(value),
    ) ||
    ["paint", "layout", "strict", "content"].some((value) =>
      (css.contain || "").includes(value),
    )
  );
}
function isSafari() {
  if (typeof CSS === "undefined" || !CSS.supports) return false;
  return CSS.supports("-webkit-backdrop-filter", "none");
}
function isLastTraversableNode(node) {
  return ["html", "body", "#document"].includes(getNodeName(node));
}
function getCssDimensions(element) {
  const css = getComputedStyle$1(element);
  let width = parseFloat(css.width) || 0;
  let height = parseFloat(css.height) || 0;
  const hasOffset = isHTMLElement(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback =
    round(width) !== offsetWidth || round(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    $: shouldFallback,
  };
}
function isElement(value) {
  return value instanceof Element || value instanceof getWindow(value).Element;
}
function unwrapElement(element) {
  return !isElement(element) ? element.contextElement : element;
}
function getScale(element) {
  const domElement = unwrapElement(element);
  if (!isHTMLElement(domElement)) {
    return createCoords(1);
  }
  const rect = domElement.getBoundingClientRect();
  const { width, height, $: $2 } = getCssDimensions(domElement);
  let x = ($2 ? round(rect.width) : rect.width) / width;
  let y = ($2 ? round(rect.height) : rect.height) / height;
  if (!x || !Number.isFinite(x)) {
    x = 1;
  }
  if (!y || !Number.isFinite(y)) {
    y = 1;
  }
  return {
    x,
    y,
  };
}
function getVisualOffsets(element) {
  const win = getWindow(element);
  if (!isSafari() || !win.visualViewport) {
    return noOffsets;
  }
  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop,
  };
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  if (
    !floatingOffsetParent ||
    (isFixed && floatingOffsetParent !== getWindow(element))
  ) {
    return false;
  }
  return isFixed;
}
function getBoundingClientRect(
  element,
  includeScale,
  isFixedStrategy,
  offsetParent,
) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);
  let scale = createCoords(1);
  if (includeScale) {
    if (offsetParent) {
      if (isElement(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const visualOffsets = shouldAddVisualOffsets(
    domElement,
    isFixedStrategy,
    offsetParent,
  )
    ? getVisualOffsets(domElement)
    : createCoords(0);
  let x = (clientRect.left + visualOffsets.x) / scale.x;
  let y = (clientRect.top + visualOffsets.y) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement) {
    const win = getWindow(domElement);
    const offsetWin =
      offsetParent && isElement(offsetParent)
        ? getWindow(offsetParent)
        : offsetParent;
    let currentIFrame = win.frameElement;
    while (currentIFrame && offsetParent && offsetWin !== win) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = getComputedStyle(currentIFrame);
      const left =
        iframeRect.left +
        (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) *
          iframeScale.x;
      const top =
        iframeRect.top +
        (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x *= iframeScale.x;
      y *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x += left;
      y += top;
      currentIFrame = getWindow(currentIFrame).frameElement;
    }
  }
  return rectToClientRect({
    width,
    height,
    x,
    y,
  });
}
function getNodeScroll(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop,
    };
  }
  return {
    scrollLeft: element.pageXOffset,
    scrollTop: element.pageYOffset,
  };
}
function getDocumentElement(node) {
  var _ref;
  return (_ref =
    (isNode(node) ? node.ownerDocument : node.document) || window.document) ==
    null
    ? void 0
    : _ref.documentElement;
}
function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let { rect, offsetParent, strategy } = _ref;
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  if (offsetParent === documentElement) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0,
  };
  let scale = createCoords(1);
  const offsets = createCoords(0);
  if (
    isOffsetParentAnElement ||
    (!isOffsetParentAnElement && strategy !== "fixed")
  ) {
    if (
      getNodeName(offsetParent) !== "body" ||
      isOverflowElement(documentElement)
    ) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y,
  };
}
function getClientRects(element) {
  return Array.from(element.getClientRects());
}
function getWindowScrollBarX(element) {
  return (
    getBoundingClientRect(getDocumentElement(element)).left +
    getNodeScroll(element).scrollLeft
  );
}
function getDocumentRect(element) {
  const html = getDocumentElement(element);
  const scroll = getNodeScroll(element);
  const body = element.ownerDocument.body;
  const width = max2(
    html.scrollWidth,
    html.clientWidth,
    body.scrollWidth,
    body.clientWidth,
  );
  const height = max2(
    html.scrollHeight,
    html.clientHeight,
    body.scrollHeight,
    body.clientHeight,
  );
  let x = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y = -scroll.scrollTop;
  if (getComputedStyle$1(body).direction === "rtl") {
    x += max2(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x,
    y,
  };
}
function getParentNode(node) {
  if (getNodeName(node) === "html") {
    return node;
  }
  const result =
    // Step into the shadow DOM of the parent of a slotted node.
    node.assignedSlot || // DOM Element detected.
    node.parentNode || // ShadowRoot detected.
    (isShadowRoot(node) && node.host) || // Fallback.
    getDocumentElement(node);
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return node.ownerDocument ? node.ownerDocument.body : node.body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list) {
  var _node$ownerDocument;
  if (list === void 0) {
    list = [];
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody =
    scrollableAncestor ===
    ((_node$ownerDocument = node.ownerDocument) == null
      ? void 0
      : _node$ownerDocument.body);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    return list.concat(
      win,
      win.visualViewport || [],
      isOverflowElement(scrollableAncestor) ? scrollableAncestor : [],
    );
  }
  return list.concat(
    scrollableAncestor,
    getOverflowAncestors(scrollableAncestor),
  );
}
function getViewportRect(element, strategy) {
  const win = getWindow(element);
  const html = getDocumentElement(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    const visualViewportBased = isSafari();
    if (!visualViewportBased || (visualViewportBased && strategy === "fixed")) {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x,
    y,
  };
}
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x = left * scale.x;
  const y = top * scale.y;
  return {
    width,
    height,
    x,
    y,
  };
}
function getClientRectFromClippingAncestor(
  element,
  clippingAncestor,
  strategy,
) {
  let rect;
  if (clippingAncestor === "viewport") {
    rect = getViewportRect(element, strategy);
  } else if (clippingAncestor === "document") {
    rect = getDocumentRect(getDocumentElement(element));
  } else if (isElement(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element);
    rect = {
      ...clippingAncestor,
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y,
    };
  }
  return rectToClientRect(rect);
}
function hasFixedPositionAncestor(element, stopNode) {
  const parentNode = getParentNode(element);
  if (
    parentNode === stopNode ||
    !isElement(parentNode) ||
    isLastTraversableNode(parentNode)
  ) {
    return false;
  }
  return (
    getComputedStyle$1(parentNode).position === "fixed" ||
    hasFixedPositionAncestor(parentNode, stopNode)
  );
}
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = getOverflowAncestors(element).filter(
    (el) => isElement(el) && getNodeName(el) !== "body",
  );
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = getComputedStyle$1(element).position === "fixed";
  let currentNode = elementIsFixed ? getParentNode(element) : element;
  while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
    const computedStyle = getComputedStyle$1(currentNode);
    const currentNodeIsContaining = isContainingBlock(currentNode);
    if (!currentNodeIsContaining && computedStyle.position === "fixed") {
      currentContainingBlockComputedStyle = null;
    }
    const shouldDropCurrentNode = elementIsFixed
      ? !currentNodeIsContaining && !currentContainingBlockComputedStyle
      : (!currentNodeIsContaining &&
          computedStyle.position === "static" &&
          !!currentContainingBlockComputedStyle &&
          ["absolute", "fixed"].includes(
            currentContainingBlockComputedStyle.position,
          )) ||
        (isOverflowElement(currentNode) &&
          !currentNodeIsContaining &&
          hasFixedPositionAncestor(element, currentNode));
    if (shouldDropCurrentNode) {
      result = result.filter((ancestor) => ancestor !== currentNode);
    } else {
      currentContainingBlockComputedStyle = computedStyle;
    }
    currentNode = getParentNode(currentNode);
  }
  cache.set(element, result);
  return result;
}
function getClippingRect(_ref) {
  let { element, boundary, rootBoundary, strategy } = _ref;
  const elementClippingAncestors =
    boundary === "clippingAncestors"
      ? getClippingElementAncestors(element, this._c)
      : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstClippingAncestor = clippingAncestors[0];
  const clippingRect = clippingAncestors.reduce(
    (accRect, clippingAncestor) => {
      const rect = getClientRectFromClippingAncestor(
        element,
        clippingAncestor,
        strategy,
      );
      accRect.top = max2(rect.top, accRect.top);
      accRect.right = min2(rect.right, accRect.right);
      accRect.bottom = min2(rect.bottom, accRect.bottom);
      accRect.left = max2(rect.left, accRect.left);
      return accRect;
    },
    getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy),
  );
  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top,
  };
}
function getDimensions(element) {
  return getCssDimensions(element);
}
function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  const isFixed = strategy === "fixed";
  const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0,
  };
  const offsets = createCoords(0);
  if (isOffsetParentAnElement || (!isOffsetParentAnElement && !isFixed)) {
    if (
      getNodeName(offsetParent) !== "body" ||
      isOverflowElement(documentElement)
    ) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(
        offsetParent,
        true,
        isFixed,
        offsetParent,
      );
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height,
  };
}
function getTrueOffsetParent(element, polyfill) {
  if (
    !isHTMLElement(element) ||
    getComputedStyle$1(element).position === "fixed"
  ) {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  return element.offsetParent;
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else {
      currentNode = getParentNode(currentNode);
    }
  }
  return null;
}
function getOffsetParent(element, polyfill) {
  const window2 = getWindow(element);
  if (!isHTMLElement(element)) {
    return window2;
  }
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (
    offsetParent &&
    isTableElement(offsetParent) &&
    getComputedStyle$1(offsetParent).position === "static"
  ) {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (
    offsetParent &&
    (getNodeName(offsetParent) === "html" ||
      (getNodeName(offsetParent) === "body" &&
        getComputedStyle$1(offsetParent).position === "static" &&
        !isContainingBlock(offsetParent)))
  ) {
    return window2;
  }
  return offsetParent || getContainingBlock(element) || window2;
}
function isRTL(element) {
  return getComputedStyle(element).direction === "rtl";
}
var min2,
  max2,
  round,
  createCoords,
  noOffsets,
  getElementRects,
  platform,
  computePosition2;
var init_floating_ui_dom = __esm({
  "node_modules/.pnpm/@floating-ui+dom@1.4.5/node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs"() {
    "use strict";
    init_floating_ui_core();
    init_floating_ui_core();
    min2 = Math.min;
    max2 = Math.max;
    round = Math.round;
    createCoords = (v) => ({
      x: v,
      y: v,
    });
    noOffsets = /* @__PURE__ */ createCoords(0);
    getElementRects = async function (_ref) {
      let { reference, floating, strategy } = _ref;
      const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
      const getDimensionsFn = this.getDimensions;
      return {
        reference: getRectRelativeToOffsetParent(
          reference,
          await getOffsetParentFn(floating),
          strategy,
        ),
        floating: {
          x: 0,
          y: 0,
          ...(await getDimensionsFn(floating)),
        },
      };
    };
    platform = {
      convertOffsetParentRelativeRectToViewportRelativeRect,
      getDocumentElement,
      getClippingRect,
      getOffsetParent,
      getElementRects,
      getClientRects,
      getDimensions,
      getScale,
      isElement,
      isRTL,
    };
    computePosition2 = (reference, floating, options) => {
      const cache = /* @__PURE__ */ new Map();
      const mergedOptions = {
        platform,
        ...options,
      };
      const platformWithCache = {
        ...mergedOptions.platform,
        _c: cache,
      };
      return computePosition(reference, floating, {
        ...mergedOptions,
        platform: platformWithCache,
      });
    };
  },
});

// src/components/popup.ts
function createPopup(props) {
  const {
    root,
    trigger,
    triggerType = "click",
    content,
    options,
    onOpen,
    onClose,
    placement = "bottom-start",
    offsetOptions = { mainAxis: 5, crossAxis: 5 },
  } = props;
  const $popupContent = $('<div class="v2p-popup-content">');
  const $popup = $('<div class="v2p-popup" tabindex="0">')
    .css("visibility", "hidden")
    .append($popupContent);
  root.append($popup);
  if (content) {
    $popup.append(content);
  }
  const popup = $popup.get(0);
  const handleClickOutside = (ev) => {
    if ($(ev.target).closest(popup).length === 0) {
      handlePopupClose();
    }
  };
  const handlePopupClose = () => {
    $popup.css("visibility", "hidden");
    $(document).off("click", handleClickOutside);
    onClose?.();
    popupControl2.onClose?.();
  };
  const handlePopupOpen = ($reference) => {
    if (!$reference) {
      return;
    }
    setTimeout(() => {
      $(document).on("click", handleClickOutside);
    });
    const referenceElement = $reference.get(0);
    computePosition2(referenceElement, popup, {
      placement,
      middleware: [offset(offsetOptions), flip(), shift({ padding: 8 })],
      ...options,
    })
      .then(({ x, y }) => {
        Object.assign(popup.style, {
          left: `${x}px`,
          top: `${y}px`,
        });
        $popup.css("visibility", "visible");
      })
      .catch(() => {
        handlePopupClose();
        createToast({ message: "\u274C Popup \u6E32\u67D3\u5931\u8D25" });
      });
    onOpen?.();
  };
  const popupControl2 = {
    $content: $popupContent,
    isOver: false,
    open: (reference) => {
      handlePopupOpen(reference);
    },
    close: handlePopupClose,
  };
  if (triggerType === "hover") {
    $popup.on("mouseover", () => {
      if (!popupControl2.isOver) {
        popupControl2.isOver = true;
        $popup.off("mouseleave").on("mouseleave", () => {
          popupControl2.isOver = false;
          setTimeout(() => {
            if (!popupControl2.isOver) {
              popupControl2.close();
            }
          }, hoverDelay);
        });
      }
    });
  }
  trigger?.on("click", () => {
    if (popup.style.visibility !== "hidden") {
      handlePopupClose();
    } else {
      handlePopupOpen(trigger);
    }
  });
  return popupControl2;
}
var hoverDelay;
var init_popup = __esm({
  "src/components/popup.ts"() {
    "use strict";
    init_floating_ui_dom();
    init_toast();
    hoverDelay = 350;
  },
});

// src/contents/topic/avatar.ts
function processAvatar(params) {
  const {
    $trigger,
    popupControl: popupControl2,
    commentData,
    shouldWrap = true,
    openInNewTab = false,
    onSetTagsClick,
  } = params;
  const { memberName, memberAvatar, memberLink } = commentData;
  let abortController = null;
  const handleOver = () => {
    popupControl2.close();
    popupControl2.open($trigger);
    const $content = $(`
      <div class="v2p-member-card">
        <div class="v2p-info">
          <div class="v2p-info-left">
            <a class="v2p-avatar-box" href="${memberLink}" target="${openInNewTab ? "_blank" : "_self"}">
              <img class="v2p-avatar" src="${memberAvatar}">
            </a>
          </div>

          <div class="v2p-info-right">
            <div class="v2p-username">
              <a href="${memberLink}" target="${openInNewTab ? "_blank" : "_self"}">${memberName}</a>
            </div>
            <div class="v2p-no v2p-loading"></div>
            <div class="v2p-created-date v2p-loading"></div>
          </div>

          </div>

          <div class="v2p-bio" style="disply:none;"></div>

          <div class="v2p-member-card-actions"></div>
      </div>
    `);
    popupControl2.$content.empty().append($content);

    void (async () => {
      if (!memberDataCache.has(memberName)) {
        abortController = new AbortController();
        popupControl2.onClose = () => {
          abortController?.abort();
        };
        try {
          const memberData = await fetchUserInfo(memberName, {
            signal: abortController.signal,
          });
          memberDataCache.set(memberName, {
            ...memberData,
            registerDays: getRegisterDays(memberData.created),
          });
        } catch (err) {
          if (err instanceof Error) {
            $content.html(`<span>${err.message}</span>`);
            if (err.cause === 404) {
              memberDataCache.set(memberName, banned);
            }
          }
          return null;
        }
      }
      const data = memberDataCache.get(memberName);
      if (typeof data === "object") {
        $content
          .find(".v2p-no")
          .removeClass("v2p-loading")
          .text(`V2EX \u7B2C ${data.id} \u53F7\u4F1A\u5458`);
        $content
          .find(".v2p-created-date")
          .removeClass("v2p-loading")
          .text(`\u52A0\u5165\u4E8E ${formatTimestamp(data.created)}`);
        if (data.registerDays <= 30) {
          $content
            .find(".v2p-info-right")
            .append(
              `<div class="v2p-register-days" style="margin: 5px 0;">${data.registerDays <= 15 ? "15" : "30"} \u5929\u5185\u6CE8\u518C</div>`,
            );
        }
        if (data.bio && data.bio.trim().length > 0) {
          $content.find(".v2p-bio").css("disply", "block").text(data.bio);
        }
      } else if (typeof data === "symbol" && data === banned) {
        $content.html(
          "<span>\u67E5\u65E0\u6B64\u7528\u6237\uFF0C\u7591\u4F3C\u5DF2\u88AB\u5C01\u7981</span>",
        );
      }
    })();
  };
  let isOver = false;
  $trigger
    .on("mouseover", () => {
      isOver = true;
      setTimeout(() => {
        if (isOver) {
          handleOver();
        }
      }, hoverDelay);
    })
    .on("mouseleave", () => {
      isOver = false;
      setTimeout(() => {
        if (!popupControl2.isOver && !isOver) {
          popupControl2.close();
        }
      }, hoverDelay);
    });
  if (shouldWrap) {
    $trigger.wrap(
      `<a href="/member/${commentData.memberName}" target="_blank" style="cursor: pointer;">`,
    );
  }
}
var banned, memberDataCache;
var init_avatar = __esm({
  "src/contents/topic/avatar.ts"() {
    "use strict";
    init_button();
    init_popup();
    init_services();
    init_utils();
    init_helpers();
    init_content();
    banned = Symbol();
    memberDataCache = /* @__PURE__ */ new Map();
  },
});

// src/contents/topic/comment.ts
function handleFilteredComments() {}
function processActions($cellDom, data) {
  const $actions = $cellDom.find(
    "> table > tbody > tr > td:last-of-type > .fr",
  );
  const $controls = $('<span class="v2p-controls">');
  const $thankIcon = $(
    `<span
      class="v2p-control v2p-control-thank"
      data-id="${data.id}"
      data-member-name="${data.memberName}"
     >
        <i data-lucide="heart"></i>
     </span>`,
  );
  const thankArea = $actions.find("> .thank_area");
  const thanked = thankArea.hasClass("thanked");
  if (thanked) {
    $thankIcon.addClass("v2p-thanked");
    $controls.append($("<a>").append($thankIcon));
  } else {
    const thankEle = thankArea.find("> .thank");
    const $hide = thankEle.eq(0).removeClass("thank");
    const $thank = thankEle.eq(1).removeClass("thank");
    $hide.html(
      `<span class="v2p-control v2p-hover-btn v2p-control-hide"><i data-lucide="eye-off"></i></span>`,
    );
    $thankIcon.addClass("v2p-hover-btn").replaceAll($thank);
    $controls.append($hide).append($thankIcon);
  }
  const $reply = $actions.find("a:last-of-type");
  // 删除原来的图标 / 文本
  $reply.empty();
  // 插入统一风格的按钮
  $reply.append(
    `<span class="v2p-control v2p-hover-btn v2p-control-reply">
      <i data-lucide="message-square"></i>
   </span>`,
  );
  $controls.append($reply);

  thankArea.remove();
  const floorNum = $actions.find(".no").clone();

  $reply.on("click", () => {
    const replyVal = $replyTextArea.val();
    if (typeof replyVal === "string" && replyVal.length > 0) {
      const floor = floorNum.text();
      const replyComment = commentDataList.find((it) => it.floor === floor);
      if (replyComment) {
        const replyMemberName = replyComment.memberName;
        const moreThanOneReply =
          commentDataList.findIndex(
            (it) => it.memberName === replyMemberName && it.floor !== floor,
          ) !== -1;
        if (moreThanOneReply) {
          insertTextToReplyInput(`#${floor} `);
        } else {
          const $page = $(".v2p-paging")
            .eq(0)
            .find(".page_normal, .page_current");
          if ($page.length > 1) {
            const onLastPage = $page.last().hasClass("page_current");
            if (!onLastPage) {
              insertTextToReplyInput(`#${floor} `);
            }
          }
        }
      }
    }
  });

  // ★ 移动端：点击某一楼（包括楼中楼）高亮这一楼的工具栏
  if ($body.hasClass("v2p-mobile")) {
    $cellDom.on("click.v2p-controls", function (ev) {
      const $target = $(ev.target);

      // 点到工具栏本身 / 链接 / 图片 / 表单控件时，不触发「高亮当前楼」逻辑
      if (
        $target.closest(".v2p-controls").length ||
        $target.closest("a, img, button, input, textarea").length
      ) {
        return;
      }

      // ★ 关键：先在当前这楼的 handler 里阻止事件继续冒泡
      // 这样即使当前楼是楼中楼，也不会再触发父楼的 handler
      ev.stopPropagation();

      // 先把所有楼的工具栏隐藏
      $('.cell[id^="r_"] .v2p-controls').css("opacity", 0);

      // 再只高亮这一楼（用 this = 当前绑定 handler 的 cell）
      $(this).find(".v2p-controls").css("opacity", 0.5);
    });
  }

  $actions.empty().append($controls, floorNum);
}

async function handleComments() {
  const storage = getStorageSync();
  const tagData = void 0;
  const options = storage["options" /* Options */];
  if (false && options.reply.preload !== "off") {
    const $paging = $(".v2p-paging");
    if ($paging.length > 0) {
      const $pagingTop = $paging.eq(0);
      const $pagingBottom = $paging.eq(1);
      const $pageNormal = $paging.find(".page_normal");
      const $pagingTopNormal = $pagingTop.find(".page_normal");
      const toastControl = createToast({
        message:
          "\u6B63\u5728\u9884\u52A0\u8F7D\u56DE\u590D\uFF0C\u8BF7\u7A0D\u5019...",
        duration: 0,
      });
      try {
        const $pagingBottomNormal = $pagingBottom.find(".page_normal");
        const $pageCurrent = $pagingTop.find(".page_current");
        const currentPage = $pageCurrent.text();
        if (currentPage === "1") {
          const pages = [];
          $pagingTopNormal.each((i, ele) => {
            if (i <= 1) {
              if (ele.textContent) {
                ele.classList.add("page_current");
                ele.classList.remove("page_normal");
                $pagingBottomNormal
                  .eq(i)
                  .addClass("page_current")
                  .removeClass("page_normal");
                pages.push(ele.textContent);
              }
            }
          });
          if (pages.length > 0) {
            const pagesText = await Promise.all(
              pages.map((p) => crawlTopicPage(window.location.pathname, p)),
            );
            pagesText.map((pageText) => {
              $pagingBottom.before($(pageText).find('.cell[id^="r_"]'));
            });
          }
          updateCommentCells();
        }
        toastControl.clear();
      } catch (err) {
        if (err instanceof Error) {
          console.error(
            `\u52A0\u8F7D\u591A\u9875\u56DE\u590D\u51FA\u9519\uFF1A${err.message}`,
          );
        }
        createToast({
          message: "\u274C \u52A0\u8F7D\u591A\u9875\u56DE\u590D\u5931\u8D25",
        });
        $pageNormal.removeClass("page_current").addClass("page_normal");
      }
    }
  }
  if (options.replyContent.hideReplyTime) {
    $(".cell .ago").addClass("v2p-auto-hide");
  }
  const canHideRefName =
    options.nestedReply.display === "indent" &&
    !!options.replyContent.hideRefName;
  commentDataList = getCommentDataList({
    options,
    $commentTableRows,
    $commentCells,
  });
  {
    const memberNames = /* @__PURE__ */ new Set([topicOwnerName]);
    $commentCells.each((i, cellDom) => {
      const currentComment = commentDataList.at(i);
      if (currentComment?.id !== cellDom.id) {
        return;
      }
      const $cellDom = $(cellDom);
      const { memberName, thanked } = currentComment;
      memberNames.add(memberName);
      processAvatar({
        $trigger: $cellDom.find(".avatar, .dark"),
        popupControl,
        commentData: currentComment,
        openInNewTab: options.openInNewTab,
      });
      if (memberName === loginName && !options.hideAccount) {
        $cellDom
          .find(".badges")
          .append(
            `<div class="badge ${memberName === topicOwnerName ? "mod" : "you"}">YOU</div>`,
          );
      }
      const $likesBox = $cellDom.find(".small.fade").addClass("v2p-likes-box");
      $likesBox
        .find('img[alt="\u2764\uFE0F"]')
        .replaceWith(
          '<span class="v2p-icon-heart"><i data-lucide="heart"></i></span>',
        );
      if (thanked) {
        $likesBox.addClass("v2p-thanked");
      }
      processActions($cellDom, currentComment);
      if (canHideRefName) {
        if (currentComment.contentHtml) {
          $cellDom.find(".reply_content").html(currentComment.contentHtml);
        }
      }
    });

    updateCommentCells();

    $(".v2p-control-thank").on("click", (ev) => {
      ev.stopPropagation();
      const id = ev.currentTarget.dataset.id;
      const memberName = ev.currentTarget.dataset.memberName;
      if (typeof id === "string" && typeof memberName === "string") {
        if (
          confirm(
            `\u786E\u8BA4\u82B1\u8D39 10 \u4E2A\u94DC\u5E01\u5411 @${memberName} \u7684\u8FD9\u6761\u56DE\u590D\u53D1\u9001\u611F\u8C22\uFF1F`,
          )
        ) {
          const replyId = id.split("_").at(1);
          if (replyId) {
            void thankReply({
              replyId,
              onSuccess: () => {
                const $cell = $(`.cell[id="r_${replyId}"]`);
                const $tableInCell = $cell.find("> table");
                const $likesBox = $tableInCell.find(".v2p-likes-box");
                const $firstLikesBox = $likesBox.eq(0);
                const likes = Number($firstLikesBox.text());
                const $clonedIconHeart = $firstLikesBox
                  .find(".v2p-icon-heart")
                  .clone();
                if (likes > 0) {
                  $likesBox
                    .addClass("v2p-thanked")
                    .empty()
                    .append($clonedIconHeart, ` ${likes + 1}`);
                } else {
                  $(`
                      <span class="small v2p-likes-box v2p-thanked" style="position:relative;top:-1px;">
                        &nbsp;&nbsp;<span class="v2p-icon-heart"><i data-lucide="heart"></i></span>1
                      </span>
                      `).insertAfter($tableInCell.find(".ago"));
                  loadIcons();
                }
                const $thankAction = $tableInCell.find(".v2p-control-thank");
                $thankAction.addClass("v2p-thanked").off("click");
                $thankAction.siblings().has(".v2p-control-hide").hide();
              },
              onFail: () => {
                createToast({
                  message: "\u274C \u611F\u8C22\u56DE\u590D\u5931\u8D25",
                });
              },
            });
          }
        }
      }
    });
  }
  handleNestedComment({ options, $commentCells, commentDataList });
  {
    const $opAvatar = $topicHeader.find(".avatar");
    const $opName = $topicHeader.find('.gray a[href^="/member"]');
    const memberName = $opAvatar.prop("alt");
    const memberAvatar = $opAvatar.prop("src");
    const memberLink = $topicHeader.find(".fr > a").prop("href");
    if (
      typeof memberName === "string" &&
      typeof memberAvatar === "string" &&
      typeof memberLink === "string"
    ) {
      processAvatar({
        $trigger: $opAvatar,
        popupControl,
        commentData: { memberName, memberAvatar, memberLink },
        openInNewTab: options.openInNewTab,
      });
      processAvatar({
        $trigger: $opName,
        popupControl,
        commentData: { memberName, memberAvatar, memberLink },
        shouldWrap: false,
        openInNewTab: options.openInNewTab,
      });
      fetchUserInfo(memberName).then((memberData) => {
        const registerDays = getRegisterDays(memberData.created);
        memberDataCache.set(memberName, { ...memberData, registerDays });
        if (registerDays <= 30) {
          $opName.append(
            `<span class="v2p-register-days">${registerDays <= 15 ? "15" : "30"} \u5929\u5185\u6CE8\u518C</span>`,
          );
        }
      });
    }
  }
  if (options.replyContent.showImgInPage) {
    window.requestIdleCallback(() => {
      handleTopicImg();
    });
  }
  window.requestIdleCallback(() => {
    replaceCommentEmojiWithHD();
    handleLinkPreview();
  });
}
var commentDataList, popupControl;
var init_comment = __esm({
  "src/contents/topic/comment.ts"() {
    "use strict";
    init_lucide();
    init_modal();
    init_popup();
    init_toast();
    init_constants();
    init_services();
    init_utils();
    init_dom();
    init_globals();
    init_helpers();
    init_avatar();
    init_content();
    commentDataList = [];
    popupControl = createPopup({
      root: $wrapper,
      triggerType: "hover",
      placement: "right-start",
      offsetOptions: { mainAxis: 8, crossAxis: -4 },
    });
  },
});

var $layoutToggle,
  iconLayoutV,
  iconLayoutH,
  switchToHorizontalLayout,
  switchToVerticalLayout;
var init_layout = __esm({
  "src/contents/topic/layout.ts"() {
    "use strict";
    init_lucide();
    init_constants();
    init_utils();
    init_globals();
    iconLayoutV = createElement$1(PanelTop);
    iconLayoutV.setAttribute("width", "100%");
    iconLayoutV.setAttribute("height", "100%");
    iconLayoutH = createElement$1(PanelRight);
    iconLayoutH.setAttribute("width", "100%");
    iconLayoutH.setAttribute("height", "100%");
  },
});

// src/contents/topic/paging.ts
function handlePaging() {
  const $notCommentCells = $commentBox.find('> .cell:not([id^="r_"])');
  if ($notCommentCells.length <= 1) {
    return;
  }
  const pagingCells = $notCommentCells.slice(1).addClass("v2p-paging");
  const pageBtns = pagingCells.find(".super.button");
  pageBtns.eq(0).addClass("v2p-prev-btn");
  pageBtns.eq(1).addClass("v2p-next-btn");
}
var init_paging = __esm({
  "src/contents/topic/paging.ts"() {
    "use strict";
    init_globals();
  },
});

// src/components/image-upload.ts
function bindImageUpload(props) {
  const { $wrapper: $wrapper2, $input, insertText, replaceText } = props;
  const $uploadBar = $(`<div class="v2p-reply-upload-bar">${uploadTip}</div>`);
  const handleUploadImage = (file) => {
    const placeholder = "[\u4E0A\u4F20\u56FE\u7247\u4E2D...]";
    insertText(` ${placeholder} `);
    $uploadBar
      .addClass("v2p-reply-upload-bar-disabled")
      .text("\u6B63\u5728\u4E0A\u4F20\u56FE\u7247...");
    uploadImage(file)
      .then((imgLink) => {
        replaceText(placeholder, imgLink);
      })
      .catch(() => {
        replaceText(placeholder, "");
        window.alert(
          "\u274C \u4E0A\u4F20\u56FE\u7247\u5931\u8D25\uFF0C\u8BF7\u6253\u5F00\u63A7\u5236\u53F0\u67E5\u770B\u539F\u56E0",
        );
      })
      .finally(() => {
        $uploadBar.removeClass("v2p-reply-upload-bar-disabled").text(uploadTip);
      });
  };
  const handleClickUploadImage = () => {
    const imgInput = document.createElement("input");
    imgInput.style.display = "none";
    imgInput.type = "file";
    imgInput.accept = "image/*";
    imgInput.addEventListener("change", () => {
      const selectedFile = imgInput.files?.[0];
      if (selectedFile) {
        handleUploadImage(selectedFile);
      }
    });
    imgInput.click();
  };
  document.addEventListener("paste", (ev) => {
    if (!(ev instanceof ClipboardEvent)) {
      return;
    }
    if ($input && !$input.get(0)?.matches(":focus")) {
      return;
    }
    const items = ev.clipboardData?.items;
    if (!items) {
      return;
    }
    const imageItem = Array.from(items).find((item) =>
      item.type.includes("image"),
    );
    if (imageItem) {
      ev.preventDefault();
      const file = imageItem.getAsFile();
      if (file) {
        handleUploadImage(file);
      }
    }
  });
  $wrapper2.get(0)?.addEventListener("drop", (ev) => {
    ev.preventDefault();
    if (!(ev instanceof DragEvent)) {
      return;
    }
    const file = ev.dataTransfer?.files[0];
    if (file) {
      handleUploadImage(file);
    }
  });
  $(".flex-one-row:last-of-type > .gray").text("");
  $uploadBar.on("click", () => {
    if (!$uploadBar.hasClass("v2p-reply-upload-bar-disabled")) {
      handleClickUploadImage();
    }
  });
  $wrapper2.append($uploadBar);
  return {
    uploadBar: $uploadBar,
  };
}
var uploadTip;
var init_image_upload = __esm({
  "src/components/image-upload.ts"() {
    "use strict";
    init_services();
    uploadTip =
      "\u9009\u62E9\u3001\u7C98\u8D34\u3001\u62D6\u653E\u4E0A\u4F20\u56FE\u7247\u3002";
  },
});

// src/contents/topic/reply.ts
function handleReplyActions() {
  const os = getOS();
  const isMac = navigator.userAgent.includes("Mac OS");
  const replyBtnText = `回复<kbd>${isMac ? "Cmd" : "Ctrl"}+Enter</kbd>`;

  const $replyBtn = createButton({
    children: replyBtnText,
    type: "submit",
  }).replaceAll($replyBox.find('input[type="submit"]'));
  $replyForm.on("submit", () => {
    const replyVal = $replyTextArea.val();
    if (typeof replyVal === "string") {
      $replyTextArea.val(transformEmoji(replyVal));
    }
    $replyBtn.text("\u63D0\u4EA4\u56DE\u590D\u4E2D...").prop("disabled", true);
    setTimeout(() => {
      $replyBtn.html(replyBtnText).prop("disabled", false);
    }, 5e3);
  });
  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter" && (ev.ctrlKey || ev.metaKey)) {
      ev.preventDefault();
      $replyForm.trigger("submit");
    }
  });
  {
    const emoticonGroup = $('<div class="v2p-emoji-group">');
    const emoticonList = $('<div class="v2p-emoji-list">');
    const emoticonSpan = $('<span class="v2p-emoji">');
    const groups = emoticons.map((emojiGroup) => {
      const group = emoticonGroup.clone();
      const list = emoticonList.clone();
      group.append(`<div class="v2p-emoji-title">${emojiGroup.title}</div>`);
      list.append(
        emojiGroup.list.map((emoji) => {
          const emoticon = emoticonSpan.clone();
          if (emojiGroup.title === "\u6D41\u884C") {
            const emojiLink = emojiLinks[emoji].hd;
            emoticon.html(`<img src="${emojiLink}" />`).prop("title", emoji);
          } else {
            emoticon.text(emoji);
          }
          emoticon.on("click", () => {
            insertTextToReplyInput(emoji);
          });
          return emoticon;
        }),
      );
      group.append(list);
      return group;
    });
    const emoticonsBox = $('<div class="v2p-emoticons-box">').append(groups);
    const $emojiBtn = createButton({
      children:
        '<span style="width:18px; height:18px;"><i data-lucide="smile"></i></span>',
    }).insertAfter($replyBtn);
    const $emojiContent = $('<div class="v2p-emoji-container">')
      .append(emoticonsBox)
      .appendTo($replyBox)
      .on("click", () => {
        focusReplyInput();
      });
    const keyupHandler = (ev) => {
      if (ev.key === "Escape") {
        ev.preventDefault();
        emojiPopup.close();
      }
    };
    $emojiBtn.on("click", () => {
      focusReplyInput();
    });
    const emojiPopup = createPopup({
      root: $replyBox,
      trigger: $emojiBtn,
      content: $emojiContent,
      options: { placement: "right-end" },
      onOpen: () => {
        $body.on("keydown", keyupHandler);
      },
      onClose: () => {
        $body.off("keydown", keyupHandler);
      },
    });
  }
  {
    $replyBox
      .find("#undock-button, #undock-button + a")
      .addClass("v2p-hover-btn")
      .css("padding", "5px 4px");
  }
}
function handleReply() {
  $replyTextArea
    .attr(
      "placeholder",
      "\u7559\u4E0B\u5BF9\u4ED6\u4EBA\u6709\u5E2E\u52A9\u7684\u56DE\u590D",
    )
    .wrap('<div class="v2p-reply-wrap">');
  const $replyWrap = $(".v2p-reply-wrap");
  const $replyPreview = $('<div class="v2p-reply-preview">');
  $replyPreview.hide().insertAfter($replyWrap);
  bindImageUpload({
    $wrapper: $replyWrap,
    $input: $replyTextArea,
    insertText: (text) => {
      insertTextToReplyInput(text);
    },
    replaceText: (find, replace) => {
      const val = $replyTextArea.val();
      if (typeof val === "string") {
        const newVal = val.replace(find, replace);
        $replyTextArea.val(newVal).trigger("focus");
      }
    },
  });
  {
    const $replyTabs = $('<div class="v2p-reply-tabs">');
    const $replyTabEdit = $(
      '<div class="v2p-reply-tab active">\u7F16\u8F91</div>',
    );
    const $replyTabPreview = $('<div class="v2p-reply-tab">\u9884\u89C8</div>');
    $replyTabEdit
      .on("click", () => {
        $replyTabEdit.addClass("active");
        $replyTabPreview.removeClass("active");
        $replyWrap.show();
        $replyPreview.hide();
      })
      .appendTo($replyTabs);
    let lastPreviewText = null;
    $replyTabPreview
      .on("click", () => {
        if (!$replyTabPreview.hasClass("active")) {
          $replyTabPreview.addClass("active");
          $replyTabEdit.removeClass("active");
          const replyText = $replyTextArea.val();
          if (typeof replyText === "string") {
            $replyWrap.hide();
            $replyPreview.show();
            if (replyText.trim() === "") {
              $replyPreview.html(
                "\u6CA1\u6709\u53EF\u9884\u89C8\u7684\u5185\u5BB9",
              );
            } else {
              const textToPreview = transformEmoji(replyText);
              const handlePreview = async () => {
                $replyPreview.html("\u6B63\u5728\u52A0\u8F7D\u9884\u89C8...");
                try {
                  const renderedContent = await getCommentPreview({
                    text: textToPreview,
                    syntax: "default",
                  });
                  $replyPreview.html(renderedContent);
                  replaceEmojiWithHD($replyPreview.find(".embedded_image"));
                  lastPreviewText = textToPreview;
                } catch {
                  $replyPreview.html(
                    '\u9884\u89C8\u5931\u8D25\uFF0C<a class="v2p-preview-retry">\u70B9\u51FB\u91CD\u8BD5</a>\u3002',
                  );
                  $replyPreview.find(".v2p-preview-retry").on("click", () => {
                    void handlePreview();
                  });
                }
              };
              if (replyText !== lastPreviewText) {
                void handlePreview();
              }
            }
          }
        }
      })
      .appendTo($replyTabs);
    $replyBox
      .find("> .cell:first-of-type > div:first-of-type")
      .replaceWith($replyTabs);
  }
  $(".flex-one-row:last-of-type > .gray").text("");
  handleReplyActions();
}
var init_reply = __esm({
  "src/contents/topic/reply.ts"() {
    "use strict";
    init_button();
    init_image_upload();
    init_popup();
    init_constants();
    init_services();
    init_utils();
    init_globals();
    init_helpers();
  },
});

// src/contents/topic/tool.ts
function handleTools() {
  const storage = getStorageSync();
  const options = storage["options" /* Options */];
  const $tools = $(`
    <div class="cell v2p-tools">
      <span class="v2p-tool v2p-hover-btn v2p-tool-reply">
        <span class="v2p-tool-icon"><i data-lucide="message-square-plus"></i></span>\u56DE\u590D\u4E3B\u9898
      </span>
      <span class="v2p-tool v2p-hover-btn v2p-tool-scroll-top">
        <span class="v2p-tool-icon"><i data-lucide="chevrons-up"></i></span>\u56DE\u5230\u9876\u90E8
      </span>
      <span class="v2p-tool v2p-hover-btn v2p-tool-more">
        <span class="v2p-tool-icon"><i data-lucide="package-plus"></i></span>\u66F4\u591A\u529F\u80FD
      </span>
    </div>
  `);
  $tools.find(".v2p-tool-reply").on("click", () => {
    $replyTextArea.trigger("focus");
  });

  $tools.find(".v2p-tool-scroll-top").on("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  {
    const $moreTool = $tools.find(".v2p-tool-more");
    const $toolContent = $(`
      <div class="v2p-select-dropdown">
        <div class="v2p-select-item v2p-reply-tool-decode">\u89E3\u6790\u672C\u9875 Base64</div>
        <div class="v2p-select-item v2p-reply-tool-encode">\u6587\u672C\u8F6C Base64</div>
      </div>
    `);
    const toolsPopup = createPopup({
      root: $replyBox,
      trigger: $moreTool,
      content: $toolContent,
      offsetOptions: { mainAxis: 5, crossAxis: -5 },
    });
    $toolContent.find(".v2p-reply-tool-decode").on("click", () => {
      decodeBase64TopicPage();
    });
    $toolContent.find(".v2p-reply-tool-encode").on("click", () => {
      focusReplyInput();
      setTimeout(() => {
        const inputText = window.prompt(
          "\u8F93\u5165\u8981\u52A0\u5BC6\u7684\u5B57\u7B26\u4E32\uFF0C\u5B8C\u6210\u540E\u5C06\u586B\u5199\u5230\u56DE\u590D\u6846\u4E2D\uFF1A",
        );
        if (inputText) {
          let encodedText;
          try {
            encodedText = window.btoa(encodeURIComponent(inputText));
          } catch (err) {
            const errorTip =
              "\u8BE5\u6587\u672C\u65E0\u6CD5\u7F16\u7801\u4E3A Base64";
            console.error(
              err,
              `${errorTip}\uFF0C\u53EF\u80FD\u7684\u9519\u8BEF\u539F\u56E0\uFF1A\u6587\u672C\u5305\u542B\u4E2D\u6587\u3002`,
            );
            createToast({ message: errorTip });
          }
          if (encodedText) {
            insertTextToReplyInput(encodedText);
          }
        }
      });
    });

    const canHideRefName =
      options.nestedReply.display === "indent" &&
      !!options.replyContent.hideRefName;
    if (canHideRefName) {
      let isHidden = options.replyContent.hideRefName;
      const $toolToggleDisplay = $(
        '<div class="v2p-select-item">\u663E\u793A @ \u7528\u6237\u540D</div>',
      );
      $toolToggleDisplay.on("click", () => {
        if (isHidden) {
          isHidden = false;
          $toolToggleDisplay.text("\u9690\u85CF @ \u7528\u6237\u540D");
          $(".v2p-member-ref").addClass("v2p-member-ref-show");
        } else {
          isHidden = true;
          $toolToggleDisplay.text("\u663E\u793A @ \u7528\u6237\u540D");
          $(".v2p-member-ref").removeClass("v2p-member-ref-show");
        }
      });
      $toolContent.prepend($toolToggleDisplay);
    }
    const $toolToggleLayout = $(
      `
      <div class="v2p-select-item v2p-reply-tool-layout">
        ${options.reply.layout === "horizontal" ? "\u5207\u6362\u4E3A\u5782\u76F4\u5E03\u5C40" : "\u5207\u6362\u4E3A\u6C34\u5E73\u5E03\u5C40"}
      </div>
      `,
    );
    $toolContent.find(".v2p-select-item").on("click", () => {
      toolsPopup.close();
    });
  }
  $infoCard.addClass("v2p-tool-box").append($tools);
  loadIcons();
}
var init_tool = __esm({
  "src/contents/topic/tool.ts"() {
    "use strict";
    init_popup();
    init_toast();
    init_constants();
    init_utils();
    init_globals();
    init_helpers();
    init_layout();
  },
});

// src/contents/topic/index.ts
var topic_exports = {};
var init_topic = __esm({
  "src/contents/topic/index.ts"() {
    "use strict";
    init_constants();
    init_utils();
    init_globals();
    init_helpers();
    init_comment();
    init_content();
    init_layout();
    init_paging();
    init_reply();
    init_tool();
    void (async () => {
      const storage = await getStorage();
      const options = storage["options" /* Options */];
      if (options.openInNewTab) {
        $topicHeader.find('a[href^="/member/"]').prop("target", "_blank");
        $commentTableRows
          .find("> td:nth-child(3) > strong > a")
          .prop("target", "_blank");
      }
      handleTools();
      {
        $(document).on("keydown", (ev) => {
          if (!ev.isDefaultPrevented()) {
            if (ev.key === "Escape") {
              const $replyContent = $("#reply_content");
              if ($replyBox.hasClass("reply-box-sticky")) {
                $replyBox.removeClass("reply-box-sticky");
                $("#undock-button").css("display", "none");
              }
              $replyContent.trigger("blur");
            }
          }
        });
      }
      handleContent();
      if (document.referrer !== "") {
        if (document.referrer.includes(document.location.pathname)) {
          const url = new URL(document.location.href);
          const page = url.searchParams.get("p");
          if (page && page !== "1") {
            document
              .querySelector(".topic_buttons")
              ?.scrollIntoView({ behavior: "smooth" });
          }
        }
      }
      handlePaging();

      try {
        await handleComments();
      } catch (e) {
        console.error("handleComments 出错，已跳过：", e);
      }

      handleReply();
      loadIcons();

      {
        const isFlamewarNode = $topicHeader
          .find('a[href^="/go"]')
          .attr("href")
          ?.endsWith("/flamewar");
        if (isFlamewarNode) {
          $("#node_sidebar").addClass("v2p-node-sidebar-flamewar");
        }
      }
    })();
  },
});

// src/contents/write/write.ts
function handleWrite() {
  bindImageUpload({
    $wrapper: $("#workspace"),
    insertText: (text) => {
      postTask(`editor.getDoc().replaceRange("${text}", editor.getCursor())`);
    },
    replaceText: (find, replace) => {
      if (replace) {
        const mode = $("input[name=syntax]:checked").val();
        if (mode === "markdown") {
          replace = `![](${replace})`;
        }
      }
      postTask(`
      editor.setValue(editor.getValue().replace("${find}", "${replace}"));
      const doc = editor.getDoc();
      const lastLine = doc.lastLine();
      const lastChar = doc.getLine(lastLine).length;
      doc.setCursor({ line: doc.lastLine(), ch: lastChar });
      `);
    },
  });
}
var init_write = __esm({
  "src/contents/write/write.ts"() {
    "use strict";
    init_image_upload();
    init_helpers();
  },
});

// src/contents/write/index.ts
var write_exports = {};
var init_write2 = __esm({
  "src/contents/write/index.ts"() {
    "use strict";
    init_helpers();
    init_write();
    handleWrite();
    loadIcons();
  },
});

// node_modules/.pnpm/webext-patterns@1.5.0/node_modules/webext-patterns/index.js
var patternValidationRegex =
  /^(https?|wss?|file|ftp|\*):\/\/(\*|\*\.[^*/]+|[^*/]+)\/.*$|^file:\/\/\/.*$|^resource:\/\/(\*|\*\.[^*/]+|[^*/]+)\/.*$|^about:/;
var isFirefox = globalThis.navigator?.userAgent.includes("Firefox/");
var allStarsRegex = isFirefox
  ? /^(https?|wss?):[/][/][^/]+([/].*)?$/
  : /^https?:[/][/][^/]+([/].*)?$/;
var allUrlsRegex = /^(https?|file|ftp):[/]+/;
function assertValidPattern(matchPattern) {
  if (!isValidPattern(matchPattern)) {
    throw new Error(
      matchPattern +
        " is an invalid pattern. See https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Match_patterns for more info.",
    );
  }
}
function isValidPattern(matchPattern) {
  return (
    matchPattern === "<all_urls>" || patternValidationRegex.test(matchPattern)
  );
}
function getRawPatternRegex(matchPattern) {
  assertValidPattern(matchPattern);
  let [, protocol, host = "", pathname] = matchPattern.split(
    /(^[^:]+:[/][/])([^/]+)?/,
  );
  protocol = protocol
    .replace("*", isFirefox ? "(https?|wss?)" : "https?")
    .replaceAll(/[/]/g, "[/]");
  if (host === "*") {
    host = "[^/]+";
  }
  host &&= host
    .replace(/^[*][.]/, "([^/]+.)*")
    .replaceAll(/[.]/g, "[.]")
    .replace(/[*]$/, "[^.]+");
  pathname = pathname
    .replaceAll(/[/]/g, "[/]")
    .replaceAll(/[.]/g, "[.]")
    .replaceAll(/[*]/g, ".*");
  return "^" + protocol + host + "(" + pathname + ")?$";
}
function patternToRegex(...matchPatterns) {
  if (matchPatterns.length === 0) {
    return /$./;
  }
  if (matchPatterns.includes("<all_urls>")) {
    return allUrlsRegex;
  }
  if (matchPatterns.includes("*://*/*")) {
    return allStarsRegex;
  }
  return new RegExp(matchPatterns.map((x) => getRawPatternRegex(x)).join("|"));
}

// 添加拼车节点导航

function addPincheTab() {
  // 选择所有导航栏容器
  const tabsContainers = document.querySelectorAll("#Tabs");

  tabsContainers.forEach((container) => {
    // 查找“Apple”标签
    const appleTab = container.querySelector('a[href="/?tab=apple"]');

    if (appleTab) {
      // 检查是否已经添加过“拼车”标签，避免重复
      const existingPincheTab = container.querySelector('a[href="/go/cosub"]');
      if (!existingPincheTab) {
        // 创建新的“拼车”标签
        const pincheTab = document.createElement("a");
        pincheTab.href = "/go/cosub";
        pincheTab.className = "tab v2p-hover-btn";
        pincheTab.textContent = "拼车";

        // 插入到“Apple”标签之后
        appleTab.insertAdjacentElement("afterend", pincheTab);
      }
    }
  });
}

// 监听DOM变化，确保在动态加载的页面中也能添加标签
const observer = new MutationObserver((mutations, obs) => {
  addPincheTab();
});

// 配置观察选项
observer.observe(document, {
  childList: true,
  subtree: true,
});

// 初始调用
addPincheTab();

// src/user-scripts/index.ts
function runAfterLoaded(fn) {
  if (document.readyState !== "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      fn();
    });
  }
}

var allowedHosts = [
  "https://v2ex.com",
  "https://www.v2ex.com",
  "https://cn.v2ex.com",
  "https://jp.v2ex.com",
  "https://de.v2ex.com",
  "https://us.v2ex.com",
  "https://hk.v2ex.com",
  "https://global.v2ex.com",
  "https://fast.v2ex.com",
  "https://s.v2ex.com",
  "https://origin.v2ex.com",
  "https://staging.v2ex.com",
];
var commonRegex = patternToRegex(...allowedHosts.map((host) => `${host}/*`));
var topicRegex = patternToRegex(...allowedHosts.map((host) => `${host}/t/*`));
var writeRegex = patternToRegex(
  ...allowedHosts.map((host) => `${host}/write/*`),
);
runAfterLoaded(() => {
  const url = window.location.href;
  void (async () => {
    if (commonRegex.test(url)) {
      await Promise.resolve().then(() => (init_common(), common_exports));
      await Promise.resolve().then(() => (init_home(), home_exports));
    }
    if (topicRegex.test(url)) {
      await Promise.resolve().then(() => (init_topic(), topic_exports));
    }
    if (writeRegex.test(url)) {
      await Promise.resolve().then(() => (init_write2(), write_exports));
    }
  })();
});

// v2p: replace legacy heart/reply icons with SVG controls
(function () {
  "use strict";

  // 统一图标尺寸 & 描边粗细
  const ICON_SIZE = 14; // 图标像素大小：18x18，你可以改成 16 / 20 等
  const STROKE_WIDTH = 2; // 描边粗细
  const ICON_OPACITY = 0.4; // 60% 不透明度

  function createSvgHeart() {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("xmlns", svgNS);
    svg.setAttribute("width", ICON_SIZE);
    svg.setAttribute("height", ICON_SIZE);
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", STROKE_WIDTH);
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("data-lucide", "heart");
    svg.setAttribute("class", "lucide lucide-heart");
    svg.style.opacity = String(ICON_OPACITY);

    const path = document.createElementNS(svgNS, "path");
    path.setAttribute(
      "d",
      "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
    );
    svg.appendChild(path);

    return svg;
  }

  function createSvgReply() {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("xmlns", svgNS);
    svg.setAttribute("width", ICON_SIZE);
    svg.setAttribute("height", ICON_SIZE);
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", STROKE_WIDTH);
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("data-lucide", "message-square");
    svg.setAttribute("class", "lucide lucide-message-square");
    svg.style.opacity = String(ICON_OPACITY);

    const path = document.createElementNS(svgNS, "path");
    path.setAttribute(
      "d",
      "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
    );
    svg.appendChild(path);

    return svg;
  }

  function replaceIcons(root) {
    const doc = root || document;

    // 1. 替换感谢小红心 heart_neue.png
    doc.querySelectorAll('img[src*="heart_neue.png"]').forEach((img) => {
      const a = img.closest("a");
      if (!a) return;

      if (a.dataset.v2pSvgReplaced === "heart") return;
      a.dataset.v2pSvgReplaced = "heart";

      const svg = createSvgHeart();
      // 如果需要，可以保持原来的 vertical-align
      svg.style.verticalAlign = img.style.verticalAlign || "middle";

      img.replaceWith(svg);
    });

    // 2. 替换回复图标 reply_neue.png
    doc.querySelectorAll('img[src*="reply_neue.png"]').forEach((img) => {
      const a = img.closest("a");
      if (!a) return;

      if (a.dataset.v2pSvgReplaced === "reply") return;
      a.dataset.v2pSvgReplaced = "reply";

      const svg = createSvgReply();
      svg.style.verticalAlign = img.style.verticalAlign || "middle";

      img.replaceWith(svg);
    });
  }

  // 初次执行
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => replaceIcons());
  } else {
    replaceIcons();
  }

  // 监听后续插入
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      m.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          replaceIcons(node);
        }
      });
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
})();
