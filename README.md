# lololsiyuan.github.io

个人博客源码，基于 [Hexo](https://hexo.io) + [ParticleX](https://github.com/theme-particlex/hexo-theme-particlex) 主题。

- 线上地址：<https://lololsiyuan.github.io>
- `master` 分支：源码（本仓库当前分支）
- `gh-pages` 分支：构建产物，由 `hexo deploy` 自动推送

## 本地开发

```bash
npm install
npx hexo server        # http://localhost:4000
```

## 写文章

```bash
npx hexo new "文章标题"     # source/_posts/文章标题.md
npx hexo new page "关于"    # source/关于/index.md
```

文章头部 front-matter 示例：

```yaml
---
title: 文章标题
date: 2026-11-11 20:00:00
categories: 随想
tags: [Hexo, 博客]
---
```

## 发布

```bash
npx hexo clean && npx hexo generate
npx hexo deploy          # 推送到 gh-pages
```

## 结构

| 路径 | 说明 |
| --- | --- |
| `source/_posts/` | 文章 |
| `source/about/` | 关于页 |
| `source/tags/` `source/categories/` | 标签 / 分类索引页（靠 front-matter `type` 选布局） |
| `source/images/` | 头像、背景等图片 |
| `source/css/custom.css` | 站点自定义样式 |
| `themes/particlex/` | 主题（已随仓库提交，可直接改） |
| `_config.yml` | 站点配置（含 deploy） |
| `_config.particlex.yml` | 主题配置 |
