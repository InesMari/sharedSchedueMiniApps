import common from './common.js'
import CryptoJS from './sha.js'
import md5 from './md5.js'
import JSEncrypt from 'jsencrypt';

var wxAppId = "wx4b83389618d66302";
var appId = "WXAPP";
var intfKey = "d27c87e15a5bd068dc95ca7c36d51216";

// 环境识别
var IntfUrl = "https://wxapp.1000e56.com/intf?" //正式
// #ifdef MP-WEIXIN
let env = __wxConfig.envVersion;
// #endif
// #ifndef MP-WEIXIN
let env = 'develop'
// #endif
switch (env) {
	// 开发环境
	case 'develop':
		console.log("开发环境");
		IntfUrl = "http://183.6.76.4:5810/intf?"
		// IntfUrl = "https://wxapp-t.ete56.cn/intf?"
		// IntfUrl = "http://192.168.1.62:3811/intf?"; //杨
		// IntfUrl = "http://192.168.1.152:5811/intf?"; //福
		// IntfUrl = "https://fqdd.1000e56.com/intf?"	//生产
		break;
		// 体验版
	case 'trial':
		console.log("体验环境");
		IntfUrl = "http://183.6.76.4:5810/intf?"
		// IntfUrl = "https://fqdd.1000e56.com/intf?"
		break;
		// 生产
	case 'release':
		console.log("生产环境");
		IntfUrl = "https://fqdd.1000e56.com/intf?"
		break;
}

