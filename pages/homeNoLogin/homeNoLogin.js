import {
	util,
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
			searchStr: "",
			beginIndexSearchStr: "",
			endIndexSearchStr: "",
			quoteVehicleType: "",
			vehicleLength: "",
			quoteVehicleTypeList: [],
			vehicleLengthList: [],
			demandList: [],
			isRefresh: false,
			userInfo: uni.getStorageSync('userInfo'),
		})
		let staticData = {
			intervalIds: [],
		}
		let popup = ref();
		let drawer = ref();
		/**
		 * 生命周期函数--监听页面加载
		 */
		onLoad(() => {
			//#ifdef MP-WEIXIN
			uni.hideHomeButton();
			//#endif
			initData();
			doQuery(true);
			console.log(bindData.userInfo)
		})
		onShow(() => {
			// 重新触发定时器
			if (bindData.demandList.length > 0) {
				bindData.demandList.forEach(item => {
					countdown(item.expireDate, item);
				})
			}
			if (common.isNotBlank(bindData.userInfo)) {
				getIsVerify();
			}
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
		async function getIsVerify() {
			let res = await util.postByBeanName('wxUserTF', 'getIsVerify',{appId:util.wxAppId});
			bindData.userInfo.authState = res;
			uni.setStorageSync('userInfo', bindData.userInfo);
			console.log(uni.getStorageSync('userInfo'))
		}
		// 获取静态数据
		async function initData() {
			let {
				VEHICLE_TYPE_QUOTE,
				VEHICLE_LENGTH
			} = await util.postByBeanName('commonTF', 'getSysStaticDataByCodeTypes', {
				codeType: "VEHICLE_TYPE_QUOTE,VEHICLE_LENGTH"
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
		}
		// 查询列表
		async function doQuery(clear) {

			if (clear) { //clear为true的时候清空页码
				staticData.page = 1
			}
			let {
				searchStr,
				beginIndexSearchStr,
				endIndexSearchStr,
				quoteVehicleType,
				vehicleLength
			} = bindData;
			let {
				items,
				hasNext
			} = await util.postByBeanName('requirementsTF', 'queryRequirementsPageForNoLogin', {
				page: staticData.page,
				searchStr,
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
			bindData.demandList = [...bindData.demandList,...items];
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
		// 倒计时
		function countdown(targetDateStr, item) {
			return
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
					item.countdownStr = `有效倒计时：${days} 天 ${hours} 小时 ${minutes} 分 ${seconds} 秒`;

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
			uni.navigateTo({
				url: '/pages/demand/demandDetail/demandDetail?orderId=' + item.orderId
			})
		}
		// 选择角色
		function chooseUserType(type) {
			bindData.userType = type;
		}
		// 发布需求
		function issueDemand() {
			if (bindData.userInfo) {
				uni.navigateTo({
					url: "/pages/demand/addDemand/addDemand"
				})
			} else {
				// 未登录
				popup.value.open()
			}
		}
		// 登录
		function toLogin() {
			uni.navigateTo({
				url: "/pages/login/login"
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
		// 登录
		function toAuth() {
			uni.navigateTo({
				url: "/pages/mine/authentication/authentication"
			})
		}

		return {
			...toRefs(bindData),
			scrolltolowerHandler,
			toupper,
			chooseUserType,
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
			toDetail,
			toAuth,
		}

	}
};