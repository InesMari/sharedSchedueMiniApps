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
			roleList: [],
			isRefresh: false,
		})
		onShow(() => {
			doQuery(true)
		})
		let staticData = {};

		// 查询列表
		async function doQuery(clear) {
			if (clear) { //clear为true的时候清空页码
				staticData.page = 1
			}
			let {
				items,
				hasNext
			} = await util.postByBeanName('roleTF', 'queryRolePageForWLGS', {
				page: staticData.page
			});
			if (clear) { //clean为true的时候清空数组(请求后操作，避免出现阶段性页面空白)
				bindData.roleList = [];
			}
			staticData.hasNext = hasNext;
			bindData.isRefresh = false;
			bindData.roleList = [...bindData.roleList, ...items];
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
		// 查看成员
		function toRoleMember(item) {
			uni.navigateTo({
				url: `/pages/mine/roleMember/roleMember?roleId=${item.roleId}&roleName=${item.roleName}`
			})
		}
		// 删除角色
		async function delRole(item) {
			let {
				confirm
			} = await uniApi.showModal({
				title: "提示",
				content: `您正在删除角色：${item.roleName},删除操作不可逆，是否继续？`,
				showCancel: true
			})
			if (confirm) {
				await util.postByBeanName('roleTF', 'deleteRole', {
					roleId: item.roleId
				});
				await uniApi.showModal("删除成功")
				doQuery(true)
			}
		}

		// 添加角色
		function addrole(item) {
			uni.navigateTo({
				url: "/pages/mine/addRole/addRole?roleId="+item.roleId
			})
		}
		return {
			...toRefs(bindData),
			scrolltolowerHandler,
			toupper,
			toRoleMember,
			delRole,
			addrole,
		}

	}
};