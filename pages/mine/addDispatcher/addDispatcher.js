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
			disabled:false,
		})

		onLoad(({
			id
		}) => {
			if (common.isNotBlank(id)) {
				doQuery(id);
				bindData.disabled = !bindData.entitys[20014];
			}
		})

		async function doQuery(id) {
			let data = await util.postByBeanName('userTF', 'loadUserInfoForWechat', {
				id
			});
			bindData.info = data.info;
			if (common.isNotBlank(bindData.info.idCardFrontImgUrl)) {
				bindData.info.idCardFrontImgUrls = [{
					url: bindData.info.idCardFrontImgUrl
				}]
			}else{
				bindData.info.idCardFrontImgUrls = "";
			}
			if (common.isNotBlank(bindData.info.idCardBackImgUrl)) {
				bindData.info.idCardBackImgUrls = [{
					url: bindData.info.idCardBackImgUrl
				}]
			}else{
				bindData.info.idCardBackImgUrls = ""
			}

			console.log(bindData.info)
		}

		// 正页上传成功
		async function selectFront(e) {
			uni.showLoading();
			const {
				file
			} = e.tempFiles[0];
			let {
				data
			} = await util.uploadFile(file);
			uni.hideLoading();
			data = JSON.parse(data); //数据转化
			bindData.info.idCardFrontImg = data.content.flowId;
			bindData.info.idCardFrontImgPath = data.content.storePath;
		}
		// 删除正页图片
		function clearFront(){
			bindData.info.idCardFrontImg = '';
			bindData.info.idCardFrontImgPath = '';
		}
		// 副页上传成功
		async function selectBack(e) {
			uni.showLoading();
			const {
				file
			} = e.tempFiles[0];
			let {
				data
			} = await util.uploadFile(file);
			uni.hideLoading();
			data = JSON.parse(data); //数据转化
			bindData.info.idCardBackImg = data.content.flowId;
			bindData.info.idCardBackImgPath = data.content.storePath;
		}
		// 删除副页图片
		function clearBack(){
			bindData.info.idCardBackImg = '';
			bindData.info.idCardBackImgPath = '';
		}
		async function submit() {
			let {
				idCardFrontImg,
				idCardBackImg,
				userName,
				billId,
				remark
			} = bindData.info;
			if (common.isBlank(idCardFrontImg)) {
				await uniApi.showToast("请上传正页")
				return
			}
			if (common.isBlank(idCardBackImg)) {
				await uniApi.showToast("请上传副页")
				return
			}
			if (common.isBlank(userName)) {
				await uniApi.showToast("请输入调度员姓名")
				return
			}
			if (common.isBlank(billId)) {
				await uniApi.showToast("请输入调度员手机")
				return
			}
			if (common.isBlank(remark)) {
				await uniApi.showToast("请输入备注")
				return
			}
			await util.postByBeanName('userTF', 'saveOrUpdateUserForWLGS', bindData.info);
			await uniApi.showModal("保存成功")
			uni.navigateBack({
				delta: 1,
			})
		}
		return {
			...toRefs(bindData),
			selectFront,
			clearFront,
			selectBack,
			clearBack,
			submit,
			doQuery,
		}

	}
};