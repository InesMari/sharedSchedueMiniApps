<template>
	<view class="roleManagePage">
		<image mode="widthFix" v-if="isRefresh" class="loading-icon" src="/static/images/loading.gif"></image>
		<scroll-view class="scorll" scroll-y="{{true}}" @scrolltoupper="toupper" upper-threshold="1"
			@scrolltolower="scrolltolowerHandler">
			<view class="roleList">
				<view class="item" v-for="item in roleList" @click="addrole(item)">
					<view class="icon-view">
						<uni-icons type="person"></uni-icons>
					</view>
					<view class="info">
						<view class="name">
							{{item.roleName}}
						</view>
						<view class="remark">
							{{item.roleDescribe}}
						</view>
					</view>
					<view class="btn-view">
						<button size="mini" type="default" @click.stop="toRoleMember(item)" v-if="entitys[20021]">成员</button>
						<button size="mini" type="primary" v-if="item.adminRoleId!=item.roleId && entitys[20022]"
							@click.stop="addrole(item)">权限</button>
						<button size="mini" type="warn" v-if="item.adminRoleId!=item.roleId && entitys[20020]"
							@click.stop="delRole(item)">删除</button>
					</view>
				</view>
			</view>
		</scroll-view>

		<view class="footerBtn" v-if="entitys[20018]">
			<button size="mini" type="primary" @click="addrole">添加角色</button>
		</view>
	</view>
</template>

<script>
	import roleManage from './roleManage.js'
	export default roleManage
</script>

<style lang="scss">
	.roleManagePage {
		padding-bottom: 130rpx;
		height: 100%;
		box-sizing: border-box;

		.scorll {
			height: 100%;
		}

		.roleList {
			padding: 20rpx;

			.item {
				background-color: #fff;
				border-radius: 10rpx;
				padding: 30rpx;
				display: flex;
				margin-bottom: 20rpx;
				position: relative;

				.uni-icons {
					font-size: 80rpx !important;
					margin-right: 20rpx;
				}

				.info {
					flex: 1;

					.name {}

					.remark {
						font-size: 24rpx;
						margin-top: 20rpx;
						color: #666;
					}
				}

				.btn-view {
					display: flex;
					align-items: center;

					button {
						margin-left: 10rpx;
						width: 100rpx;
						font-size: 24rpx;
						padding: 0;
					}

					button[type=default] {
						background-color: $uni-color-primary;
						color: #fff;
					}
				}

				.state {
					font-weight: bold;
					color: $uni-color-success;
					font-size: 24rpx;
					position: absolute;
					right: 180rpx;
					top: 47rpx;
					padding: 10rpx;
					border: 2rpx solid $uni-color-success;
					border-radius: 10rpx;
				}

			}
		}
	}
</style>