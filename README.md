# sharedSchedueMiniApps · 雁擎调度平台

> 一款面向物流公司的运力需求发布与车辆调度微信小程序（uni-app 实现），把"发需求、抢运力、管团队"装进手机里。

`sharedSchedueMiniApps`（应用名 `sharedSchedueApp`，品牌"雁擎调度平台"）是一套基于 uni-app（Vue 3）的移动端解决方案，定位为 **物流公司侧的"需求发布 + 调度协同 + 团队管理"掌上工具**。货主/物流公司在平台发布用车需求（车型、车长、路线、截止时间），调度/承运方响应并完成选派调度；同时提供物流公司认证、员工与角色权限管理，实现租户化的调度协同。

---

## 一、产品定位

- **面向客户**：物流公司、货主企业、承运调度团队。
- **面向用户角色**：物流公司管理员、调度员、运营人员。
- **核心价值**：
  - 需求发布数字化：新建用车需求，支持报价车型、车长、车次、载重、体积、作业要求与多段路线（起点/中途点/终点）地图选点。
  - 调度协同移动化：需求按状态筛选、报价倒计时提醒、选派调度与调度明细确认，随时随地完成。
  - 租户化管理：物流公司认证（营业执照）、员工管理、角色权限配置与成员授权，一个 App 管好团队。
  - 消息触达：接入 UniPush 2.0 推送，需求动态及时提醒。

---

## 二、核心能力一览

| 能力 | 简介 |
| --- | --- |
| 账号体系 | 手机号+密码（RSA 加密）/ 短信验证码登录，微信 code 静默绑定 |
| 物流公司认证 | 填写公司信息 + 上传营业执照，认证通过后进入业务首页 |
| 需求管理 | 新建需求（车型/车长/载重/体积/多段路线）、需求详情、按状态筛选 |
| 地图选点 | 基于 `atl-map` 插件的地图定位选点，规划起点 / 中途点 / 终点 |
| 调度选派 | 选派调度（`selDispatch`）、确认调度明细（`confirmDispatchDtl`） |
| 团队管理 | 员工（调度员）管理、角色管理、角色配置（权限树）、成员管理 |
| 权限控制 | 首页按 `entityIds` 权限（需求管理 20001 / 消息 20002 / 我的 20003）展示对应区块 |
| 安全保障 | RSA 密码加密、SHA1 网关签名、登录态 403 强制回落未登录首页 |

---

## 三、业务模块全景

项目为 **uni-app 单包结构**（`pages.json`，无分包、无 tabBar，首页底部导航为页面内自绘），启动页 `pages/preserve/preserve` 做登录态守卫。

### 1. 账号与认证

| 页面 | 作用 |
| --- | --- |
| `pages/preserve` | 启动守卫页：校验登录态与认证状态后分流 |
| `pages/homeNoLogin` | 未登录首页（"雁擎调度平台"） |
| `pages/login` | 登录（手机号+密码 / 短信验证码，微信 code 静默绑定，UniPush 绑定） |
| `pages/forgetPsw` / `pages/resetPsw` | 重置密码 |
| `pages/index` | 模板残留页（未使用） |
| `pages/noEntity` | 无权限提示页 |

### 2. 需求与调度

| 页面 | 作用 |
| --- | --- |
| `pages/home` | 已登录主页面：按权限展示需求管理 / 消息 / 我的区块；需求列表按 `ORDER_STATE` 状态 tab 过滤，支持报价车型（`VEHICLE_TYPE_QUOTE`）、车长（`VEHICLE_LENGTH`）筛选与截止倒计时 |
| `pages/demand/addDemand` | 新建需求：报价车型、车长、车次、载重（吨）、体积（m³）、作业要求、多段路线 + 地图选点、截止时间、可见范围 |
| `pages/demand/demandDetail` | 需求详情：查看需求明细，执行选派调度（`selDispatch`）与确认调度明细（`confirmDispatchDtl`） |

### 3. 我的（团队管理）

