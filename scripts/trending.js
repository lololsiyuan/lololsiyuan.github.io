'use strict';

/**
 * 生成「GitHub 热点」页面（/github-trending/）。
 *
 * 数据来自本地 deepseek-trending 仓库里最新的日/周/月榜单，
 * 每次 hexo generate / hexo deploy 时自动读取并渲染：
 * 每个榜单先展示「全部语言」总表，其余语言折叠在 details 里。
 */

const fs = require('fs');
const path = require('path');

const SECTIONS = [
  { dir: 'daily', label: '日榜' },
  { dir: 'weekly', label: '周榜' },
  { dir: 'monthly', label: '月榜' },
];

const LANG_LABELS = {
  all: '全部语言',
  typescript: 'TypeScript',
  javascript: 'JavaScript',
  python: 'Python',
  go: 'Go',
  rust: 'Rust',
  java: 'Java',
  php: 'PHP',
  ruby: 'Ruby',
  'c++': 'C++',
  c: 'C',
  'c#': 'C#',
  shell: 'Shell',
  swift: 'Swift',
  kotlin: 'Kotlin',
  dart: 'Dart',
  html: 'HTML',
  css: 'CSS',
  vue: 'Vue',
  jupyter: 'Jupyter Notebook',
};

function collectMarkdown(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) collectMarkdown(full, files);
    else if (entry.name.toLowerCase().endsWith('.md')) files.push(full);
  }
  return files;
}

function pickLatest(files) {
  return files.sort((a, b) => path.basename(b).localeCompare(path.basename(a)))[0];
}

function parse(raw) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!match) return { meta: {}, body: raw };
  const meta = {};
  for (const line of match[1].split(/\r?\n/)) {
    const at = line.indexOf(':');
    if (at > 0) meta[line.slice(0, at).trim()] = line.slice(at + 1).trim();
  }
  return { meta, body: raw.slice(match[0].length) };
}

const GAIN_LABELS = { daily: '今日新增', weekly: '本周新增', monthly: '本月新增' };

function splitSections(body) {
  const parts = [];
  const re = /^## +(.+?) *$/gm;
  let match;
  const marks = [];
  while ((match = re.exec(body)) !== null) marks.push({ title: match[1].trim(), start: match.index, end: re.lastIndex });
  for (let i = 0; i < marks.length; i++) {
    const stop = i + 1 < marks.length ? marks[i + 1].start : body.length;
    parts.push({ title: marks[i].title, body: body.slice(marks[i].end, stop).trim() });
  }
  return parts;
}

function countRows(markdown) {
  return markdown.split(/\r?\n/).filter((line) => line.trim().startsWith('|')).length > 2
    ? markdown.split(/\r?\n/).filter((line) => line.trim().startsWith('|')).length - 2
    : 0;
}

function escapeHtml(value) {
  return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function renderMarkdown(markdown) {
  return hexo.render.renderSync({ text: markdown, engine: 'markdown' });
}

// 榜单表格里第三列统一写成「今日新增」，周榜/月榜按周期换个说法更好懂
function relabelGain(markdown, label) {
  return markdown.split(/\r?\n/).map((line) =>
    line.startsWith('|') ? line.replace(/\|\s*今日新增\s*\|/, '| ' + label + ' |') : line
  ).join('\n');
}

function formatTime(iso) {
  if (!iso) return '';
  return iso.replace('T', ' ').replace(/\.\d+/, '').replace(/Z$/, '');
}

hexo.extend.generator.register('github_trending', function () {
  const conf = hexo.config.trending || {};
  if (conf.enable === false) return;

  const repo = conf.repo_path || 'H:/deepseekbot/deepseek-trending';
  const root = path.join(repo, 'trending');

  const html = [];
  let latestDate = null;

  for (const section of SECTIONS) {
    const file = pickLatest(collectMarkdown(path.join(root, section.dir)));
    if (!file) continue;
    const { meta, body } = parse(fs.readFileSync(file, 'utf8'));
    const name = path.basename(file, '.md');
    if (meta.date && (!latestDate || meta.date > latestDate)) latestDate = meta.date;

    const langs = splitSections(body);
    if (langs.length === 0) continue;

    const count = meta.count && meta.count !== '0' ? meta.count : '';
    const metaText = [
      count ? count + ' 个项目' : '',
      formatTime(meta.generatedAt) ? '生成于 ' + formatTime(meta.generatedAt) : '',
      meta.degraded === 'true' ? '本次抓取有降级' : '',
    ].filter(Boolean).join(' · ');

    const block = ['<section class="trending-period">', '<h2>' + escapeHtml(section.label) + ' · ' + escapeHtml(name) + '</h2>'];
    if (metaText) block.push('<p class="trending-meta">' + escapeHtml(metaText) + '</p>');

    const main = langs.find((item) => item.title.toLowerCase() === 'all') || langs[0];
    const rest = langs.filter((item) => item !== main);

    block.push('<h3>' + escapeHtml(LANG_LABELS[main.title.toLowerCase()] || main.title) + '</h3>');
    const gainLabel = GAIN_LABELS[section.dir] || '今日新增';
    block.push('<div class="trending-scroll">' + renderMarkdown(relabelGain(main.body, gainLabel)) + '</div>');

    if (rest.length) {
      block.push('<div class="trending-langs">');
      for (const lang of rest) {
        const label = LANG_LABELS[lang.title.toLowerCase()] || lang.title;
        const rows = countRows(lang.body);
        block.push(
          '<details><summary>' + escapeHtml(label) + (rows ? ' · ' + rows + ' 个' : '') + '</summary>' +
          '<div class="trending-scroll">' + renderMarkdown(relabelGain(lang.body, gainLabel)) + '</div></details>'
        );
      }
      block.push('</div>');
    }

    block.push('</section>');
    html.push(block.join('\n'));
  }

  if (html.length === 0) {
    hexo.log.warn('[trending] 没有找到榜单数据，仓库路径：' + repo);
    html.push('<p>还没有在本地找到趋势榜单数据。</p>');
  }

  const intro = [
    '<div class="trending-intro"><p>本页在博客构建时自动读取本地 <code>deepseek-trending</code> 的榜单生成，更新博客即刷新榜单。</p>',
    latestDate ? '<p>最近更新：' + escapeHtml(latestDate) + '</p>' : '',
    '</div>',
  ].join('');

  return [
    {
      path: 'github-trending/index.html',
      layout: 'layout',
      data: {
        title: 'GitHub 热点',
        date: latestDate ? new Date(latestDate + 'T08:00:00+08:00') : new Date(),
        content: intro + html.join('\n'),
        comments: false,
      },
    },
  ];
});
