# DanmakuSender

哔站弹幕发送者uid反查

## 使用

```js
const ds = new DanmakuSender()

const hash = "b615148d" // "b615148d" -> 208259

const parsed = ds.parse(hash)

console.log(parsed) // 208259
```

## 说明

支持范围 `999 < mid < 1000000000`，高位会有碰撞

## 感谢

https://github.com/leiurayer/downkyi/blob/main/src/Core/api/utils/DanmakuSender.cs