| 页面 | 作用 |
| --- | --- |
| `pages/mine/authentication` | 物流公司认证（`tenantTF.regTenant`：公司名称 + 营业执照上传） |
| `pages/mine/dispatcherManage` / `addDispatcher` | 员工（调度员）管理 / 员工详情 |
| `pages/mine/roleManage` / `addRole` / `roleMember` | 角色管理 / 角色配置（`entityTF` 权限树 + `roleTF`）/ 成员管理（`userRoleRelTF`） |

> 说明：`pages/guideIndex`（业务介绍页）与 `pages/nav`（底部导航雏形）未在 `pages.json` 注册，为预留页面。

---

## 四、接口与服务约定

小程序所有后端能力均通过统一网关访问，调用入口位于 `utils/util.js`。**前端不直接耦合具体接口 URL**，而是通过 *Bean 名称 + 方法名* 间接调用，便于后端服务演进与灰度。

### 4.1 网关与运行环境

| 环境 | 触发条件 | 网关地址 |
| --- | --- | --- |
| 开发版 | 微信开发者工具 → 编译模式 = 开发 | `http://183.6.76.4:5810/intf?` |
| 体验版 | 微信后台标记为体验版 | `http://183.6.76.4:5810/intf?` |
| 正式版 | 线上 release | `https://fqdd.1000e56.com/intf?` |
| 兜底默认 | 未识别环境 | `https://wxapp.1000e56.com/intf?` |

> 网关识别通过 `__wxConfig.envVersion` 自动切换，无需业务代码手动改地址。

### 4.2 主要调用方式

`util.postByBeanName(beanName, methodName, param, successFun, errorFun, postType)`

- `beanName`：后端服务 Bean 名（字符串）。
- `methodName`：该 Bean 暴露的方法名。
- `param`：请求参数对象，`{}` 表示无参。
- `successFun / errorFun`：可选回调。

辅助调用：

- `util.postByCode(inCode, param, successFun, errorFun, postType)`：通过接口编码（`inCode`）调用。
- `util.uploadFile(file)`：文件上传（`fileCommonTF.doUpload`）。
- `util.uploadExcel(file)`：考勤 Excel 导入（`attendanceServiceImpl.uploadAttendanceData`）。

### 4.3 安全与签名

- **应用标识**：`WXAPP`；微信小程序 AppID 常量 `wx4b83389618d66302`。
- **签名机制**：将 `[intfKey, tokenId, time, rd, JSON.stringify(content)]` 排序后拼成数组字符串，经 `sha.js` 计算 SHA1 得到 `sign`。
- **加密**：登录密码经 `jsencrypt.min.js`（jsencrypt 3.x）RSA 公钥加密；GET 链接使用 `md5.js` 签名（`signUrl`）。
- **密钥管理**：内置 `intfKey`（见 `utils/util.js`），用于构造签名，**请勿在公网仓库泄露**，建议接入后端下发的动态密钥机制。
- **登录态**：`tokenId` 由响应自动写入 storage；**响应 status 403 时清空登录态并 `reLaunch` 回 `/pages/homeNoLogin/homeNoLogin`**，501 及其他错误自动弹窗。
- **权限数据**：`userInfo.entityIds` 存于 storage，由 `common.getEntityIds` 解析为权限 ID 集合。

### 4.4 主要后端 Bean

| Bean | 用途 |
| --- | --- |
| `wxUserTF` | 登录 / 短信验证码 / 登出 |
| `requirementsTF` | 需求分页 / 详情 / 保存 / 删除 / 调度 |
| `tenantTF` | 物流公司（租户）注册与信息 |
| `userTF` | 员工（调度员）管理 |
| `roleTF` / `entityTF` / `userRoleRelTF` | 角色与权限管理 |
| `commonTF` | 字典（车型、车长等）、省市区数据 |
| `fileCommonTF` | 文件上传 |

### 4.5 接口约定建议（新增业务时）

