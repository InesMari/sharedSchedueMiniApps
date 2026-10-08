import {
	util,
	uniApi,
	common
} from '/common/commonImport';
import {
	onLoad
} from '@dcloudio/uni-app'
import {
	reactive,
	toRefs,
	ref,
	computed,
	nextTick
} from "vue";
export default {
	setup() {
		// 绑定数据
		let bindData = reactive({
			info: {
				vehicleLength: [],
				quoteVehicleType: [],
				times: 1,
				dtls: [{}, {}],
				lng: '',
				lat: '',
			},
			checkUserList: [],
			importUserId: [],
			value: '',
			quoteVehicleTypeList: [],
			vehicleLengthList: [],
			visibleRange: [{
				text: "内部员工",
				value: '1',
			}, {
				text: "关联合作",
				value: '2',
			}, {
				text: "平台调度",
				value: '3',
			}],
			isshowMap: false,
			lng: '',
			lat: '',
			marker: {
				id: 1,
				height: 50,
				width: 40
			},
			mapKey: 'SP9KVU7TzR8B3p3NWS9mprD8wA1gCdFA', //百度地图
			mapType: 'bmap', // tmap bmap amap
			location: {
				lng: '',
				lat: '',
			},
			popupText: {
				content: "您现在的操作需要身份认证且通过后才能继续",
				confirmText: "去认证"
			}
		})
		let staticData = {}
		let popup = ref();
		let map = ref();
		
		//#ifdef MP-WEIXIN
		// 返回监听
		uni.enableAlertBeforeUnload({
			message: "是否返回？（填写信息将丢失）",
		})
		//#endif
		
		onLoad(({
			orderId
		}) => {
			initData();
			initLocation();
			if (common.isNotBlank(orderId)) {
				doQuery(orderId);
				uni.setNavigationBarTitle({
					title: '修改需求'
				});
			}
		})

		function initLocation() {
			console.log("获取定位")
			uni.getLocation({
				type: 'wgs84',
				success: function(res) {
					bindData.lng = String(res.longitude);
					bindData.lat = String(res.latitude);
					staticData.lng = String(res.longitude);
					staticData.lat = String(res.latitude);
					console.log(bindData.lng, bindData.lat)
				},
				fail(e) {
					console.log("获取定位报错")
					console.log(e)
				}
			});
		}
		async function initData() {
			let info = uni.getStorageSync("demand");
			if (common.isNotBlank(info)) {
				bindData.info = info;
			}
			let {
				VEHICLE_TYPE_QUOTE,
				VEHICLE_LENGTH
			} = await util.postByBeanName('commonTF', 'getSysStaticDataByCodeTypes', {
				codeType: "VEHICLE_TYPE_QUOTE,VEHICLE_LENGTH"
			});
			bindData.quoteVehicleTypeList = VEHICLE_TYPE_QUOTE;
			bindData.vehicleLengthList = VEHICLE_LENGTH;
		}
		// 查询详情
		async function doQuery(orderId) {
			bindData.info = await util.postByBeanName('requirementsTF', 'queryRequirementsDetailForWLGS', {
				orderId
			});
			bindData.info.quoteVehicleType = bindData.info.quoteVehicleType.split(',');
			bindData.info.vehicleLength = bindData.info.vehicleLength.split(',');
		}

		function selectChange() {
			// 此处为点击的事件
		}

		function searchEvent(val) {
			console.log('查询事件参数', val)
			// 此处把新的请求值 赋值给options
		}

		// 选择日期
		function maskClick(e) {
			console.log('maskClick事件:', e);
		}

		async function confirm(e) {
			console.log(e)
			if (e) {
				let province = e.addressComponent.province;
				let city = e.addressComponent.city;
				let district = e.addressComponent.district;
				let item = bindData.info.dtls[staticData.currentIndex];
				if (province) {
					let {
						id
					} = await util.postByBeanName('commonTF', 'getProvince', {
						name: province
					});
					item.provinceId = id;
				}
				if (city) {
					let {
						id
					} = await util.postByBeanName('commonTF', 'getCity', {
						name: city,
						provinceId: item.provinceId,
					});
					item.cityId = id;
				}
				if (district) {
					let {
						id
					} = await util.postByBeanName('commonTF', 'getDistrict', {
						name: district,
						cityId: item.cityId,
					});
					item.districtId = id;
				}
				item.address = e.name;
				item.lat = e.location.lat;
				item.lng = e.location.lng;
			}
			bindData.isshowMap = false;
		}

		function showMap(index) {
			bindData.isshowMap = true;
			staticData.currentIndex = index;
			let {
				lng,
				lat,
				address
			} = bindData.info.dtls[index];
			if (lng) {
				bindData.lng = lng;
				bindData.lat = lat;
			} else {
				bindData.lng = staticData.lng;
				bindData.lat = staticData.lat;
			}
			nextTick(() => {
				map.value.$children[0].init(address);
			})
			console.log(bindData)
		}

		function addDtl() {
			bindData.info.dtls.splice(bindData.info.dtls.length - 1, 0, {});
		}

		function delDtl(index) {
			bindData.info.dtls.splice(index, 1);
		}

		function checkAuthState() {
			let {
				authState
			} = uni.getStorageSync('userInfo');
			if (authState == 2) {
				// 已认证
				return true
			} else {
				uni.setStorageSync("demand", bindData.info);
				if (authState == 0) {
					bindData.popupText.confirmText = "去认证";
					bindData.popupText.content = "您现在的操作需要身份认证且通过后才能继续！";
					popup.value.open()
				} else if (authState == 1) {
					uni.showModal({
						title: '提示',
						showCancel: false,
						content: '您的身份认证信息审核中，请耐心等待！',
					});
				} else if (authState == 3) {
					bindData.popupText.confirmText = "去修改";
					bindData.popupText.content = "您的身份认证信息审核不通过！";
					popup.value.open()
				}
				return false
			}
		}

		// 登录
		function toAuth() {
			uni.navigateTo({
				url: "/pages/mine/authentication/authentication"
			})
		}
		// 关闭提示
		function closePopup() {
			popup.value.close()
		}

		async function save() {
			if (!checkAuthState()) return
			bindData.info.visibleRange.forEach(i => {
				bindData.info['visibleRange' + i] = 1;
			})
			for (let i = 1; i < 4; i++) {
				if (bindData.info.visibleRange.includes(String(i))) {
					bindData.info['visibleRange' + i] = 1;
				} else {
					bindData.info['visibleRange' + i] = 0;
				}
			}
			// console.log(bindData.info)
			await util.postByBeanName('requirementsTF', 'saveOrUpdateRequirements', bindData.info);			
			uni.disableAlertBeforeUnload();
			await uniApi.showModal("保存成功");
			uni.removeStorageSync("demand");
			uni.navigateBack({
				delta: 1,
			})
		}
		return {
			...toRefs(bindData),
			map,
			maskClick,
			selectChange,
			searchEvent,
			confirm,
			showMap,
			save,
			addDtl,
			delDtl,
			popup,
			toAuth,
		}
	}
}