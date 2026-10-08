<template>
	<view class="addDispatcherPage">
		<uni-section title="身份证照片" type="line"></uni-section>
		<view class="formList mb_20">
			<view class="item">
				<view class="label">正页：</view>
				<view class="input-text">
					<uni-file-picker v-model="info.idCardFrontImgUrls" fileMediatype="image" mode="grid" @select="selectFront" @delete="clearFront"
						limit="1" :disabled="disabled" />
				</view>
			</view>
			<view class="item">
				<view class="label">副页：</view>
				<view class="input-text">
					<uni-file-picker v-model="info.idCardBackImgUrls" fileMediatype="image" mode="grid" @select="selectBack" @delete="clearBack"
						limit="1" :disabled="disabled" />
				</view>
			</view>
		</view>

		<uni-section title="调度基本信息" type="line"></uni-section>
		<view class="formList labelLength">
			<view class="item">
				<view class="label"><text class="red">*</text>调度员姓名：</view>
				<view class="input-text">
					<input type="text" placeholder="请输入" v-model="info.userName" :disabled="disabled" />
				</view>
			</view>
			<view class="item">
				<view class="label"><text class="red">*</text>调度员手机：</view>
				<view class="input-text">
					<input type="text" placeholder="请输入" v-model="info.billId" :disabled="disabled" />
				</view>
			</view>
			<view class="item">
				<view class="label"><text class="red">*</text>身份证：</view>
				<view class="input-text">
					<input type="text" placeholder="请输入" v-model="info.idCard" :disabled="disabled" />
				</view>
			</view>
			<view class="item">
				<view class="label">备注：</view>
				<view class="input-text">
					<input type="text" placeholder="请输入" v-model="info.remark" :disabled="disabled" />
				</view>
			</view>
		</view>
		<view class="footerBtn" v-if="!disabled">
			<button size="mini" type="warn" @click="submit">提交</button>
		</view>
	</view>
</template>

<script>
	import addDispatcher from './addDispatcher.js'
	export default addDispatcher
</script>

<style lang="scss">
.addDispatcherPage{
	.labelLength{
		.item{
			.label{
				width: 190rpx;
			}
		}
	}
}
</style>