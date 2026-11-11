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
| `scripts/trending.js` | 构建时生成「GitHub 热点」页（/github-trending/） |

## GitHub 热点页

菜单里的「GitHub热点」由 `scripts/trending.js` 在构建时自动生成：读取本地
`deepseek-trending` 仓库（`_config.yml` 的 `trending.repo_path`，默认
`H:/deepseekbot/deepseek-trending`）里最新的日榜 / 周榜 / 月榜 Markdown，
每个榜单先展示「全部语言」，其余语言折叠。

更新流程：等 deepseek-trending 跑完一轮 → 重新构建部署即可，本页会自动变成最新榜单。

```bash
npx hexo clean && npx hexo generate && npx hexo deploy
```
