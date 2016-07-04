### **Temporary release. Please wait a formal version**.

处理 border-width 属性，使其在支持小数像素值的高清屏下显示真实的1px。

```
npm i postcss-border-width --save-dev
```

Prepend this plugin to your postcss.

`parentSelectors` 跟dpr相关的父层限定类数组，分别对应 `dpr` x2、x3，默认 `['.iosx2', '.iosx3']`;
`maxPixelValue` 需要进行转换的最大 `border-width`，默认 `2`;