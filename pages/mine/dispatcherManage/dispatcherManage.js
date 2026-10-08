import {
	util,
	uniApi,
	common
} from '/common/commonImport';
import {
	onLoad,
	onShow
} from '@dcloudio/uni-app'
import {
	reactive,
	toRefs,
	ref,
	computed
} from "vue";
export default {
	setup() {
		// 绑定数据
		let bindData = reactive({
			entitys:common.getEntityIds(),
			disabled: false,
			dispatcherList: [],
			isRefresh: false,
			searchKey:"",
		})
		let staticData = {};

		let inputDialog = ref();

		onShow(() => {
			doQuery(true)
		})

		// 查询列表
		async function doQuery(clear) {
			if (clear) { //clear为true的时候清空页码
				staticData.page = 1
			}
			let {
				items,
				hasNext
			} = await util.postByBeanName('userTF', 'queryDispatchUserPageForWechat',{searchKey:bindData.searchKey,page:staticData.page});
			if (clear) { //clean为true的时候清空数组(请求后操作，避免出现阶段性页面空白)
				bindData.dispatcherList = [];
			}
			staticData.hasNext = hasNext;
			bindData.isRefresh = false;
			bindData.dispatcherList = [...bindData.dispatcherList, ...items];
		}

		// 滚动加载
		function scrolltolowerHandler() {
			if (staticData.hasNext) {
				staticData.page++;
				doQuery()
			}
		}
		// 上拉刷新
		function toupper() {
			bindData.isRefresh = true;
			doQuery(true);
		}

		// 切换状态
		async function disabledUser(item) {
			if (item.enable == 0) {
				let {
					confirm
				} = await uniApi.showModal({
					title: "启动提示",
					content: `调度员：${item.userName},当前为禁用状态，是否启用？`,
					showCancel: true
				})
				if (confirm) {
					await util.postByBeanName('userTF', 'enableUserForWLGS', {
						id: item.id,
						enable: 1
					});
					await uniApi.showToast("修改成功")
				}
			}
			if (item.enable == 1) {
				let {
					confirm
				} = await uniApi.showModal({
					title: "禁用提示",
					content: `调度员：${item.userName},当前为启动状态，禁用后将不可进行任何操作，是否继续？`,
					showCancel: true
				})
				if (confirm) {
					await util.postByBeanName('userTF', 'enableUserForWLGS', {
						id: item.id,
						enable: 0
					});
					await uniApi.showToast("修改成功")
				}
			}
			doQuery(true)
		}

		// 新增调度员
		function addDispatcher() {
			uni.navigateTo({
				url: "/pages/mine/addDispatcher/addDispatcher"
			})
		}

		function toDetail(item) {
			uni.navigateTo({
				url: "/pages/mine/addDispatcher/addDispatcher?id=" + item.id
			})
		}

		function addBindUser() {
			inputDialog.value.open();
		}
		async function dialogInputConfirm(val) {
			if (common.isBlank(val)) {
				await uniApi.showToast("请输入手机号")
				return false
			}
			await util.postByBeanName('userTF', 'bindUserForWLGS', {
				billId: val
			});
			await uniApi.showModal("关联成功")
		}
		return {
			...toRefs(bindData),
			doQuery,
			scrolltolowerHandler,
			toupper,
			disabledUser,
			addDispatcher,
			toDetail,
			addBindUser,
			inputDialog,
			dialogInputConfirm,
		}

	}
};