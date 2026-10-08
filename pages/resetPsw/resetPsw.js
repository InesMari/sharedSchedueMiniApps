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
			billId: '',
			smsVaildCode: '',
			password: '',
			confirmPassword: '',
		})
		let normalData = {}
		onLoad(({
			billId,
			smsVaildCode
		}) => {
			bindData.billId = billId;
			bindData.smsVaildCode = smsVaildCode;
		})

		function clearData(key) {
			bindData[key] = '';
		}
		async function submit() {
			let {
				password,
				confirmPassword,
				billId,
				smsVaildCode
			} = bindData;
			if (!password) {
				await uniApi.showModal('请输入密码')
				return false;
			}
			if (!confirmPassword) {
				await uniApi.showModal('请输入二次确认密码')
				return false;
			}
			if (password != confirmPassword) {
				await uniApi.showModal('两次输入密码不一致')
				return false;
			}
			let param = {};
			param.billId = billId;
			param.smsVaildCode = smsVaildCode;
			param.password = util.rsaEncrypt(password);
			param.confirmPassword = util.rsaEncrypt(confirmPassword);
			let data = await util.postByBeanName("wxUserTF", "smsValidCodeModifyPassword", param);
			if (data) {
				await uniApi.showModal('修改密码成功');
				uni.reLaunch({
					url: '/pages/login/login',
				})
			}
		}


		return {
			...toRefs(bindData),
			clearData,
			submit,
		}
	}
};