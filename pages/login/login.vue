<template>
	<view class="loginPage">
		<view class="contain">
			<view class="title">Hi，欢迎使用雁擎公司端小程序</view>
			<view class="logs-inputBox">
				<view class="type">
					<view class="item" @click="changeType(1)"><text :class="loginType == 1?'active':''">密码登录</text>
					</view>
					<view class="item" @click="changeType(2)"><text :class="loginType == 2?'active':''">验证码登录</text>
					</view>
				</view>
				<view class="field">
					<view class="item">
						<image class="icon" src="/static/images/icon_phone.png" mode="widthFix"></image>
						<input type="number" v-model="billId" placeholder="请输入手机号" />
					</view>
					<view class="item" v-if="loginType==1">
						<image class="icon psw" src="/static/images/icon_password.png" mode="widthFix"></image>
						<input type="password" password="true" v-model="password" placeholder="请输入密码" />
					</view>
					<view class="item" v-if="loginType==2">
						<image class="icon psw" src="/static/images/icon_password.png" mode="widthFix"></image>
						<input type="text" v-model="smsVaildCode" placeholder="请输入验证码"></input>
						<button class="msg-btn" :class="(!billId||!stamp)?'disabled':''"
							@click="getCode">{{msg}}</button>
					</view>
				</view>
				<view class="forgetPassword" @tap="toForgetPsw">忘记密码？</view>
			</view>
			<!-- #ifdef MP-WEIXIN -->
			<button class="logs-bot" open-type="getUserInfo"
				@getuserinfo="login">
				登
				<text style="margin: 0 25rpx"></text>
				录
			</button>
			<!-- #endif -->
			<!-- #ifndef MP-WEIXIN -->
			<button :class="'logs-bot ' + (!billId || !password ? 'disabled' : '')" @click="login">
				登
				<text style="margin: 0 25rpx"></text>
				录
			</button>
			<!-- #endif -->

			<!-- <view class="protocol">
        点击登录，即表示已阅读并同意 <view class="protocol-text span" bindtap="protocol">《易迁易用户协议》</view>
    </view> -->
		</view>
		<image class="loginBg" src="/static/images/loginBg.png" mode="widthFix"></image>
	</view>
</template>

<script>
	import login from './login.js'
	export default login
</script>
<style>
	.loginPage {
		height: 100%;
		background: #fff;
	}

	.title {
		padding: 30rpx 34rpx 0;
		font-size: 30rpx;
	}

	.logs-inputBox {
		width: 76%;
		margin: 0 auto;
	}

	.logs-inputBox .type {
		display: flex;
		align-items: center;
		text-align: center;
		margin-top: 100rpx;
	}

	.logs-inputBox .type .item {
		flex: 1;
		font-size: 28rpx;
	}

	.logs-inputBox .type .item text {
		display: inline-block;
		line-height: 56rpx;
	}

	.logs-inputBox .type .item text.active {
		color: #e60012;
		border-bottom: 1rpx solid #e60012;
	}

	.logs-inputBox .field {
		margin-top: 90rpx;
	}

	.logs-inputBox .field .item {
		padding-left: 64rpx;
		position: relative;
		margin-bottom: 60rpx;
	}

	.logs-inputBox .field .item::before {
		content: '';
		position: absolute;
		bottom: -20rpx;
		left: 0;
		width: 100%;
		border-bottom: 1rpx solid #f6f6f6;
	}

	.logs-inputBox .field .item input {
		font-size: 30rpx;
		font-weight: normal;
	}

	.logs-inputBox .field .item .icon {
		position: absolute;
		left: 0;
		top: 50%;
		width: 24rpx;
		transform: translateY(-55%);
		-webkit-transform: translateY(-55%);
	}

	.logs-inputBox .field .item .icon.psw {
		width: 30rpx;
	}

	.msg-btn {
		position: absolute;
		right: 0;
		top: -6rpx;
		height: 56rpx;
		width: 154rpx;
		text-align: center;
		line-height: 56rpx;
		border-radius: 100rpx;
		color: #fff;
		background: #e60012;
		font-size: 22rpx;
		padding: 0;
		z-index: 9;
	}

	.logs-bot {
		color: #fff;
		background: #e60012;
		border-radius: 100rpx;
		width: 76%;
		margin: 50rpx auto 0;
	}

	.logs-bot.disabled,
	.msg-btn.disabled {
		opacity: 0.3;
		pointer-events: none;
	}

	.protocol {
		font-size: 24rpx;
		text-align: center;
		margin-top: 50rpx;
	}

	.protocol-text {
		color: #22afd7;
		margin-top: 10rpx;
	}

	/* 屏蔽 */
	.shield {
		width: 100%;
		height: 100%;
		opacity: 0.5;
		background: #5f6062;
		z-index: 999;
		position: fixed;
		top: 0%;
		left: 0%;
		text-align: center;
	}

	.shield-text {
		color: #fff;
		font-size: 64rpx;
		position: fixed;
		top: 40%;
		left: 30%;
	}

	/* 弹窗 */
	.select {
		width: 630rpx;
		height: 648rpx;
		left: 40rpx;
		top: 276rpx;
		z-index: 35;
		font-size: 20px;
		line-height: 50rpx;
		background: #fff;
		position: absolute;
		padding: 30rpx 20rpx 0 20rpx;
		z-index: 999;
	}

	.select-tetx {
		/* font-size: 44rpx; */
		text-align: center;
	}

	.select-box {
		width: 100%;
		height: 500rpx;
		margin-top: 30rpx;
		overflow-y: scroll;
		box-sizing: border-box;
	}

	.select-company {
		width: 100%;
		height: 80rpx;
		color: #fff;
		text-align: center;
		line-height: 80rpx;
		background: red;
		border-radius: 10rpx;
		margin-bottom: 20rpx;
	}

	page {
		height: 100%;
	}

	.contain {
		position: relative;
		z-index: 9;
	}

	.background {
		position: fixed;
		top: 0%;
		left: 0%;
		width: 100%;
		height: 100%;
		background: #000;
		z-index: 99;
		opacity: 0.5;
	}

	.forgetPassword {
		text-align: right;
		font-size: 24rpx;
	}

	.loginBg {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
	}
</style>