<template>
	<view class="roleMemberPage">
		<uni-section :title="'所属角色：'+info.roleName" type="line"></uni-section>
		<uni-section title="成员列表:" type="line">
			<uni-data-checkbox v-model="allselect" :localdata="selectData" mode="button"
				@change="filterCheck"></uni-data-checkbox>
		</uni-section>
		<view class="userList">
			<label class="userItem" v-for="item in userList" :key="item.userId" @click="checkChange(item)">
				<checkbox :checked="item.issel" />
				<text>{{item.userName}} {{item.billId}}</text>
			</label>
		</view>
		<view class="footerBtn">
			<button size="mini" type="warn" @click="submit">提交</button>
		</view>
	</view>
</template>

<script>
	import roleMember from './roleMember.js'
	export default roleMember
</script>

<style lang="scss">
	.roleMemberPage {
		.uni-section{
			position: relative;
			.uni-section-content{
				position: absolute;
				right: 20rpx;
				top: 0;
			}
		}
		.userList {
			border-top: 1rpx solid $uni-border-color;
		}

		.userItem {
			background: #fff;
			padding: 20rpx;
			border-bottom: 1rpx solid $uni-border-color;
			display: block;
		}
	}
</style>