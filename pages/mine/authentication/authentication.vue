<template>
	<view>
		<view class="formList">
			<view class="item">
				<view class="label"><text class="red">*</text>物流公司名称：</view>
				<view class="input-text">
					<input type="text" placeholder="请输入" v-model="info.tenantName" />
				</view>
			</view>
			<view class="item">
				<view class="label"><text class="red">*</text>登录账号：</view>
				<view class="input-text">
					<input type="text" placeholder="请输入" v-model="info.linkPhone" />
				</view>
			</view>
			<view class="item">
				<view class="label"><text class="red">*</text>简称：</view>
				<view class="input-text">
					<input type="text" placeholder="请输入" v-model="info.abbreviationName" />
				</view>
			</view>
			<view class="item">
				<view class="label">公司地址：</view>
				<view class="input-text">
					<input type="text" placeholder="请输入" v-model="info.address" />
				</view>
			</view>
			<view class="item">
				<view class="label">联系人：</view>
				<view class="input-text">
					<input type="text" placeholder="请输入" v-model="info.linkman" />
				</view>
			</view>
			<view class="item">
				<view class="label">上传营业执照：</view>
				<view class="input-text">
					<uni-file-picker 
						v-model="info.imageValue" 
						fileMediatype="image" 
						mode="grid" 
						@select="selectBack" 
						limit="1"
					/>
				</view>
			</view>
		</view>
		<view class="footerBtn">
			<button size="mini" type="warn" @click="submit">提交</button>
		</view>
	</view>
</template>

<script>
	import authentication from './authentication.js'
	export default authentication
</script>

<style lang="scss" scoped>
.formList .item .label{
	width: 220rpx;
}
</style>