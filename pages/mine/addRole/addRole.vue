<template>
	<view class="addRolePage">
		<view class="formList">
			<view class="item">
				<view class="label">角色名称：</view>
				<view class="input-text">
					<input type="text" placeholder="请输入角色名称" v-model="info.roleName" />
				</view>
			</view>
			<view class="item">
				<view class="label">角色描述：</view>
				<view class="input-text">
					<input type="text" placeholder="请输入角色描述" v-model="info.roleDescribe" />
				</view>
			</view>
		</view>
		<uni-section title="权限配置信息" type="line">
			<uni-data-checkbox v-model="allselect" :localdata="selectData" mode="button" v-if="!disabled"
				@change="filterCheck"></uni-data-checkbox>
		</uni-section>
		<view class="tree">
			<view class="item tree-item" v-for="item in treeData" :key="item.id">
				<checkbox class="fill-checkbox" :checked="item.issel" @click="checkChange(item)" :disabled="disabled" />
				<text>{{item.entityName}}</text>
				<template v-if="item.hasChildren">
					<view class="item innerItem" v-for="innerItem in item.children" :key="innerItem.id">
						<checkbox class="fill-checkbox" :checked="innerItem.issel" @click="checkChange(innerItem)" :disabled="disabled" />
						<text>{{innerItem.entityName}}</text>
						<view class="lastView" v-if="innerItem.hasChildren">
							<view class="item lastItem" v-for="lastItem in innerItem.children" :key="lastItem.id">
								<checkbox class="fill-checkbox" :checked="lastItem.issel" @click="checkChange(lastItem)"
									:disabled="disabled" />
								<text>{{lastItem.entityName}}</text>
							</view>
						</view>
					</view>
				</template>
			</view>
		</view>

		<view class="footerBtn" v-if="!disabled">
			<button size="mini" type="primary" @click="submit">保存设置</button>
		</view>
	</view>
</template>

<script>
	import addRole from './addRole.js'
	export default addRole
</script>

<style lang="scss">
	.addRolePage {
		padding-bottom: 130rpx;

		.uni-section {
			position: relative;

			.uni-section-content {
				position: absolute;
				right: 20rpx;
				top: 0;
			}
		}

		.tree {
			padding: 20rpx;
			background-color: #fff;

			.item {
				line-height: 80rpx;
			}

			.tree-item {
				.innerItem {
					padding-left: 40rpx;

					.lastView {
						padding-left: 20rpx;
					}

					.lastItem {
						display: inline-block;
						padding-left: 20rpx;
					}
				}
			}
		}

		/* 自定义多选框的样式 */
		.fill-checkbox .wx-checkbox-input {
			width: 24rpx;
			/* 设置选择框的宽度 */
			height: 24rpx;
			/* 设置选择框的高度 */
			border-radius: 4rpx;
			/* 可选：设置边框圆角 */
			border: 2rpx solid #ccc;
			/* 可选：设置边框颜色和宽度 */
		}

		/* 设置选中后的样式 */
		.fill-checkbox .wx-checkbox-input.wx-checkbox-input-checked {
			background-color: #0080FF;
			/* 设置选中后的背景颜色 */
			border-color: #0080FF;
			/* 可选：设置选中后的边框颜色，如果与背景颜色相同可省略 */
		}

		/* 可选：设置选中后的对勾样式（如果需要的话） */
		/* 注意：微信小程序默认不提供对勾图标，这里只是示例如何自定义样式 */
		.fill-checkbox .wx-checkbox-input.wx-checkbox-input-checked::before {
			content: '✔';
			/* 自定义对勾图标 */
			font-size: 26rpx;
			/* 设置对勾图标的大小 */
			color: #fff;
			/* 设置对勾图标的颜色 */
			display: block;
			/* 确保对勾图标显示 */
			text-align: center;
			/* 对齐对勾图标 */
			margin-top: -2rpx;
		}
	}
</style>