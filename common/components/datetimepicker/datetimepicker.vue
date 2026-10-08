<template>
    <view>
        <picker :style="dStyle" mode="multiSelector" :value="dateTimeClone" @change="bindDateChange" @columnchange="changeDateTimeColumn" :range="dateTimeArray">
            <view class="picker" v-if="dateShow">
                {{ dateTimeArray[0][dateTime[0]] }}-{{ dateTimeArray[1][dateTime[1]] }}-{{ dateTimeArray[2][dateTime[2]] }} {{ dateTimeArray[3][dateTime[3]] }}:{{
                    dateTimeArray[4][dateTime[4]]
                }}
                <text v-if="!type">:{{ dateTimeArray[5][dateTimeClone[5]] }}</text>
            </view>
            <view class="component_placeholder_color" v-if="!dateShow && !isInitClone">{{ placeholder }}</view>
            <view v-if="!dateShow && isInitClone">{{ initValue }}</view>
        </picker>
    </view>
</template>

<script>
const dateTimePicker = require('../../../utils/dateTimePicker.js');

export default {
    data() {
        return {
            startYear: 2000,
            endYear: 2099,
            dateTimeArray: '',
            dateShow: false,

            event: {
                eventDate: ''
            },

            dateTimeClone: '',
            isInitClone: false
        };
    },
    mounted: function () {
        var obj = dateTimePicker.dateTimePicker(this.startYear, this.endYear, undefined, this.type);
        this.setData({
            dateTimeClone: obj.dateTime,
            dateTimeArray: obj.dateTimeArray,
            dateShow: false
        }); // this.syncAttrUpdate(this.getDate(obj.dateTime))
    },
    options: {
        multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    props: {
        dateTime: Object,
        dStyle: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: '选填'
        },
        initValue: {
            type: String,
            default: ''
        },
        isInit: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: ''
        }
    },
    methods: {
        bindDateChange(e) {
            this.setData({
                'event.eventDate': dateTimePicker.getDate(this.dateTimeArray, e.detail.value),
                dateTimeClone: e.detail.value,
                dateShow: true,
                isInitClone: false
            });
            this.syncAttrUpdate(this.getDate(e.detail.value));
        },

        changeDateTimeColumn(e) {
            let { column, value } = e.detail;
            this.dateTime[column] = value;
            this.setData({
                dateTimeClone: this.dateTime
            });

            if (column == 1) {
                let date = dateTimePicker.getDate(this.dateTimeArray, this.dateTime);
                var obj = dateTimePicker.dateTimePicker(this.startYear, this.endYear, date, this.type);
                this.setData({
                    dateTimeClone: obj.dateTime,
                    dateTimeArray: obj.dateTimeArray
                });
            }
        },

        syncAttrUpdate(datetime) {
            this.$emit('change', {
                detail: datetime
            });
        },

        getDate(arr) {
            var data = this.dateTimeArray;
            var datatime = '';

            for (var i in arr) {
                if (i < 2) {
                    datatime += data[i][arr[i]] + '-';
                } else if (i == 2) {
                    datatime += data[i][arr[i]] + ' ';
                } else if (2 < i && i < arr.length - 1) {
                    datatime += data[i][arr[i]] + ':';
                } else {
                    datatime += data[i][arr[i]];
                }
            }

            return datatime;
        },

        cleanDate() {
            this.setData({
                dateShow: false,
                isInitClone: false
            });
        }
    },
    watch: {
        dateTime: {
            handler: function (newVal, oldVal) {
                this.dateTimeClone = newVal;
            },

            immediate: true
        },

        isInit: {
            handler: function (newVal, oldVal) {
                this.isInitClone = newVal;
            },

            immediate: true
        }
    }
};
</script>
<style>
picker {
    width: 100%;
    color: #333;
    height: 60rpx;
    line-height: 60rpx;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    border-radius: 10rpx;
}
.component_placeholder_color {
    color: #c8c9cc !important;
}
.component_value_color {
    color: #bdbdbd !important;
}
</style>
