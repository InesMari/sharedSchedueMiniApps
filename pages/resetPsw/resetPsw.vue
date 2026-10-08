<template>
	<view class="resetPswPage">
		<view class="title">设置新的密码</view>
		<view class="logs-inputBox">
			<view class="verifyIpt">
				<view class="label fl">新密码</view>
				<input placeholder="请输入新密码" v-model="password" type="password"></input>
				<van-icon name="close" v-if="password" @click="clearData(password)" />
			</view>
			<view class="verifyIpt">
				<view class="label fl">确认密码</view>
				<input placeholder="请再次输入新密码" v-model="confirmPassword" type="password"></input>
				<van-icon name="close" v-if="confirmPassword" @click="clearData(confirmPassword)" />
			</view>
			<view class="pswTip">密码长度8~32位，须包含数字、字母、符号至少两种或以上元素</view>
		</view>
		<view class="button-box">
			<button class="logs-bot" :class="(!password||!confirmPassword)?'disabled':''" @click="submit"
				decode='true'>确<text style="margin:0 25rpx;"></text>认</button>
		</view>
	</view>
</template>

<script>
	import resetPsw from './resetPsw.js'
	export default resetPsw
</script>

<style scoped>
	@import '/pages/login/login.css';

	.resetPswPage {
		height: 100%;
		background: #fff;
	}

	.logs-inputBox {
		width: 90%;
		margin-top: 120rpx;
	}

	.verifyIpt {
		border-bottom: 1rpx solid #C5C5C5;
		position: relative;
		padding: 20rpx 0;
		display: flex;
		margin-bottom: 24rpx;
	}

	.verifyIpt .label {
		width: 134rpx;
		border-right: 1rpx solid #C5C5C5;
		line-height: 34rpx;
		font-size: 30rpx;
	}

	.verifyIpt input {
		height: 34rpx;
		flex: 1;
		-webkit-flex: 1;
		padding-left: 24rpx;
		font-size: 30rpx;
	}

	.verifyIpt van-icon {
		position: absolute;
		top: 30rpx;
		right: 0;
		z-index: 9;
	}

	.verifyIpt .van-icon {
		color: #999;
		cursor: pointer;
	}

	.pswTip {
		line-height: 1.5;
		font-size: 26rpx;
		color: #999;
		margin-top: 16rpx;
	}

	.logs-bot {
		margin-top: 120rpx;
	}
</style>