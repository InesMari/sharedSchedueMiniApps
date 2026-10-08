<template>
    <view :animation="animationData" class="p-container" @touchstart="touchstartHandler" @touchend="touchendHandler" @touchmove="touchmoveHandler">
        <view id="shade" class="p-shade" @tap="tapHandler"></view>
        <view class="p-popover extends-class" :style="width ? 'width:' + width + ';' : ''">
            <scroll-view :scroll-y="true" class="scroll-view">
                <slot></slot>
            </scroll-view>
        </view>
    </view>
</template>

<script>
let animation = uni.createAnimation({
    duration: 400,
    timingFunction: 'ease'
});
let start = 0;
let end = 0;
export default {
    data() {
        return {
            animationData: {},
            currentState: false,
            isShowClone: false
        };
    },
    externalClasses: ['extends-class'],
    props: {
        isShow: {
            type: Boolean,
            default: false
        },
        width: {
            type: String,
            default: null
        }
    },
    methods: {
        show() {
            this.setData({
                currentState: true
            });
            animation.translateX('-100%').step();
            this.setData({
                animationData: animation.export(),
                isShowClone: true
            });
            this.$emit('show');
        },

        hide() {
            this.setData({
                currentState: false
            });
            animation.translateX('100%').step();
            this.setData({
                animationData: animation.export(),
                isShowClone: false
            });
            start = 0;
            end = 0;
            this.$emit('hide');
        },

        touchstartHandler(e) {
            if (e && e.changedTouches && e.changedTouches.length) {
                start = e.changedTouches[0].pageX;
            }
        },

        touchendHandler(e) {
            if (e && e.changedTouches && e.changedTouches.length) {
                end = e.changedTouches[0].pageX;
            }

            if (end - start > 80) {
                this.hide();
            } else if (end == start && e && e.target && e.target.id == 'container') {
                this.hide();
            }
        },

        tapHandler(e) {
            if (e && e.target && e.target.id == 'shade') {
                this.hide();
            }
        },

        touchmoveHandler() {
            // wx.pageScrollTo({ scrollTop: 1 });
        }
    },
    watch: {
        isShow: {
            handler: function (newVal, oldVal) {
                this.isShowClone = this.deepClone(this.isShow);
                if (newVal) {
                    this.show();
                } else {
                    this.hide();
                }
            },

            immediate: true
        }
    }
};
</script>
<style>
.p-container {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0px;
    right: -100%;
    z-index: 20;
}

.p-shade {
    width: 100%;
    height: 100%;
    top: 0px;
    right: 0px;
    position: absolute;
    background-color: rgba(187, 187, 187, 0.6);
}

.p-popover {
    width: 53%;
    height: 100%;
    top: 0px;
    right: 0px;
    position: absolute;
    background-color: #fff;
}

.scroll-view {
    height: 100%;
}
</style>
