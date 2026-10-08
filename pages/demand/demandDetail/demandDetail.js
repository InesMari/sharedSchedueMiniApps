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
	computed
} from "vue";
export default {
	setup() {
		// 绑定数据
		let bindData = reactive({
			entitys:common.getEntityIds(),
			info: {},
			stepList: [],
			emptyCheckbox: [{
				value: 1,
				text: ""
			}],
			showBidSure: false,
			selectDispatchData: [],
			errorMsg: "",
			canQuotation:false,
		})
		let staticData = {
			userInfo: uni.getStorageSync('userInfo')
		}
		let infoErrorPopup = ref();

		onLoad(async ({
			orderId
		}) => {
			initData();
			doQuery(orderId);
		})


		async function initData() {
			let {
				ORDER_STATE
			} = await util.postByBeanName('commonTF', 'getSysStaticDataByCodeTypes', {
				codeType: "ORDER_STATE"
			});
			bindData.stepList = [...ORDER_STATE];
			bindData.stepList.length = bindData.stepList.length - 2;
			bindData.stepList.forEach(item => {
				item.title = item.codeName;
			})
		}

		// 查询列表
		async function doQuery(orderId) {
			if (common.isBlank(staticData.userInfo) || staticData.userInfo.authState != 2) {
				bindData.info = await util.postByBeanName('requirementsTF', 'queryRequirementsDetailForNoLogin', {
					orderId
				});
			} else {
				bindData.info = await util.postByBeanName('requirementsTF', 'queryRequirementsDetailForWLGS', {
					orderId
				});
				if(bindData.info.dispatchList.length == 1){	//只有一条数据时默认选中
					bindData.info.dispatchList[0].isselect = [1];
				}
				bindData.info.dispatchDtlList.forEach(item => {
					item.vehicleLicense = [{
						url: item.vehicleLicenseFrontImgFullUrl
					}, {
						url: item.vehicleLicenseBackImgFullUrl
					}]
					item.driverLicense = [{
						url: item.driverLicenceFrontImgFullUrl
					}, {
						url: item.driverLicenceBackImgFullUrl
					}]
				})
				let {selTimes,times} = bindData.info;
				if(common.isNotBlank(selTimes) && times>selTimes){
					bindData.canQuotation = true
				}
				console.log(bindData.info)
			}

		}
		
		// 选择中标人
		function dataSelect(item){
			bindData.info.dispatchList.forEach(el => {
				el.isselect = [];
			})
			item.isselect = [1];
		}

		// 中标确认弹窗
		function sureBid() {
			console.log(bindData.info.dispatchList)
			bindData.selectDispatchData = [];
			bindData.info.dispatchList.forEach(item => {
				if (item.isselect && item.isselect.length>0) bindData.selectDispatchData.push(item);
			})
			console.log(bindData.info.dispatchList)
			if (bindData.selectDispatchData.length > 0) {
				bindData.selectDispatchData.forEach(item => {
					item.selTimes = 1;
				})
				bindData.showBidSure = true;
			} else if (bindData.selectDispatchData.length > 1) {
				uniApi.showToast("最多只能选择一个中标人")
			} else {
				uniApi.showToast("请选择中标人")
			}
		}

		// 取消中标确认
		function cancelBid() {
			bindData.showBidSure = false;
		}
		// 中标确认
		async function submitBid() {
			let selTimesEmpyt = false;
			bindData.selectDispatchData.forEach(item => {
				if (common.isBlank(item.selTimes)) selTimesEmpyt = true;
			})

			if (selTimesEmpyt) {
				uniApi.showToast("请输入车次")
				return
			}
			let {
				orderDispatchId,
				selTimes
			} = bindData.selectDispatchData[0];
			await util.postByBeanName('requirementsTF', 'selDispatch', {
				orderDispatchId,
				selTimes
			});
			await uniApi.showModal("保存成功")
			uni.navigateBack({
				delta: 1,
			})
		}

		// 打开资料异常弹窗
		function infoError(orderDispatchDtlId, orderDispatchId) {
			staticData.errorInfo = {
				orderDispatchDtlId,
				orderDispatchId
			}
			infoErrorPopup.value.open();
		}
		// 关闭资料异常弹窗
		function closeInfoErrorPopup() {
			infoErrorPopup.value.close();
		}
		async function submitInfoError() {
			let {
				orderDispatchDtlId,
				orderDispatchId
			} = staticData.errorInfo
			await util.postByBeanName('requirementsTF', 'confirmDispatchDtl', {
				orderDispatchDtlId,
				orderDispatchId,
				type: 1,
				errorMsg: bindData.errorMsg,
			});
			await uniApi.showModal("提交成功")
			closeInfoErrorPopup();
			uni.navigateBack({
				delta: 1,
			})
		}

		// 资料确认
		async function infoSure(orderDispatchDtlId, orderDispatchId) {
			let {
				confirm
			} = await uniApi.showModal({
				title: "提示",
				content: "资料确认后不可回退，是否继续确认提交？",
				showCancel: true
			})
			if (confirm) {
				await util.postByBeanName('requirementsTF', 'confirmDispatchDtl', {
					orderDispatchDtlId,
					orderDispatchId,
					type: 2,
				});
				await uniApi.showModal("提交成功")
				uni.navigateBack({
					delta: 1,
				})
			}
		}

		return {
			...toRefs(bindData),
			sureBid,
			cancelBid,
			submitBid,
			infoErrorPopup,
			dataSelect,
			infoError,
			infoSure,
			submitInfoError,
			closeInfoErrorPopup,
		}
	}
}