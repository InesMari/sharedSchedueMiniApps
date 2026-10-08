import {
	util,
	uniApi,
	common
} from '/common/commonImport';
import {
	onLoad,
	onHide,
	onShow
} from '@dcloudio/uni-app'
import {
	reactive,
	toRefs,
	ref,
	computed
} from "vue";
export default {
	setup() {
		// 绑定数据
		let bindData = reactive({
			// 公用
			navActive: -1,
			entitys:common.getEntityIds(),
			// 管理
			searchStr: "",
			beginIndexSearchStr: "",
			endIndexSearchStr: "",
			quoteVehicleType: "",
			vehicleLength: "",
			orderState: -1,
			quoteVehicleTypeList: [],
			vehicleLengthList: [],
			demandList: [],
			currentTabs: 0,
			tabs: [],
			isRefresh: false,
			// 消息
			messageList: [],
			todoSum: 0,
			// 我的
			formInfo: {
				info:{},
			},
		})
		let staticData = {
			userInfo: uni.getStorageSync('userInfo'),
			intervalIds: [],
		}
		let popup = ref();
		let drawer = ref();
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(async() => {
			//#ifdef MP-WEIXIN
			uni.hideHomeButton();
			//#endif
			await initEntitys();
			initData();
			initLocation();
			queryMine();
		})
		onShow(() => {
			// 重新触发定时器
			if (bindData.demandList.length > 0) {
				bindData.demandList.forEach(item => {
					countdown(item.expireDate, item);
				})
			}
			doQuery(true);
			queryTodoSum();
			queryMsg();
		})
		onHide(() => {
			// 销毁定时器
			// 遍历存储定时器 ID 的数组
			for (let i = 0; i < staticData.intervalIds.length; i++) {
				// 清除每个定时器
				clearInterval(staticData.intervalIds[i]);
			}
			// 清空数组
			staticData.intervalIds = [];
		})

		async function initData() {
			let {
				VEHICLE_TYPE_QUOTE,
				VEHICLE_LENGTH,
				ORDER_STATE
			} = await util.postByBeanName('commonTF', 'getSysStaticDataByCodeTypes', {
				codeType: "VEHICLE_TYPE_QUOTE,VEHICLE_LENGTH,ORDER_STATE"
			});
			bindData.quoteVehicleTypeList = VEHICLE_TYPE_QUOTE;
			bindData.quoteVehicleTypeList.forEach(item => {
				item.value = item.codeValue;
				item.text = item.codeName;
			})
			bindData.vehicleLengthList = VEHICLE_LENGTH;
			bindData.vehicleLengthList.forEach(item => {
				item.value = item.codeValue;
				item.text = item.codeName;
			})
			bindData.tabs = [{
				codeValue: -1,
				codeName: "全部"
			}, ...ORDER_STATE];
			bindData.tabs.forEach(item => {
				item.id = item.codeValue;
				item.name = item.codeName;
			})
		}
		// 权限展示初始化（主要处理无权限时候)
		function initEntitys(){
			// 页面展示优先级:需求管理 - 我的 - 消息 - 无权限页
			if(bindData.entitys['20001']){		//需求管理
				bindData.navActive = 1;
			}else if(bindData.entitys['20003']){	//我的
				bindData.navActive = 4;
			}else if(bindData.entitys['20002']){	//消息
				bindData.navActive = 2;
			}else{	//无权限
				uni.redirectTo({
					url: "/pages/noEntity/noEntity"
				})
			}
		}
		
		async function queryTodoSum() {
			let {
				count
			} = await util.postByBeanName('requirementsTF', 'queryTenantTodosSum');
			bindData.todoSum = count;
		}

		async function queryMine() {
			bindData.formInfo = await util.postByBeanName('tenantTF', 'loadTenantInfoForWechat');
			bindData.formInfo.businessLicenseImgUrls = {
				url: bindData.formInfo.info.businessLicenseImgUrl
			};
			uni.setStorageSync("adminRoleId",bindData.formInfo.adminRoleId)
			console.log(bindData.formInfo)
		}

		// 获取定位
		function initLocation() {
			uni.getLocation({
				type: 'wgs84',
				success: function(res) {
					staticData.lng = res.longitude;
					staticData.lat = res.latitude;
					doQuery(true);
				},
				fail(e) {
					console.log(e)
					doQuery(true);
				}
			});
		}
		// 查询列表
		async function doQuery(clear) {
			if (clear) { //clear为true的时候清空页码
				staticData.page = 1
			}
			let {
				searchStr,
				orderState,
				beginIndexSearchStr,
				endIndexSearchStr,
				quoteVehicleType,
				vehicleLength
			} = bindData;
			let {
				items,
				hasNext
			} = await util.postByBeanName('requirementsTF', 'queryRequirementsPageForWLGS', {
				searchStr,
				orderState,
				beginIndexSearchStr,
				endIndexSearchStr,
				quoteVehicleType,
				vehicleLength,
				lng: staticData.lng,
				lat: staticData.lat
			});
			if (clear) { //clean为true的时候清空数组(请求后操作，避免出现阶段性页面空白)
				bindData.demandList = [];
			}
			staticData.hasNext = hasNext;
			bindData.isRefresh = false;
			bindData.demandList = [...bindData.demandList, ...items];
			bindData.demandList.forEach(item => {
				countdown(item.expireDate, item);
			})
		}

		// 滚动加载
		function scrolltolowerHandler() {
			if (staticData.hasNext) {
				staticData.page++;
				doQuery()
			}
		}
		// 上拉刷新
		function toupper() {
			bindData.isRefresh = true;
			doQuery(true);
		}

		// 切换tabs			
		function changeTab(index) {
			bindData.orderState = bindData.tabs[index].id;
			doQuery(true);
		}
		// 倒计时
		function countdown(targetDateStr, item) {
			// 获取目标日期的时间戳
			const targetDate = new Date(targetDateStr).getTime();

			// 更新倒计时的函数
			function updateCountdown() {
				// 获取当前时间的时间戳
				const now = new Date().getTime();

				// 计算剩余时间（毫秒）
				const distance = targetDate - now;

				if (distance > 0) {
					// 计算天、小时、分钟和秒
					const days = Math.floor(distance / (1000 * 60 * 60 * 24));
					const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
					const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
					const seconds = Math.floor((distance % (1000 * 60)) / 1000);

					// 格式化倒计时字符串
					item.countdownStr = `有效倒计时：${days}天${hours}小时${minutes}分${seconds}秒`;

				} else {
					// 倒计时结束
					item.countdownStr = "有效倒计时：已过期";
					clearInterval(intervalId);
				}
			}

			// 初始调用更新函数
			updateCountdown();

			// 每秒更新一次倒计时
			const intervalId = setInterval(updateCountdown, 1000);
			staticData.intervalIds.push(intervalId);
		}
		// 详情
		function toDetail(item) {
			if(!bindData.entitys['20007']){
				uniApi.showToast("暂无查看详情权限。");
				return
			}
			uni.navigateTo({
				url: '/pages/demand/demandDetail/demandDetail?orderId=' + item.orderId
			})
		}
		async function delDemand(item) {
			let {
				confirm
			} = await uniApi.showModal({
				title: "提示",
				content: "是否确认删除此需求",
				showCancel: true
			})
			if (confirm) {
				await util.postByBeanName('requirementsTF', 'deleteRequirements', {
					orderId: item.orderId
				});
				uniApi.showToast("删除成功");
				doQuery(true)
			}
		}

		function toEdit(item) {
			uni.navigateTo({
				url: '/pages/demand/addDemand/addDemand?orderId=' + item.orderId
			})
		}
		// 查询消息
		async function queryMsg() {
			let {
				items
			} = await util.postByBeanName('requirementsTF', 'queryTenantTodos');
			bindData.messageList = items;
			console.log(bindData.messageList)

		}
		// 发布需求
		function issueDemand() {
			popup.value.open()
		}
		// 登录
		function toLogin() {
			uni.navigateTo({
				url: "/pages/authentication/authentication"
			})
		}
		// 关闭提示
		function closePopup() {
			popup.value.close()
		}
		// 更多筛选
		function searchMore() {
			drawer.value.open();
		}

		// 信息列表跳转到竞价单详情
		function toOrder(item) {
			uni.navigateTo({
				url: '/pages/demand/demandDetail/demandDetail?orderId=' + item.orderId
			})
		}

		// 退出登录
		async function toLogout() {
			await util.postByBeanName('wxUserTF', 'logout', {});
			uni.removeStorageSync('userInfo');
			uni.reLaunch({
				url: '/pages/login/login',
			})
		}

		function toQuery() {
			clearFilter();
			doQuery(true)
		}
		// 清空选择
		function clearFilter() {
			bindData.beginIndexSearchStr = "";
			bindData.endIndexSearchStr = "";
			bindData.quoteVehicleType = "";
			bindData.vehicleLength = "";
		}
		// 确认选择
		function sureFilter() {
			drawer.value.close();
			bindData.searchStr = "";
			doQuery(true);
		}

		// 切换nav
		function changeNav(type) {
			bindData.navActive = type;
		}

		// 新增需求
		function addDemand() {
			uni.navigateTo({
				url: "/pages/demand/addDemand/addDemand"
			})
		}

		// 调度员管理
		function toDispatcher() {
			uni.navigateTo({
				url: "/pages/mine/dispatcherManage/dispatcherManage"
			})
		}

		// 角色管理
		function toRole() {
			uni.navigateTo({
				url: "/pages/mine/roleManage/roleManage"
			})
		}

		// 修改密码
		function toChangePassword() {
			uni.navigateTo({
				url: "/pages/forgetPsw/forgetPsw"
			})
		}

		return {
			...toRefs(bindData),
			scrolltolowerHandler,
			toupper,
			toDetail,
			toEdit,
			delDemand,
			queryMsg,
			toLogout,
			toLogin,
			issueDemand,
			popup,
			closePopup,
			drawer,
			searchMore,
			toQuery,
			clearFilter,
			sureFilter,
			changeNav,
			changeTab,
			addDemand,
			toOrder,
			toDispatcher,
			toChangePassword,
			toRole,
		}

	}
};