1. **优先使用 Bean + MethodName 形式**，避免直接拼接 `inCode` 路径。
2. **统一在 `param` 中传递业务主键**（如 `entityIds` 中的权限 ID），由后端在网关层注入。
3. **页面层只关心业务结果**，loading、错误提示由 `util` 统一处理。
4. **新增页面需同步注册 `pages.json`**，并注意页面标题、`globalStyle` 的一致性。

---

## 五、项目结构

```
sharedSchedueMiniApps/
├─ main.js                        # uni-app 入口（Vue 3 createSSRApp）
├─ App.vue                        # 全局生命周期（含小程序热更新 getUpdateManager）
├─ index.html                     # H5 端入口（uni-app Vue3 模板）
├─ pages.json                     # 页面路由与全局样式（16 个注册页面）
├─ manifest.json                  # 应用配置（DCloud appid / mp-weixin appid / Push）
├─ uni.scss                       # uni-app 全局样式变量
├─ pages/                         # 页面（账号认证 / 需求调度 / 我的）
├─ common/                        # 公共资源
│  ├─ commonImport.js             # 统一导出 util / common / uniApi
│  ├─ uniApi/uniApi.js            # uni API promisify 二次封装
│  ├─ css/                        # 全局样式（base、comList、detail、resetVant 等）
│  └─ wxs/format.wxs              # 格式化脚本片段
├─ components/                    # 自定义组件
│  ├─ ba-tree-picker/             # 树形选择器（权限树选择）
│  └─ zqs-select/                 # 多选下拉选择器
├─ utils/                         # 工具方法
│  ├─ util.js                     # 接口网关封装（postByBeanName / postByCode / 上传 / 加密）
│  ├─ common.js                   # 通用工具（判空、深拷贝、Decimal 精确运算、
│  │                              #   经纬度转换、两点距离、日期格式化、权限 ID 解析）
│  ├─ decimal.js                  # 精确数值运算
│  ├─ md5.js / sha.js / jsencrypt.min.js / base64.js   # 加密
│  ├─ dateTimePicker.js / promisify.js / trans.js / runtime.js
├─ uni_modules/                   # uni 插件（uni-ui 全家桶 47 个组件 + atl-map + v-tabs）
├─ static/                        # 静态资源（logo、图标字体、业务图标）
├─ webview/                       # 预留目录（当前为空）
├─ project.config.json            # 微信开发者工具项目配置
└─ package-lock.json              # 依赖锁定（decimal.js、jsencrypt）
```

> 注意：根目录 `package.json` 目前是 `ba-tree-picker` 组件的描述文件被误拷到根目录所致，并非本项目工程描述；本项目为 **HBuilderX IDE 工程**，通过 HBuilderX 图形化编译运行，依赖以 `package-lock.json` 与 `uni_modules/` 为准。

---

## 六、技术栈

| 类别 | 选型 |
| --- | --- |
| 跨端框架 | uni-app（Vue 3，HBuilderX 工程） |
| 运行平台 | 微信小程序（mp-weixin，AppID `wx4b83389618d66302`）；App 端启用 UniPush 2.0 |
| UI 组件库 | uni-ui（uni_modules，47 个组件）+ `v-tabs` |
| 地图 | `atl-map`（微信小程序地图定位选点，封装腾讯/高德/百度 SDK） |
| 数值运算 | `decimal.js`（精确加减乘除） |
| 加密 | `sha.js`（SHA1 签名）/ `md5.js` / `jsencrypt`（RSA） |
| 组件自动引入 | easycom（autoscan） |
| 接口调用 | 自研 `util.postByBeanName` / `util.postByCode` 网关封装 |
| 工具链 | HBuilderX |

---

## 七、版本与更新说明

- **当前版本**：`1.0.0`（`manifest.json`，versionCode 100）。
- **AppID**：微信小程序 `wx4b83389618d66302`；DCloud `__UNI__95FD901`。
- **版本管理**：
  - 小程序端在 `App.vue` 的 `onLaunch` 中使用条件编译 + 微信 `getUpdateManager` 检测新版本并提示用户重启。
  - 登录页通过 `uni.getPushClientId` / `uni.onPushMessage` 接入 UniPush 2.0 推送。
