<template></template>

<script>
	import {
		util,
		common
	} from '/common/commonImport';
	export default {
		data() {
			return {};
		},
		onLoad: function(res) {},
		/**
		 * 生命周期函数--监听页面显示
		 */
		onShow: function() {
			this.loginCheck();
		},
		methods: {
			loginCheck() {
				let userInfo = uni.getStorageSync('userInfo');

				if (common.isBlank(userInfo)) {
					uni.reLaunch({
						url: '/pages/homeNoLogin/homeNoLogin'
					});
					return false;
				}
				// #ifdef MP-WEIXIN
				uni.login({
					success: (res) => {
						this.checkLogin(res)
					}
				});
				// #endif
				// #ifndef MP-WEIXIN
				this.checkLogin();
				// #endif
			},
			checkLogin(res) {
				if (common.isNotBlank(res)) {
					var param = {
						wxCode: res.code,
					}
				} else {
					var param = {
						
					}
				}
				param.appId = util.wxAppId;
				//后台处理登录相关
				util.postByBeanName(
					'wxUserTF',
					'checkLogin',
					param,
					function(data) {
						if (data.code == 'Y') {
							//登录成功
							if(data.authState == 2){
								// 已认证
								uni.reLaunch({
									url: '/pages/home/home'
								});								
							}else{
								// 未认证
								uni.reLaunch({
									url: '/pages/homeNoLogin/homeNoLogin'
								});	
							}
						} else {
							uni.reLaunch({
								url: '/pages/homeNoLogin/homeNoLogin'
							});
						}
					},
					function(data) {
						uni.reLaunch({
							url: '/pages/homeNoLogin/homeNoLogin'
						});
					}
				);
			}
		}
	};
</script>
<style>
	/* preserve/preserve.wxss */
</style>