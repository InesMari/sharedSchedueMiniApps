<template>
	<view class="noEntityPage">
		<view class="content">
			<image mode="widthFix" class="noEntityLogo" src="/static/images/noEntity.png"></image>
			<view class="tip">
				<view>没有操作权限</view>
				<view>请联系管理员授权后重新登录。</view>
			</view>
		</view>

		<view class="footerBtn btns">
			<button size="mini" type="warn" @click="toLogout">重新登录</button>
		</view>
	</view>
</template>

<script setup>
	import {
		util,
		common
	} from '/common/commonImport';
	// 退出登录
	async function toLogout() {
		await util.postByBeanName('wxUserTF', 'logout', {});
		uni.removeStorageSync('userInfo');
		uni.reLaunch({
			url: '/pages/login/login',
		})
	}
</script>

<style lang="scss" scoped>
	.noEntityPage {
		.content {
			position: fixed;
			width: 100%;
			top: 20%;
			left: 0;

			.noEntityLogo {
				width: 200rpx;
				display: block;
				margin: 0 auto;
			}

			.tip {
				margin-top: 50rpx;

				view {
					font-size: 30rpx;
					color: #333;
					line-height: 50rpx;
					text-align: center;
					font-weight: bold;
				}
			}
		}
	}
</style>