- **权限声明**：`requiredPrivateInfos: ["getLocation"]` + `scope.userLocation`（地图定位选点）。
- **兼容性**：建议在 **微信 8.0+** 客户端运行以获得完整能力。

---

## 八、常见问题（FAQ）

**Q1：登录后为什么进不了首页？**
A：登录成功后按 `authState` 判定认证状态：未认证的物流公司会引导至"物流公司认证"页（填写公司名 + 上传营业执照），认证通过后才进入业务首页。

**Q2：首页看不到某些功能区块？**
A：首页按 `userInfo.entityIds` 权限展示区块（需求管理 20001 / 消息 20002 / 我的 20003）。缺少权限时对应区块不展示；完全无权限会进入 `pages/noEntity` 提示页。

**Q3：如何给员工分配权限？**
A：在"我的"→ 角色管理中新建角色并勾选权限树（`ba-tree-picker` 组件选择），再通过成员管理将员工绑定角色（`userRoleRelTF`）。

**Q4：新建需求时如何规划路线？？**
A：新建需求页支持起点 / 中途点 / 终点多段路线，每段均可通过 `atl-map` 地图选点拾取坐标，并设置载重、体积、截止时间与需求可见范围。

**Q5：如何处理登录态过期？**
A：`tokenId` 存储在本地 storage；后端返回 `status: 403` 时，`util` 会清空登录态并 `reLaunch` 回未登录首页，无需页面手动处理。

**Q6：根目录的 package.json 是做什么的？**
A：它是 `ba-tree-picker` 组件插件描述文件，疑似误拷贝所致，并非本项目工程配置。本项目为 HBuilderX 工程，请勿在此文件中添加项目依赖。

**Q7：webview 目录是干什么的？**
A：`webview/` 为预留目录（当前为空），原计划承载 H5 嵌入页，暂未启用。

---

## 九、贡献与迭代指南

1. **业务扩展**：新页面放入 `pages/` 对应业务目录（如 `pages/demand/`、`pages/mine/`），并同步注册 `pages.json`。
2. **公共能力**：可复用 UI 优先用 uni-ui（`uni_modules/`）或放入 `components/`；uni API 二次封装放 `common/uniApi/`；通用工具放 `utils/`。
3. **接口扩展**：与后端约定新的 `beanName` / `methodName`，复用 `util.postByBeanName` 入口；新的加解密策略先在 `utils/util.js` 抽象再使用。
4. **数值计算**：涉及金额、载重、体积等精度敏感计算时，统一使用 `common.js` 中基于 `decimal.js` 的封装，避免浮点误差。
5. **代码风格**：Vue 3 组合式/选项式按现有页面保持一致；统一从 `common/commonImport.js` 引入公共模块。
6. **测试与体验**：核心流程覆盖：登录 → 物流公司认证 → 新建需求 → 调度选派 → 员工/角色管理 → 退出。
7. **发布前自检**：
   - `manifest.json` 中 mp-weixin 的 appid 与发布小程序一致；
   - 地图定位等隐私接口已在 `requiredPrivateInfos` / `permission` 中声明；
   - `unpackage/` 已被 `.gitignore` 忽略，发布产物勿入库；
   - 清理未注册的预留页面引用，避免死链。

---

## 十、版权与联系

- **项目名称**：sharedSchedueMiniApps（雁擎调度平台）
- **归属**：仅用于内部协作与对外介绍，请勿在未授权情况下用于商业分发。
- **问题反馈**：通过公司内部协作平台（项目群 / 需求管理工具）提交。
- **维护团队**：本 README 由项目组共同维护，更新时请同步至 `CHANGELOG.md`。

---

> 文档版本：v1.0 · 最近更新：2026-10-08
