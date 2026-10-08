<template>
    <view class="alert" id="alert" v-if="isshowClone">
        <view class="popup_bj" @tap="closealert"></view>
        <view class="con" :style="aStyle">
            <view class="title" v-if="title ? true : false">{{ title }}</view>
            <slot></slot>
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            isshowClone: false
        };
    },
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    props: {
        isshow: {
            type: Boolean,
            default: false
        },
        title: String,
        aStyle: String
    },
    methods: {
        observeval: function (newVal, oldVal) {
            if (newVal) {
                this.$emit('showalert');
            }
        },

        closealert() {
            this.setData({
                isshowClone: false
            });
            this.$emit('closealert');
        },

        showalert() {}
    },
    watch: {
        isshow: {
            handler: function (newVal, oldVal) {
                this.isshowClone = this.deepClone(this.isshow);
                if (newVal) {
                    this.$emit('showalert');
                }
            },

            immediate: true
        }
    }
};
</script>
<style>
.alert {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 99999;
}
.con {
    border-radius: 10rpx;
    background: #fff;
    position: absolute;
    width: 80%;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    -webkit-transform: translateX(-50%) translateY(-50%);
    z-index: 9;
    overflow: hidden;
}
.title {
    font-size: 34rpx;
    border-bottom: 1rpx solid #d6dbe2;
    line-height: 90rpx;
    height: 90rpx;
    padding: 0 25rpx;
    text-align: center;
    /* color: #1089db; */
}

.popup_bj {
    background: rgba(0, 0, 0, 0.8);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>
