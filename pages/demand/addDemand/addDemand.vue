<template>
	<view class="addDemandPage">
		<uni-section title="基本信息" type="line"></uni-section>
		<view class="formList mb_20">
			<view class="item">
				<view class="label">报价车型：</view>
				<view class="input-text">
					<zqs-select :multiple="true" :list="quoteVehicleTypeList" label-key="codeName" value-key="codeValue"
						placeholder="选择报价车型" title="选择报价车型" clearable :value="info.quoteVehicleType"
						@search="searchEvent" @change="selectChange"></zqs-select>
				</view>
			</view>
			<view class="item">
				<view class="label">截止时间：</view>
				<view class="input-text">
					<uni-datetime-picker type="datetime" :clear-icon="false" v-model="info.expireDate"
						@maskClick="maskClick" />
				</view>
			</view>
			<view class="item">
				<view class="label">可见范围：</view>
				<view class="input-text">
					<uni-data-checkbox multiple v-model="info.visibleRange"
						:localdata="visibleRange"></uni-data-checkbox>
				</view>
			</view>
			<view class="item">
				<view class="label">车长：</view>
				<view class="input-text">
					<zqs-select :multiple="true" :list="vehicleLengthList" label-key="codeName" value-key="codeValue"
						placeholder="选择车长" title="选择报价车长" clearable :value="info.vehicleLength" @search="searchEvent"
						@change="selectChange"></zqs-select>
				</view>
			</view>
			<view class="item">
				<view class="label">车次：</view>
				<view class="input-text">
					<input type="text" placeholder="请输入车次" v-model="info.times" />
				</view>
			</view>
			<view class="item">
				<view class="label">载重：</view>
				<view class="input-text">
					<input type="number" placeholder="请输入载重，单位吨" v-model="info.weight" />
				</view>
			</view>
			<view class="item">
				<view class="label">体积：</view>
				<view class="input-text">
					<input type="number" placeholder="请输入体积，单位m³" v-model="info.volume" />
				</view>
			</view>
		</view>

		<uni-section title="作业要求" type="line"></uni-section>
		<view class="formList mb_20">
			<view class="item">
				<view class="input-text">
					<textarea style="height: 150rpx;" placeholder="请输入" v-model="info.workRemark" />
				</view>
			</view>
		</view>
		<view class="dtls" v-for="(item,index) in info.dtls" :key="index">
			<uni-section :title="(index == info.dtls.length-1) ? '终点' : (index==0?'起点':('中途点'+index))" type="line">
				<uni-icons class="op-btn add" v-if="index == 0" type="plus-filled" @click="addDtl"></uni-icons>
				<uni-icons class="op-btn del" v-if="index != 0 && index != info.dtls.length-1" type="minus-filled"
					@click="delDtl(index)"></uni-icons>
			</uni-section>
			<view class="formList mb_20">
				<view class="item">
					<view class="input-text" @click="showMap(index)">
						<view class="site">
							<uni-icons type="location"></uni-icons>
							{{item.address?item.address:'请选择地址'}}
						</view>
					</view>
				</view>
				<view class="item">
					<view class="input-text">
						<uni-datetime-picker type="datetime" :clear-icon="false" v-model="item.workDate"
							@maskClick="maskClick" />
					</view>
				</view>
			</view>
		</view>
		<atl-map ref="map" :disable="disable" v-show="isshowMap" :longitude="lng" :latitude="lat" :marker="marker"
			:mapKey="mapKey" :mapType="mapType" @confirm="confirm" :searchName="searchName">
		</atl-map>
		<view class="footerBtn">
			<button size="mini" type="primary" @click="save">保存</button>
		</view>

		<uni-popup ref="popup" type="dialog">
			<uni-popup-dialog title="提示" type="warn" cancelText="取消" :confirmText="popupText.confirmText"
				@close="closePopup" @confirm="toAuth">
				<view class="dialog-content">
					<view>{{popupText.content}}</view>
				</view>
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	import addDemand from './addDemand.js'
	export default addDemand
</script>

<style lang="scss" scoped>
	.addDemandPage {
		padding-bottom: 140rpx;

		:deep .dtls {
			.uni-section {
				position: relative;

				.op-btn {
					position: absolute;
					right: 20rpx;
					top: 16rpx;

					.uni-icons {
						font-size: 45rpx !important;
						color: $uni-color-primary !important;
					}

					&.del {
						.uni-icons {
							color: $uni-color-error !important;
						}
					}
				}
			}
		}
	}

	.formList {
		border-top: 1rpx solid $uni-border-color;

		:deep .item {
			.site {
				display: flex;
			}
			.uni-data-checklist .checklist-group .checklist-box{
				margin-right: 15rpx;
			}

			.input-text {
				color: #666;
			}

			.textarea {}
		}
	}
</style>