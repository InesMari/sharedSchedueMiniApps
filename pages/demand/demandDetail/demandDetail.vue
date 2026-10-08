<template>
	<view class="demandDetailPage">
		<uni-steps v-if="info.orderState != 8" :options="stepList" :active="info.orderState" />
		<view class="timeout" v-if="info.orderState == 8">
			已超时
		</view>
		<uni-section title="需求信息:" type="line"></uni-section>
		<view class="formList mb_20">
			<view class="item">
				<view class="label">需求单号：</view>
				<view class="input-text">{{info.orderNum}}</view>
			</view>
			<view class="item">
				<view class="label">报价车型：</view>
				<view class="input-text">{{info.quoteVehicleTypeName}}</view>
			</view>
			<view class="item">
				<view class="label">车长：</view>
				<view class="input-text">{{info.vehicleLengthName}}</view>
			</view>
			<view class="item">
				<view class="label">截止时间：</view>
				<view class="input-text">{{info.expireDate}}</view>
			</view>
			<view class="item">
				<view class="label">车次：</view>
				<view class="input-text">{{info.times}}</view>
			</view>
			<view class="item">
				<view class="label">载重：</view>
				<view class="input-text">{{info.weight}}</view>
			</view>
			<view class="item">
				<view class="label">体积：</view>
				<view class="input-text">{{info.volume}}</view>
			</view>
			<template v-for="(item,index) in info.dtls" :key="index">
				<view class="item">
					<view class="label">{{(index == info.dtls.length-1) ? '终点' : (index==0?'起点':('中途点'+index))}}：</view>
					<view class="input-text">{{item.address}}</view>
				</view>
				<view class="item">
					<view class="label">到达时间：</view>
					<view class="input-text">{{item.workDate}}</view>
				</view>
			</template>
		</view>

		<uni-section title="里程信息:" type="line"></uni-section>
		<uni-table border stripe emptyText="暂无更多数据">
			<!-- 表头行 -->
			<uni-tr>
				<uni-th align="center">预估运输距离</uni-th>
				<uni-th align="center">预估运输时间</uni-th>
			</uni-tr>
			<!-- 表格数据行 -->
			<uni-tr>
				<uni-td align="center">{{info.predictDistance}}</uni-td>
				<uni-td align="center">{{info.predictTimeStr}}</uni-td>
			</uni-tr>
		</uni-table>

		<uni-section class="mt_20" title="作业要求:" type="line"></uni-section>
		<view class="formList mb_20">
			<view class="item">
				<view class="input-text">
					<textarea style="height: 150rpx;" placeholder="请输入" :disabled="true" v-model="info.workRemark" />
				</view>
			</view>
		</view>

		<!-- 报价中 -->
		<uni-section class="mt_20" title="报价明细:" type="line"></uni-section>
		<uni-table border stripe emptyText="暂无更多数据">
			<!-- 表头行 -->
			<uni-tr>
				<uni-th width="40" align="center" v-if="canQuotation"></uni-th>
				<uni-th width="80" align="center">报价状态</uni-th>
				<uni-th width="80" align="center">报价单价</uni-th>
				<uni-th width="100" align="center">调度人姓名</uni-th>
				<uni-th width="100" align="center">调度人手机</uni-th>
				<!-- <uni-th width="100" align="center">报价车型</uni-th>
				<uni-th width="100" align="center">车长</uni-th> -->
			</uni-tr>
			<!-- 表格数据行 -->
			<uni-tr v-for="item in info.dispatchList">
				<uni-td align="center" v-if="canQuotation">
					<uni-data-checkbox multiple v-model="item.isselect" :localdata="emptyCheckbox"
						@change="dataSelect(item)"></uni-data-checkbox>
				</uni-td>
				<uni-td align="center">{{item.stsName}}</uni-td>
				<uni-td align="center">{{item.feePrice}}</uni-td>
				<uni-td align="center">{{item.createUserName}}</uni-td>
				<uni-td align="center">{{item.createBillId}}</uni-td>
				<!-- <uni-td align="center">{{item.quoteVehicleTypeName}}</uni-td>
				<uni-td align="center">{{item.vehicleLengthName}}</uni-td> -->
			</uni-tr>
		</uni-table>
		<view class="footerBtn" v-if="canQuotation && entitys[20008]">
			<button size="mini" type="primary" @click="sureBid">中标确认</button>
		</view>
		<!-- 中标确认 -->
		<view class="mypopup-content" v-if="showBidSure">
			<view class="tip-title">
				中标确认
			</view>
			<view class="formList mb_20">
				<view class="item">
					<view class="label">需求单号：</view>
					<view class="input-text">{{info.orderNum}}</view>
				</view>
				<!-- <view class="item">
					<view class="label">需求车型：</view>
					<view class="input-text">{{info.quoteVehicleTypeName}}</view>
				</view>
				<view class="item">
					<view class="label">需求车长：</view>
					<view class="input-text">{{info.vehicleLengthName}}</view>
				</view> -->
			</view>
			<uni-section class="mt_20" title="调度信息:" type="line"></uni-section>
			<view class="table-view">
				<uni-table border stripe v-for="item in selectDispatchData">
					<uni-tr>
						<uni-td align="center">调度人：</uni-td>
						<uni-td align="center">{{item.createUserName}}</uni-td>
					</uni-tr>
					<uni-tr>
						<uni-td align="center">中标单价：</uni-td>
						<uni-td align="center">{{item.feePrice}}</uni-td>
					</uni-tr>
					<uni-tr>
						<uni-td align="center">车次：</uni-td>
						<uni-td align="center">
							<input type="text" placeholder="请输入" v-model="item.selTimes" />
						</uni-td>
					</uni-tr>
				</uni-table>
			</view>
			<view class="footerBtn">
				<button size="mini" type="default" @click="cancelBid">取消</button>
				<button size="mini" type="primary" @click="submitBid">提交</button>
			</view>
		</view>

		<!-- 评标中 -->
		<view class="biding-view" v-if="info.dispatchDtlList && info.dispatchDtlList.length>0">
			<uni-section class="mt_20" title="中标上传的资料:" type="line"></uni-section>
			<view class="formList mb_20" v-for="item in info.dispatchDtlList">
				<view class="item">
					<view class="label">中标调度人：</view>
					<view class="input-text">{{item.createUserName}}</view>
				</view>
				<view class="item">
					<view class="label">车辆信息：</view>
					<!-- <view class="input-text">{{item.plateNumber}} | {{item.quoteVehicleTypeName}} |
						{{item.vehicleLengthName}}
					</view> -->
					<view class="input-text">{{item.plateNumber}}</view>
				</view>
				<view class="item">
					<view class="label">司机姓名：</view>
					<view class="input-text">{{item.driverName}}</view>
				</view>
				<view class="item">
					<view class="label">司机手机号：</view>
					<view class="input-text">{{item.driverPhone}}</view>
				</view>
				<view class="item">
					<view class="label">行驶证正副页：</view>
					<view class="input-text">
						<uni-file-picker v-model="item.vehicleLicense" fileMediatype="image" mode="grid"
							@select="selectBack" :readonly="true" />
					</view>
				</view>
				<view class="item">
					<view class="label">驾驶证正副页：</view>
					<view class="input-text">
						<uni-file-picker v-model="item.driverLicense" fileMediatype="image" mode="grid"
							@select="selectBack" :readonly="true" />
					</view>
				</view>

				<view class="btns-view" v-if="item.sts == 0 && info.orderState != 9">
					<button size="mini" type="warn" @click="infoError(item.orderDispatchDtlId,item.orderDispatchId)"
						v-if="entitys[20009]">资料异常</button>
					<button size="mini" type="primary" @click="infoSure(item.orderDispatchDtlId,item.orderDispatchId)"
						v-if="entitys[20010]">资料确认</button>
				</view>

			</view>
		</view>

		<uni-popup class="infoErrorPopup" ref="infoErrorPopup" type="dialog">
			<uni-popup-dialog title="资料异常提示" type="warn" cancelText="取消" confirmText="提交" @close="closeInfoErrorPopup"
				@confirm="submitInfoError">
				<view class="dialog-content">
					<textarea placeholder="请输入异常原因" v-model="errorMsg"></textarea>
					<view class="error-tip red">
						资料异常，提交后此需求状态变回竞价中！
					</view>
				</view>
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import demandDetail from './demandDetail.js'
	export default demandDetail
