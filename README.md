# 裴继豪 Jack · AIGC 个人作品集

绿色雾感浮岛与滚动叙事作品集，包含站内视频、制作资产、分镜及品牌设计栏目。

## 本地预览

运行 `node preview.cjs`，访问 `http://127.0.0.1:8080/`。

本地预览支持视频分段读取和代码更新检测。更新检测由预览服务注入，不会进入发布站点。

## 网站内容

- `dist/`：完整静态网站，所有媒体均使用相对路径。
- `dist/assets/videos/`：26 个网页播放副本；原始素材不在仓库内。
- `dist/assets/design/`：品牌设计页面、独立项目 PDF 和完整设计合集。
- `scripts/validate-site.cjs`：检查视频、设计及资产路径。

运行 `node scripts/validate-site.cjs` 验证发布文件。

## 发布

`.github/workflows/pages.yml` 将 `main` 分支中的 `dist/` 发布至 GitHub Pages。
目标仓库需在 Settings → Pages 中选择 GitHub Actions 作为发布来源。
发布配置只上传 `dist/`；本机原始素材和内部整理文件不属于站点发布内容。

独立设计 PDF 保留原合集的页内编号，网站按品牌及主题重新组织浏览。
