<template>
	<view class="homePage">
		<image src="/static/images/banner.png" class="banner" mode="widthFix"></image>
		<view class="search-view">
			<view class="search">
				<input class="input-text" type="text" v-model="searchStr" placeholder="请输入省或市的名称"></input>
				<view class="query" @click="toQuery">
					<uni-icons type="search"></uni-icons>
				</view>
				<button size="mini" type="primary" @click="searchMore">更多筛选</button>
			</view>
		</view>
		<image mode="widthFix" v-if="isRefresh" class="loading-icon" src="/static/images/loading.gif"></image>
		<scroll-view class="scorll" scroll-y="{{true}}" @scrolltoupper="toupper" upper-threshold="1"
			@scrolltolower="scrolltolowerHandler">
			<view class="list">
				<view class="item" v-for="item in demandList" @click="toDetail(item)">
					<view class="effectiveTime" v-if="item.countdownStr">
						{{item.countdownStr}}
					</view>
					<view class="item-info">
						<view class="site-info">
							<view class="site">
								{{item.beginProvName}} {{item.beginCityName}}
							</view>
							<view class="time">
								{{item.beginWorkDate}}
							</view>
						</view>
						<view class="process">
							<view class="distance">
								{{item.predictDistance}}KM
							</view>
							<view class="arrow">
								<uni-icons type="right"></uni-icons>
							</view>
							<view class="hours">
								{{item.predictTime}}小时
							</view>
						</view>
						<view class="site-info">
							<view class="site">
								{{item.endProvName}} {{item.endCityName}}
							</view>
							<view class="time">
								{{item.endWorkDate}}
							</view>
						</view>
					</view>
					<view class="info-tag clearfix">
						<view class="tag-item">
							{{item.quoteVehicleTypeName}}{{item.vehicleLengthName}}
						</view>
						<view class="tag-item">
							{{item.weight}}吨，{{item.volume}}m³
						</view>
					</view>
					<view class="footer clearfix">
						<view class="tip">
							{{item.tips}}
						</view>
					</view>
				</view>

			</view>
		</scroll-view>
		<view class="footerBtn btns">
			<button size="mini" type="default" @click="issueDemand">发布需求</button>
			<template v-if="!userInfo">
				<button size="mini" type="warn" @click="toLogin">去登录</button>
			</template>
			<template v-else>
				<button size="mini" type="primary" v-if="userInfo.authState===0" @click="toAuth">去认证</button>
				<button size="mini" type="primary" :disabled="true" v-if="userInfo.authState!=0">认证中</button>
				<button size="mini" type="warn" @click="toLogout">退出登录</button>
			</template>
		</view>
		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog title="登录提示" type="warn" cancelText="取消" confirmText="去登录" @close="closePopup"
				@confirm="toLogin">
				<view class="dialog-content">
					<view>您现在的操作需要登录,</view>
					<view style="text-align: center;margin-top: 10rpx;">是否去登录？</view>
				</view>
			</uni-popup-dialog>
		</uni-popup>
		<uni-drawer ref="drawer" mode="right" class="drawerFilter">
			<scroll-view class="scroll-view" scroll-y="true">
				<view class="search-item">
					<view class="label">起点：</view>
					<view class="input-text">
						<input type="text" placeholder="请输入" v-model="beginIndexSearchStr" />
					</view>
				</view>
				<view class="search-item">
					<view class="label">终点：</view>
					<view class="input-text">
						<input type="text" placeholder="请输入" v-model="endIndexSearchStr" />
					</view>
				</view>
				<view class="search-item">
					<view class="label">车型：</view>
					<view class="input-text">
						<uni-data-checkbox mode="tag" multiple v-model="quoteVehicleType"
							:localdata="quoteVehicleTypeList"></uni-data-checkbox>
					</view>
				</view>
				<view class="search-item">
					<view class="label">车长：</view>
					<view class="input-text">
						<uni-data-checkbox mode="tag" multiple v-model="vehicleLength"
							:localdata="vehicleLengthList"></uni-data-checkbox>
					</view>
				</view>
			</scroll-view>
			<view class="op-btn">
				<button size="mini" type="warn" @click="clearFilter">清空</button>
				<button size="mini" type="primary" @click="sureFilter">筛选</button>
			</view>
		</uni-drawer>
	</view>
</template>

<script>
	import homeNoLogin from './homeNoLogin.js'
	export default homeNoLogin
</script>

<style lang="scss" scoped>
	.homePage {
		padding-bottom: 130rpx;
		height: 100%;
		box-sizing: border-box;

		.scorll {
			height: calc(100% - 300rpx);
		}
	}

	.banner {
		width: 100%;
	}

	.search-view {
		background-color: #fff;
		padding: 20rpx;
	}

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
			height: 58rpx;	
			border-left: 1rpx solid #fff;
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

	.contain {
		overflow: hidden;
		padding: 24rpx 30rpx;
		margin: 30rpx;
		background: #fff;
	}

	.list {
		margin: 20rpx;

		.item {
			border-radius: 10rpx;
			margin-bottom: 20rpx;
			border-radius: 10rpx;
			background-color: #fff;

			.effectiveTime {
				padding: 20rpx;
				font-size: 24rpx;
				line-height: 40rpx;

				.state {
					float: right;
					line-height: 40rpx;
					font-size: 24rpx;
					font-weight: bold;

					&.state-on {
						color: $uni-color-success;
					}

					&.state-end {
						color: $uni-color-warning;
					}

					&.state-off {
						color: #999;
					}
				}
			}

			.item-info {
				padding: 20rpx;
				border-top: 1rpx solid $uni-border-color;
				display: flex;

				.site-info {
					padding: 10rpx 0;
					flex: 1;

					.site {
						font-size: 30rpx;
						font-weight: bold;
						text-align: center;
						margin-bottom: 20rpx;
					}

					.time {
						font-size: 24rpx;
						text-align: center;
					}
				}

				:deep .process {
					width: 150rpx;
					text-align: center;

					.arrow {
						height: 36rpx;
						position: relative;

						&:after {
							content: "";
							position: absolute;
							left: 0;
							top: 50%;
							height: 4rpx;
							width: 100%;
							background-color: #333;
							margin-top: -4rpx;
						}

						.uni-icons {
							font-size: 36rpx;
							position: absolute;
							right: -14rpx;
						}
					}
				}
			}

			.info-tag {
				padding: 0 20rpx;

				.tag-item {
					float: left;
					font-size: 20rpx;
					padding: 8rpx 15rpx;
					border-radius: 6rpx;
					background-color: $uni-color-primary;
					margin-right: 20rpx;
					color: #fff;

					&:nth-child(2) {
						background-color: $uni-color-success;
					}

					&:nth-child(3) {
						background-color: $uni-color-warning;
					}
				}
			}

			.footer {
				padding: 10rpx 20rpx;
				border-top: 1rpx solid #eee;
				margin-top: 20rpx;

				.tip {
					float: left;
					line-height: 54rpx;
					font-size: 24rpx;
					color: #999;
				}

				button {
					font-size: 24rpx;
				}

				.btns-view {
					float: right;

					button {
						margin-left: 20rpx;
					}
				}
			}
		}
	}
</style>