</script>

<style lang="scss">
	.demandDetailPage {
		padding-bottom: 130rpx;

		.timeout {
			border: 4rpx solid red;
			border-radius: 12rpx;
			position: absolute;
			top: 150rpx;
			right: 50rpx;
			color: red;
			font-size: 30rpx;
			padding: 20rpx;
			z-index: 9;
			font-weight: bold;
			transform: rotate(30deg);
		}

		.uni-section {
			margin-top: 20rpx;
		}

		.uni-steps {
			background-color: #fff;
			padding: 30rpx 0;
		}

		.uni-table {
			min-width: initial !important;
			table-layout: fixed;
		}

		.uni-table-th {
			color: #333;
			background-color: #f9f9f9;
		}

		.work-tips {
			background-color: #fff;
			padding: 20rpx;

			view {
				line-height: 40rpx;
			}
		}

		.mypopup-content {
			position: fixed;
			width: 100%;
			height: 100%;
			top: 0;
			bottom: 0;
			background: #fff;
			z-index: 99999;
			box-sizing: border-box;
			padding-bottom: 130rpx;
			overflow: auto;

			.tip-title {
				text-align: center;
				font-size: 30rpx;
				font-weight: bold;
				line-height: 100rpx;
			}

			.table-view {
				padding: 0 20rpx;
			}

			.uni-table-scroll {
				margin-bottom: 30rpx;
			}
		}

		.biding-view {
			.formList {
				.item {
					.label {
						width: 200rpx;
					}
				}
			}

			.btns-view {
				display: flex;
				padding: 20rpx;
				align-items: center;
				justify-content: center;

				button {
					margin: 0 5%;
				}
			}
		}

		.infoErrorPopup {
			.error-tip {
				font-size: 26rpx;
				margin-top: 20rpx;
				font-weight: bold;
			}

			textarea {
				color: #333;
				border: 1rpx solid $uni-border-color;
				width: 100%;
				height: 150rpx;
				padding: 20rpx;
				box-sizing: border-box;
			}
		}
	}
</style>