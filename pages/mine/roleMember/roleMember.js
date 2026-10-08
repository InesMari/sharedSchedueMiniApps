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
			info: {},
			userList: [],
			selectData: [{
				text: '全选',
				value: 1
			}, {
				text: '不选',
				value: 0
			}],
		})

		let staticData = {}
		onLoad(({
			roleId,
			roleName
		}) => {
			bindData.info.roleName = roleName;
			staticData.roleId = roleId;
			doQuery(roleId);
		})

		async function doQuery(roleId) {
			bindData.userList = await util.postByBeanName('userRoleRelTF', 'queryRoleUserList', {
				roleId
			});
			bindData.userList.forEach(item => {
				if (item.relId) item.issel = true;
			})
		}

		function checkChange(item) {
			item.issel = !item.issel;
		}

		function filterCheck(e) {
			let value = e.detail.value;
			if (value == 1) {
				bindData.userList.forEach(item => {
					item.issel = true;
				})
			}
			if (value == 0) {
				bindData.userList.forEach(item => {
					item.issel = false;
				})
			}
		}

		async function submit() {
			let info = {
				roleId: staticData.roleId
			}
			let userIdList = [];
			bindData.userList.forEach(item => {
				if (item.issel) {
					userIdList.push(item.userId)
				}
			})
			info.userIds = String(userIdList);
			console.log(info)
			// return
			await util.postByBeanName('userRoleRelTF', 'saveUserRoleRel', info);
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