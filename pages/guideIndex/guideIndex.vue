<template>
    <view>
        <view class="contain">
            <image class="banner" src="/static/images/banner.png" mode="widthFix"></image>
            <view class="list clearfix">
                <view class="item">
                    <image src="/static/images/i_1.png"></image>
                    <view class="name">运输管理</view>
                    <view class="explain">可进行新增/调度订单</view>
                </view>
                <view class="item">
                    <image src="/static/images/i_10.png"></image>
                    <view class="name">仓储管理</view>
                    <view class="explain">可进行出库入库操作</view>
                </view>
                <view class="item">
                    <image src="/static/images/i_13.png"></image>
                    <view class="name">单据管理</view>
                    <view class="explain">可对付款单/请款单审核</view>
                </view>
            </view>
        </view>
        <view class="loginView">
            <text>您当前尚未登录</text>
            <button @click="getPhoneNumber">立即登录</button>
        </view>
    </view>
</template>

<script>
import { util, common } from '/common/commonImport';
export default {
    data() {
        return {};
    }
    /**
     * 生命周期函数--监听页面加载
     */,
    onLoad: function (options) {
        uni.login();
    },
    methods: {
        async getPhoneNumber() {
			// #ifdef MP-WEIXIN
			let res = await uni.login(); //后台处理登录相关
			util.postByBeanName(
				'wxUserTF',
				'getWxUserBillId',
				{
					wxCode: res.code,
					programType: 3,
				},
				function (data) {
					if (data) {
						//登录成功
						uni.hideLoading();
						uni.reLaunch({
							url: '/pages/login/login?billId=' + data
						});
					}
				},
				function (e) {
					uni.reLaunch({
						url: '/pages/login/login'
					});
				}
			);
			// #endif
			
			// #ifndef MP-WEIXIN
			uni.reLaunch({
				url: '/pages/login/login'
			});
			// #endif
        },

    }
};
</script>
<style>
page {
    background: #f1f2f5;
}
.contain {
    padding: 30rpx;
}
.banner {
    display: block;
    margin-bottom: 30rpx;
}
.list .item {
    background: #fff;
    border-radius: 18rpx;
    text-align: center;
    width: 48%;
    margin-right: 4%;
    margin-bottom: 30rpx;
    padding: 30rpx 0;
    float: left;
    position: relative;
}
.list .item:nth-child(even) {
    margin-right: 0;
}
.list .item image {
    width: 93px;
    height: 93px;
    margin: 0 auto;
}
.list .item .name {
    font-weight: Regular;
    margin: 24rpx 0;
    font-size: 32rpx;
    line-height: 1;
}
.list .item .explain {
    font-size: 24rpx;
    line-height: 1;
    color: #999;
}
.list .item .tip {
    position: absolute;
    top: 20rpx;
    right: 20rpx;
    background: red;
    color: #fff;
    height: 35rpx;
    width: 35rpx;
    border-radius: 50%;
}
.loginView {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 9;
    width: 100%;
    background: rgba(0, 0, 0, 0.7);
    padding: 25rpx 30rpx 25rpx 34rpx;
    color: #fff;
    font-size: 28rpx;
    box-sizing: border-box;
    line-height: 62rpx;
}
.loginView button {
    float: right;
    background: #e60012;
    height: 62rpx;
    line-height: 62rpx;
    color: #fff;
    border-radius: 100rpx;
    font-size: 28rpx;
    width: 200rpx;
}
</style>