const formatTime = date => {
	const year = date.getFullYear()
	const month = date.getMonth() + 1
	const day = date.getDate()
	const hour = date.getHours()
	const minute = date.getMinutes()
	const second = date.getSeconds()
	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatNumber = n => {
	n = n.toString()
	return n[1] ? n : '0' + n
}
const postByCode = function(inCode, param, successFun, errorFun, postType) {
	return post(inCode, "", "", param, successFun, errorFun, postType);
}
const postByBeanName = function(beanName, methodName, param = {}, successFun, errorFun, postType, showLoading = true) {
	return post("", beanName, methodName, param, successFun, errorFun, postType, showLoading);
}
const post = function(inCode, beanName, methodName, param, successFun, errorFun, postType, showLoading) {
	inCode = inCode == undefined || inCode == null ? "" : inCode;
	beanName = beanName == undefined || beanName == null ? "" : beanName;
	methodName = methodName == undefined || methodName == null ? "" : methodName;
	if (postType == undefined || postType == "" || postType == null) {
		postType = "POST";
	}
	var postUrl = IntfUrl;
	var url = postUrl + inCode;
	if (param == null || param == undefined) {
		uni.showModal({
			title: '提示',
			content: '提交参数为空',
			showCancel: false
		})
		return;
	}
	//计算sign
	var inParam = {};
	inParam.inCode = inCode;
	inParam.beanName = beanName;
	inParam.method = methodName;
	inParam.appId = appId;
	inParam.tokenId = uni.getStorageSync('tokenId');
	var d = new Date();
	inParam.time = d.getTime().toString();
	var round = Math.round(Math.random() * 1000);
	inParam.rd = round.toString();
	param.inCode = inCode;
	inParam.content = param;
	var paramArray = new Array(intfKey, inParam.tokenId, inParam.time, inParam.rd, JSON.stringify(inParam.content));
	paramArray.sort();
	var str = "[";
	for (var i = 0; i < paramArray.length; i++) {
		str += paramArray[i];
		if (i != paramArray.length - 1) {
			str += ", ";
		}
	}
	str += "]";
	var sign = CryptoJS.SHA1(str).toString();
	inParam.sign = sign;
	return new Promise((resolve, reject) => {
		if (showLoading) uni.showLoading();
		uni.request({
			url: url,
			data: inParam,
			method: postType,
			success: function(res) {
				uni.hideLoading();
				if (res.data.status == '200') {
					var tokenId = res.data.content.tokenId
					if (tokenId !== undefined && tokenId !== null && tokenId !== "") {
						uni.setStorageSync("tokenId", res.data.content.tokenId);
					}
					if (common.isNotBlank(successFun)) { //有传入方法时使用
						successFun(res.data.content)
					}
					resolve(res.data.content); //同步处理
				} else if (res.data.status == '403') {
					var app = getApp();
					if (typeof errorFun == "function") {
						errorFun(res);
					}
					reject(res);
					uni.clearStorageSync();
					uni.reLaunch({
					  url: '/pages/homeNoLogin/homeNoLogin',
					})
				} else if (res.data.status == '501') {
					uni.showModal({
						title: '提示',
						content: res.data.message || '网络出现小问题啦',
						showCancel: false,
					})
					if (typeof errorFun == "function") {
						errorFun(res);
					}
					reject(res);
				} else {
					reject(res);
					if (typeof errorFun == "function") {
						errorFun(res);
						return;
					}
					uni.showModal({
						title: '提示',
						content: res.data.message || '网络出现小问题啦',
						showCancel: false
					})
				}
			},
			fail: function(res) {
				uni.hideLoading();
				reject(res);
				if (typeof errorFun == "function") {
					errorFun(res);
				} else {
					uni.showModal({
						title: '提示',
						content: '网络出现小问题啦',
						showCancel: false
					})
				}
			}
		})
	});
}
//get URL加密
const signUrl = function(orgiUrl) {
	var paramArray = new Array();
	var name, value, paramStr;
	if (orgiUrl != undefined) {
		var realUrl = orgiUrl.substring(0, orgiUrl.indexOf("?"));
		var index = realUrl.lastIndexOf("/");
		var url = orgiUrl.substring(index + 1);
		var idx = 0;
		if ((idx = url.indexOf("&")) > 0) {
			paramStr = url.substring(0, idx);
			var params = url.substring(idx + 1).split("&");
			for (var i in params) {
				if (params[i].split("=")[1] !== "null" && params[i].split("=")[1] !== "") {
					paramArray.push(params[i]);
				}
			}
		} else {
			paramStr = url;
		}
	}
	if (paramArray.length > 0)
		paramStr += "&" + paramArray.sort().join("&");
	paramStr += "&sign=" + md5.md5(paramStr);
	return webUrl + paramStr;
}
const rsaEncrypt = function(str) {
	let pubkey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDGeHY3oYYWut4enCcvfMLpPkGe' +
		'1pJ0biBDd3w8vdhjf48VzvywmTN3UMIfr+iiq6aWhuhdn8dDe5b6AmeWkVenf3oH' +
		'AKUcXebhM1E5RMhIWHoVt81mFhUCQaYIeoouUOYktzVNmNynDaJPIpHd16glVMtc' +
		'4l2lBD2hIJN8P3mgdQIDAQAB';
	let encryptStr = new JSEncrypt();
	encryptStr.setPublicKey(pubkey); // 设置 加密公钥
	let data = encryptStr.encrypt(str.toString()); // 进行加密
	return data;
}

// 上传文件
const uploadFile = function(file) {
	let inParam = {}
	inParam.appId = appId;
	inParam.beanName = "fileCommonTF";
	inParam.method = "doUpload";
	inParam.time = new Date().getTime().toString();
	inParam.rd = Math.round(Math.random() * 1000).toString();
	inParam.content = {};
	inParam.inCode = '';
	inParam.tokenId = uni.getStorageSync('tokenId') || '';
	let paramArray = [intfKey, inParam.tokenId, inParam.time, inParam.rd, JSON.stringify(inParam.content)].sort();
	let str = "[";
	for (let item of paramArray) str += (item + ', ');
	str = str.replace(/, $/, '');
	str += "]";
	inParam.sign = CryptoJS.SHA1(str).toString();
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: IntfUrl, // 仅为示例，非真实的接口地址
			filePath: file.path,
			name: 'file',
			formData: {
				json: JSON.stringify(inParam)
			},
			success(res) {
				resolve(res);
			},
			fail(res) {
				reject(res);
			}
		});
	})
}

const uploadExcel = function(file, content) {
	let inParam = {}
	inParam.appId = appId;
	inParam.beanName = "attendanceServiceImpl";
	inParam.method = "uploadAttendanceData";
	inParam.time = new Date().getTime().toString();
	inParam.rd = Math.round(Math.random() * 1000).toString();
	inParam.content = content;
	inParam.inCode = '';
	inParam.tokenId = uni.getStorageSync('tokenId') || '';
	let paramArray = [intfKey, inParam.tokenId, inParam.time, inParam.rd, JSON.stringify(inParam.content)].sort();
	let str = "[";
	for (let item of paramArray) str += (item + ', ');
	str = str.replace(/, $/, '');
	str += "]";
	inParam.sign = CryptoJS.SHA1(str).toString();
	uni.showLoading('正在上传');
	return new Promise((resolve, reject) => {
		uni.uploadFile({
			url: IntfUrl, // 仅为示例，非真实的接口地址
			filePath: file.path,
			name: 'file',
			formData: {
				json: JSON.stringify(inParam)
			},
			success(res) {
				uni.hideLoading();
				resolve(res);
			},
			fail(res) {
				uni.hideLoading();
				reject(res);
			}
		});
	})
}

export default {
	wxAppId,
	appId,
	formatNumber,
	formatTime,
	postByCode,
	postByBeanName,
	postByBeanName,
	signUrl,
	rsaEncrypt,
	uploadFile,
	uploadExcel,
}