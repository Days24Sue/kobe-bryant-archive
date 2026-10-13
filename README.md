# 科比 · 一手资料档案

公开的 GitHub Pages 静态网站，使用本仓库 `database/` 中的 Kobe Bryant Primary Source Archive V0.1 CSV 快照。网页从 `main` 分支根目录发布。

## 更新馆藏

在仓库根目录运行：

```sh
python3 build_data.py
```

脚本会生成网页使用的 `archive-data.js`。更新 CSV 后，请重新生成并提交该文件。首页的精选时间节点与概览数字需要人工同步核对。

## 本地预览

```sh
python3 -m http.server 4173
```

打开 `http://127.0.0.1:4173/`。页面运行时不请求外部字体或数据服务；点击资料卡片会前往原始来源。Inter 字体许可见 `fonts/OFL.txt`。
