<template>
	<view class="forgetPasswordPage">
		<view class="title">用手机号重置密码</view>
		<view class="logs-inputBox">
		  <view class="field">
		    <view class="item">
		      <image class="icon" src="/static/images/icon_phone.png" mode="widthFix" ></image>
		      <input type="number" v-model="phone" placeholder="请输入手机号"></input>
		    </view>
		    <view class="item">
		      <image class="icon psw" src="/static/images/icon_password.png" mode="widthFix" ></image>
		      <input type="text" v-model="smsValidCode" placeholder="请输入验证码"></input>
		      <button class="msg-btn" :class="(!phone||!stamp)?'disabled':''" @click="getCode">{{msg}}</button>
		    </view>
		  </view>
		</view>
		<button class="logs-bot" :class="(!smsValidCode||!phone)?'disabled':''" @click="goNext">下一步</button>
	</view>
</template>

<script>
	import forgetPsw from './forgetPsw.js'
	export default forgetPsw
</script>

<style lang="scss" scoped>
@import '/pages/login/login.css';
.forgetPasswordPage{
	height: 100%;
	background: #fff;
}
.logs-inputBox{
  width:auto;
  padding:0 20rpx 0 34rpx;
}
.logs-inputBox .field{
  margin-top: 140rpx;
}
.logs-inputBox .field .item{
  padding-left: 54rpx;
}
.logs-bot{
  margin-top: 140rpx;
}
.verifyTitle{
  font-size: 42rpx;
  margin-bottom: 10rpx;
}
.verifyIpt{
  border-bottom: 1rpx solid #efefef;
  position: relative;
  padding: 20rpx 0;
}
.verifyIpt van-icon{
  position: absolute;
  top: 30rpx;
  right:0;
}
.verifyIpt .van-icon{
  color: #999;
  cursor: pointer;
}
.list .item{
  width: 90rpx;
  height: 90rpx;
  border: 1rpx solid #dee2e9;
  border-radius: 5rpx;
  background: #fff;
  float: left;
  box-sizing: border-box;
  margin-right:20rpx;
}
.list .item input{
  height: 100%;
  width: 100%;
  text-align: center;
  font-size: 34rpx;
}
</style>
