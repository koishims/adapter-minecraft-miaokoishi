# koishi-plugin-adapter-minecraft-miaokoishi

[![npm](https://img.shields.io/npm/v/koishi-plugin-adapter-minecraft-miaokoishi?style=flat-square)](https://www.npmjs.com/package/koishi-plugin-adapter-minecraft-miaokoishi)

一个 Minecraft 适配器 通过 MiaoScript 的 MiaoKoishi 链接

### Minecraft 服务器 插件安装教程
- 关闭服务器
- 下载 MiaoScript 插件 https://github.com/circlecloud/MiaoScript/releases
- 丢到 plugins 目录
- 新建目录 plugins/MiaoScript
- 在 `plugins/MiaoScript` 目录下 新建文件 channel 并且写入 beta
  - Linux 可以直接  `echo beta > channel`
- 启动服务器 等待下载依赖
- 启动完成后执行 `/mspm install MiaoKoishi`
- 安装后 配置插件
```yml
# Koishi 显示名称
name: '我的世界服务器'
# 机器人ID 需要匹配 Koishi 那边的值
selfId: minecraft
# 机器人显示头像
avator: https://www.minecraft.net/etc.clientlibs/minecraft/clientlibs/main/resources/apple-icon-76x76.png
# 频道ID 可以自定义 默认 UUID 生成
guildId: 4c858b72-xxxx-xxxx-xxxx-ae62c6fdd0a5
# 认证 Token 需要和 Koishi 配置一致
token: 4c858b72-xxxx-xxxx-xxxx-ae62c6fdd0a5
# 链接协议 支持 `ws` 和 `ws-reverse`
protocol: ws
# 此处三个配置 当 protocol 为 ws 时有效
# 链接地址 path 需要匹配 Koishi 插件配置
address: wss://demo.koishi.chat/miaokoishi
# 是否断线重连
auto_reconnect: true
# 重连间隔
reconnect_interval: 3000
# 此处配置 当 protocol 为 ws-reverse 时有效
# 监听地址
path: /koishi
```
- 执行 `mspm reload MiaoKoishi` 重载插件配置

### Koishi 插件配置教程

> 略
