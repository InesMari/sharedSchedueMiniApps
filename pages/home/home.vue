<template>
	<view class="homePage">
		<view class="demandList" v-show="navActive == 1">
			<v-tabs v-model="currentTabs" field="name" :tabs="tabs" height="90rpx" line-height="5rpx"
				@change="changeTab"></v-tabs>
			<view class="search-view">
				<view class="search">
					<input class="input-text" v-model="searchStr" type="text" placeholder="请输入省或市的名称"></input>
					<view class="query" @click="toQuery">
						<uni-icons type="search"></uni-icons>
					</view>
					<button size="mini" type="primary" @click="searchMore">更多筛选</button>
				</view>
			</view>
			<image mode="widthFix" v-if="isRefresh" class="loading-icon" src="/static/images/loading.gif"></image>
			<scroll-view class="scorll" scroll-y="{{true}}" @scrolltoupper="toupper" upper-threshold="1">
				<view class="list">
					<view class="item" v-for="(item,index) in demandList" :key="index" @click="toDetail(item)">
						<view class="effectiveTime">
							需求单号：{{item.orderNum}}
							<view class="state state-end">
								{{item.orderStateName}}
							</view>
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
							<view class="tag-item">
								距你{{item.distance}}KM
							</view>
						</view>
						<view class="footer clearfix">
							<view class="tip">
								{{item.countdownStr}}
							</view>
							<view class="btns-view" v-if="item.orderState < 3">
								<button size="mini" type="primary" @click.stop="toEdit(item)" v-if="entitys[20005]">修改</button>
								<button size="mini" type="warn" @click.stop="delDemand(item)" v-if="entitys[20006]">删除</button>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="message-list" v-show="navActive == 3">
			<!-- 消息列表循环 -->
			<view v-for="message in messageList" :key="message.id" class="message-item unread"
				@click="toOrder(message)">
				<uni-icons type="notification-filled"></uni-icons>
				<view class="message-content">
					<!-- 标题 -->
					<view class="title">{{ message.orderNum }}</view>
					<!-- 内容 -->
					<view class="content">{{ message.todoStateName }}</view>
				</view>
				<!-- 时间 -->
				<text class="time">{{ message.createDate }}</text>
			</view>
		</view>

		<!-- 我的 -->
		<view class="presonal" v-show="navActive == 4">
			<view class="headInfo">
				<image class="bg" src="/static/images/info_bg.png"></image>
				<view class="userInfo">
					<view class="name">{{formInfo.info.name}}</view>
					<view class="phone">{{formInfo.info.linkPhone}}</view>
				</view>
				<!-- <view class="workName">
					<uni-icons type="tune"></uni-icons>
					切换至调度员
				</view> -->
				<view class="exit-view">					
					<image src="/static/images/exit2.png" class="exit" @click="toLogout" mode="widthFix"></image>
				</view>
			</view>

			<view class="formList">
				<view class="item">
					<view class="label">简称：</view>
					<view class="input-text">
						{{formInfo.info.abbreviationName}}
					</view>
				</view>
				<view class="item">
					<view class="label">公司地址：</view>
					<view class="input-text">
						{{formInfo.info.address}}
					</view>
				</view>
				<view class="item">
					<view class="label">联系人：</view>
					<view class="input-text">
						{{formInfo.info.linkman}}
					</view>
				</view>
				<view class="item">
					<view class="label">营业执照：</view>
					<view class="input-text">
						<uni-file-picker v-if="formInfo.info.businessLicenseImgUrl"
							v-model="formInfo.businessLicenseImgUrls" fileMediatype="image" mode="grid"
							:readonly="true" />
						<text v-else>未上传</text>
					</view>
				</view>
			</view>

			<view class="linkList">
				<view class="item" @click="toDispatcher" v-if="entitys[20011]">
					<view class="title">员工管理</view>
					<view class="notes">员工新增/修改</view>
					<uni-icons type="right"></uni-icons>
				</view>
				<view class="item" @click="toRole" v-if="entitys[20012]">
					<view class="title">角色管理</view>
					<view class="notes">角色权限分配</view>
					<uni-icons type="right"></uni-icons>
				</view>
				<view class="item" @click="toChangePassword">
					<view class="title">修改密码</view>
					<view class="notes">修改用户登录密码</view>
					<uni-icons type="right"></uni-icons>
				</view>
			</view>
		</view>
		<!-- nav -->
		<view class="navList">
			<view class="item" :class="navActive == 1?'active':''" @click="changeNav(1)" v-if="entitys[20001]">
				<uni-icons type="list"></uni-icons>
				<view class="name">
					管理
				</view>
			</view>
			<view class="item" @click="addDemand" v-if="entitys[20001] && entitys[20004]">
				<uni-icons type="plus"></uni-icons>
				<view class="name">
					新增
				</view>
			</view>
			<view class="item" :class="navActive == 3?'active':''" @click="changeNav(3)" v-if="entitys[20002]">
				<uni-badge class="uni-badge-left-margin" :text="todoSum" absolute="rightTop" size="small">
					<uni-icons type="chatbubble"></uni-icons>
				</uni-badge>
				<view class="name">
					消息
				</view>
			</view>
			<view class="item" :class="navActive == 4?'active':''" @click="changeNav(4)" v-if="entitys[20003]">
				<uni-icons type="person"></uni-icons>
				<view class="name">
					我的
				</view>
			</view>
		</view>
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
	import home from './home.js'
	export default home
