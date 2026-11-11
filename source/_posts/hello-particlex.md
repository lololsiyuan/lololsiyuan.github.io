---
title: 你好，ParticleX
date: 2026-11-11 20:00:00
tags:
  - Hexo
  - 博客
categories:
  - 折腾
---

博客换了一身新衣服。

之前用的是 VuePress + vuepress-theme-reco，这次换成了 **Hexo + ParticleX**：构建更快、首页卡片更清爽，归档 / 分类 / 标签都自带。

<!-- more -->

## 为什么换

旧站是 2022 年搭的，久不维护，依赖太老，改点样式要跟一堆 webpack 配置较劲。

新方案简单直接：

- 内容还是 Markdown，一行 `hexo new` 就能写
- 主题轻量，Vue 3 渲染，支持暗色模式
- 部署依旧是 GitHub Pages 的 `gh-pages` 分支

## 常用命令

```bash
hexo new "文章标题"   # 新建文章
hexo server           # 本地预览 http://localhost:4000
hexo generate         # 生成静态文件
hexo deploy           # 发布到 gh-pages
```

## 之后

把以前写的东西慢慢搬过来，再补一些前端和 AI 相关的笔记。

就这样，开张。
