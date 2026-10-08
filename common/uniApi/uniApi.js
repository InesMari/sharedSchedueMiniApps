import promisify from '/utils/promisify.js';
export default {
    data() {
        return {};
    },
    authorize: promisify(uni.authorize),
    getSetting: promisify(uni.getSetting),
    checkSession: promisify(uni.checkSession),
    openSetting: promisify(uni.openSetting),
    chooseImage: promisify(uni.chooseImage),
    previewImage: promisify(uni.previewImage),
    getImageInfo: promisify(uni.getImageInfo),
    login: promisify(uni.login),
    getUserInfo: promisify(uni.getUserInfo),
    authorize: promisify(uni.authorize),
    setStorage: promisify(uni.setStorage),
    getStorage: promisify(uni.getStorage),
    clearStorage: promisify(uni.clearStorage),
    showModal: (params) => {
        if (typeof params == 'object') return promisify(uni.showModal)(params);

        if (typeof params == 'string') {
            return new Promise((resolve, reject) => {
                uni.showModal({
                    title: '提示信息',
                    content: params,
                    showCancel: false,
                    success: (res) => {
                        resolve(res);
                    },
                    fail: (res) => {
                        reject(res);
                    }
                });
            });
        }
    },
    showToast: (params) => {
        if (typeof params == 'object') return promisify(uni.showToast)(params);

        if (typeof params == 'string') {
            return new Promise((resolve, reject) => {
                uni.showToast({
                    title: params,
                    icon: 'none',
                    duration: 1500,
                    success: (res) => {
                        resolve(res);
                    },
                    fail: (res) => {
                        reject(res);
                    }
                });
            });
        }
    },
    checkSession: promisify(uni.checkSession),
    makePhoneCall: promisify(uni.makePhoneCall),
    getStorageInfo: promisify(uni.getStorageInfo),
    setNavigationBarTitle: promisify(uni.setNavigationBarTitle),
    showNavigationBarLoading: promisify(uni.showNavigationBarLoading),
    hideNavigationBarLoading: promisify(uni.hideNavigationBarLoading),
    getSystemInfo: promisify(uni.getSystemInfo),
    getSettingWithSubscriptions: () => {
        return new Promise((resolve, reject) => {
            uni.getSetting({
                withSubscriptions: true,
                success: (res) => {
                    resolve(res);
                },
                fail: (res) => {
                    reject(res);
                }
            });
        });
    },
    setClipboardData: (value) => {
        return new Promise((resolve, reject) => {
            uni.setClipboardData({
                data: String(value),
                success: (res) => {
                    resolve(res);
                },
                fail: (res) => {
                    reject(res);
                }
            });
        });
    }
};