</script>

<style lang="scss" scoped>
	.homePage {
		height: 100%;

		.demandList {
			padding-bottom: 130rpx;
			height: 100%;
			box-sizing: border-box;

			.scorll {
				height: calc(100% - 200rpx);
			}
		}
	}

	.contain {
		overflow: hidden;
		padding: 24rpx 30rpx;
		margin: 30rpx;
		background: #fff;
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

	.search-view {
		background-color: #fff;
		padding: 20rpx;
	}

	.navList {
		background: #fff;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		display: flex;
		padding: 20rpx;
		box-sizing: border-box;
		border-top: 1rpx solid $uni-border-color;

		:deep .item {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			.uni-icons {
				font-size: 44rpx !important;
			}

			.name {
				margin-top: 10rpx;
				font-size: 26rpx;
			}

			&.active {
				.uni-icons {
					color: $uni-color-primary !important;
				}

				.name {
					color: $uni-color-primary;
				}
			}
		}

		:deep .addDemand {
			width: 80rpx;
			position: relative;
			margin: 0 4%;

			.uni-icons {
				position: absolute;
				font-size: 80rpx !important;
				top: -40rpx;
				left: 0;
			}
		}
	}

	.message-list {
		padding: 10px;

		:deep .message-item {
			position: relative;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 20rpx;
			background-color: #fff;
			border-radius: 10rpx;
			margin-bottom: 20rpx;

			.uni-icons {
				font-size: 40rpx !important;
				color: #999 !important;
			}

			.message-content {
				margin-left: 20rpx;
				flex: 1;

				.title {
					font-weight: bold;
					color: #999;
				}

				.content {
					color: #999;
					font-size: 28rpx;
					margin-top: 20rpx;
				}

			}


			.time {
				color: #999;
				font-size: 12px;
			}

			&.unread {
				.uni-icons {
					color: $uni-color-error !important;
				}

				.title {
					color: #333;
				}

				.content {
					color: #666;
				}
			}

		}

	}

	.presonal {
		padding: 20rpx;

		:deep .headInfo {
			width: 100%;
			position: relative;

			.bg {
				width: 100%;
				height: 137rpx;
			}

			.userInfo {
				position: absolute;
				padding: 24rpx 30rpx;
				top: 0;
				left: 0;
				z-index: 9;

				.name {
					font-size: 30rpx;
					line-height: 1;
					margin-bottom: 30rpx;
					color: #fff;
				}

				.phone {
					font-size: 28rpx;
					line-height: 1;
					color: #fff;
				}

				.back {
					width: 40rpx;
				}
			}

			.workName {
				position: absolute;
				top: 24rpx;
				right: 26rpx;
				z-index: 9;
				color: #fff;
				display: flex;
				align-items: center;

				.uni-icons {
					margin-right: 10rpx;
					color: #fff !important;
				}
			}
			
			.exit-view{
				position: absolute;
				bottom: 23rpx;
				right: 26rpx;
				z-index: 99;
				
			}
			.exit {
				width: 35rpx;
			}
		}

		.formList {
			margin-top: 20rpx;
			border-radius: 10rpx;

			.item .label {
				width: 140rpx;
			}
		}

		:deep .linkList {
			background-color: #fff;
			margin-top: 20rpx;
			border-radius: 10rpx;

			.item {
				border-bottom: 1rpx solid $uni-border-color;
				padding: 25rpx 20rpx;
				position: relative;

				.title {
					font-size: 28rpx;
				}

				.notes {
					font-size: 24rpx;
					margin-top: 20rpx;
					color: #999;
				}

				.uni-icons {
					position: absolute;
					right: 20rpx;
					top: 50%;
					transform: translateY(-50%);
					color: #666 !important;
				}
			}
		}
	}
</style>