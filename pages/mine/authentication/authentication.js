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
			info: {},
		})
		let staticData = {
			userInfo: uni.getStorageSync('userInfo')
		}
		// 上传成功
		async function selectBack(e) {
			uni.showLoading();
			const {
				file
			} = e.tempFiles[0];
			let {
				data
			} = await util.uploadFile(file);
			uni.hideLoading();
			data = JSON.parse(data); //数据转化
			bindData.info.businessLicenseImg = data.content.flowId;
			bindData.info.businessLicenseImgPath = data.content.storePath;
			console.log(bindData.info)
			console.log(data)
		}
		async function submit() {
			let {
				tenantName,
				linkPhone,
				abbreviationName
			} = bindData.info;
			if (common.isBlank(tenantName)) {
				await uniApi.showToast("请输入物流公司名称")
				return
			}
			if (common.isBlank(linkPhone)) {
				await uniApi.showToast("请输入登录账号")
				return
			}
			if (common.isBlank(abbreviationName)) {
				await uniApi.showToast("请输入简称")
				return
			}
			await util.postByBeanName('tenantTF', 'regTenant', bindData.info);
			await uniApi.showModal("保存成功")
			let res = await util.postByBeanName('wxUserTF', 'getIsVerify',{appId:util.wxAppId});
			staticData.userInfo.authState = res;
			uni.setStorageSync('userInfo', bindData.userInfo);
			uni.navigateBack({
				delta: 1,
			})
		}
		return {
			...toRefs(bindData),
			selectBack,
			submit
		}

	}
};