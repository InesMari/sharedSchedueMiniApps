<template>
	<view class="dispatcherManagePage">
		<view class="search-view">
			<view class="search">
				<input class="input-text" type="text" v-model="searchKey" placeholder="请输入关键字进行模糊搜索"></input>
				<view class="query" @click="doQuery(true)">
					<uni-icons type="search"></uni-icons>
				</view>
			</view>
		</view>
		<image mode="widthFix" v-if="isRefresh" class="loading-icon" src="/static/images/loading.gif"></image>
		<scroll-view class="scorll" scroll-y="{{true}}" @scrolltoupper="toupper" upper-threshold="1"
			@scrolltolower="scrolltolowerHandler">
			<view class="dispatcherList">
				<view class="item" v-for="(item,index) in dispatcherList" :key="index" @click="toDetail(item)">
					<view class="icon-view">
						<uni-icons type="person"></uni-icons>
					</view>
					<view class="info">
						<view class="name">
							{{item.userName}}
						</view>
						<view class="remark">
							{{item.remark}}
						</view>
					</view>
					<view class="btn-view" v-if="entitys[20016]">
						<button size="mini" v-if="item.enable == 1" type="warn"
							@click.stop="disabledUser(item)">禁用</button>
						<button size="mini" v-if="item.enable == 0" type="primary"
							@click.stop="disabledUser(item)">启用</button>
					</view>
				</view>
			</view>
		</scroll-view>

		<view class="footerBtn" v-if="entitys[20013]">
			<button size="mini" type="warn" @click="addDispatcher">新增员工</button>
			<button size="mini" type="primary" @click="addBindUser">新增关联合作</button>
		</view>

		<uni-popup ref="inputDialog" type="dialog">
			<uni-popup-dialog mode="input" title="关联合作" placeholder="请输入关联合作商手机号"
				@confirm="dialogInputConfirm"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import dispatcherManage from './dispatcherManage.js'
	export default dispatcherManage
</script>

<style lang="scss">
	.dispatcherManagePage {
		padding-bottom: 130rpx;
		height: 100%;
		box-sizing: border-box;

		.scorll {
			height: calc(100% - 100rpx);
		}

		.v-tabs__container-item {
			flex: 1 !important;
			justify-content: center !important;
		}

		.search-view {
			background-color: #fff;
			padding: 20rpx;

			.search {
				display: flex;
				border: 1rpx solid $uni-color-primary;
				border-radius: 10rpx;
				align-items: center;
				overflow: hidden;

				.input-text {
					flex: 1;
					padding: 0 20rpx;
				}

				button {
					border-radius: 0;
				}

				:deep .query {
					background-color: $uni-color-primary;
					height: 58rpx;
					width: 75rpx;
					display: flex;
					align-items: center;
					justify-content: center;

					.uni-icons {
						color: #fff !important;
					}
				}
			}
		}

		.dispatcherList {
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