import {
	util,
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
			phone: "",
			stamp: true,
			msg: '获取验证码',
			smsValidCode: "",
		})
		let normalData = {}
		// 获取验证码
		function getCode() {
			if (!bindData.phone) {
				uni.showModal({
					title: "提示",
					content: '请输入手机号码',
					confirmText: "确定",
					showCancel: false
				})
				return false;
			}
			if (bindData.phone.length != 11) {
				uni.showModal({
					title: "提示",
					content: '请输入有效的手机号',
					confirmText: "确定",
					showCancel: false
				})
				return false;
			}
			sendSmsValidCode(function() {
				normalData.verifyPhone = false
			})
		}

		function sendSmsValidCode(fun) {

			if (bindData.stamp) {
				util.postByBeanName("wxUserTF", "sendPasswordSmsValidCode", {
					billId: bindData.phone,
					programType: 3
				}, function(data) {
					//成功执行
					if (data) {
						bindData.stamp = false;
						bindData.miao = 60;
						if (typeof fun == "function") {
							fun();
						}
						const timer = setInterval(function() {
							if (!bindData.stamp) {
								bindData.miao = parseInt(bindData.miao) - 1;
								bindData.msg = bindData.miao + "S";
								if (bindData.miao == 0) {
									bindData.msg = "获取验证码";
									bindData.stamp = true;
									clearInterval(timer)
								}
							} else {
								bindData.msg = "获取验证码";
								bindData.stamp = true;
							}
						}, 1000);
					}
				}, function(data) {
					if (data.data.message === '短信验证码5分钟内有效，无需重复申请') {
						normalData.verifyPhone = false
					}
				})
			}

		}

		function goNext() {
			util.postByBeanName("wxUserTF", "checkModifyPasswordSmsValidCode", {
				billId: bindData.phone,
				smsVaildCode: bindData.smsValidCode
			}, function(data) {
				if (data) {
					uni.navigateTo({
						url: '/pages/resetPsw/resetPsw?billId=' + bindData.phone + '&smsVaildCode=' +
							bindData.smsValidCode,
					})
				}
			})
		}
		return {
			...toRefs(bindData),
			getCode,
			goNext,
		}
	}
};