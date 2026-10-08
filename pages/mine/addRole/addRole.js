import {
	util,
	uniApi,
	common
} from '/common/commonImport';
import {
	onLoad
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
			info: {},
			treeData: [],
			selectData: [{
				text: '全选',
				value: 1
			}, {
				text: '不选',
				value: 0
			}],
			disabled:false,
		})

		let staticData = {
			adminRoleId: uni.getStorageSync("adminRoleId"),
			entitys: [],
		}
		onLoad(({
			roleId
		}) => {
			doQuery(roleId);
			if (common.isNotBlank(roleId)) {
				queryInfo(roleId)
				bindData.disabled = !bindData.entitys[20019];
			}
		})

		async function doQuery(roleId) {
			bindData.treeData = await util.postByBeanName('entityTF', 'loadEntityTreeForWLGS', {
				adminRoleId: staticData.adminRoleId,
				roleId
			});
			checkSel(bindData.treeData)
		}
		// 递归查询已授权
		function checkSel(data) {
			data.forEach(item => {
				if (item.relId) {
					item.issel = true;
				}
				if (item.hasChildren) {
					checkSel(item.children)
				}
			})
		}
		async function queryInfo(roleId) {
			bindData.info = await util.postByBeanName('roleTF', 'loadRoleInfo', {
				roleId
			});
		}

		function filterCheck(e) {
			let value = e.detail.value;
			selectStateChange(bindData.treeData,value)
		}
		function selectStateChange(data,value) {
			data.forEach(item => {
				item.issel = value==1?true:false;
				if (item.hasChildren) {
					selectStateChange(item.children,value)
				}
			})
		}

		// 获取选中的Id
		function getEntityIds(data) {
			data.forEach(item => {
				if (item.issel) {
					staticData.entitys.push(item.id)
				}
				if (item.hasChildren) {
					getEntityIds(item.children)
				}
			})
		}

		function checkChange(item) {
			item.issel = !item.issel
		}
		async function submit() {
			staticData.entitys = [];
			getEntityIds(bindData.treeData)
			bindData.info.entitys = staticData.entitys;
			let {
				roleName
			} = bindData.info;
			if (common.isBlank(roleName)) {
				await uniApi.showToast("请输入角色名称")
				return
			}
			console.log(bindData.info)
			// return
			await util.postByBeanName('roleTF', 'commonSaveRoleOrEntity', bindData.info);
			await uniApi.showModal("保存成功")
			uni.navigateBack({
				delta: 1,
			})
		}
		return {
			...toRefs(bindData),
			submit,
			checkChange,
			filterCheck,
		}

	}
};