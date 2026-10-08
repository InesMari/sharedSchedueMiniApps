<template>
  <view class="main">
    <view class="input" @click="showModal">
      <input
        v-model="_value"
        :style="disabled ? 'color:#c0c4cc' : ''"
        :placeholder="placeholder"
        placeholder-style="color: rgba(102, 102, 102, 0.25);"
        placeholder-class="zqs-select-placeholder-class"
        disabled
      />
      <image
        v-if="showArrow && !_value"
        src="@/static/right_icon.png"
        class="selector-icon"
      ></image>
	  
    </view>
    <view
      class="select-modal"
      :class="isShowModal ? 'show' : ''"
      @tap="hideModal"
    >
      <view
        class="select-dialog"
        @tap.stop=""
        :style="{ backgroundColor: bgColor }"
      >
        <view class="title-main">
          <text class="title-detail">{{ title }}</text>
        </view>

        <!-- <view class="search-box" v-if="showSearch">
          <input
            class="search-input"
            confirm-type="search"
            v-model="searchInput"
            placeholder="输入内容进行模糊查询"
            placeholder-style="color:rgba(102, 102, 102, 0.25);"
			@input="inputSearch"
          />
          <text v-if="showSearchBtn" class="search-text" @click="handleSearch">
            搜索
          </text>
        </view> -->
        <view class="select-content">
          <view
            class="select-item"
            v-for="(item, index) in list"
            :key="index"
            :style="
              valueIndexOf(item)
                ? 'color:' +
                  selectColor +
                  ';background-color:' +
                  selectBgColor +
                  ';'
                : 'color:' + color + ';'
            "
            @click="select(item)"
          >
            <view class="title">{{ getLabelKeyValue(item) }}</view>
            <text class="selectIcon icongou" v-if="valueIndexOf(item)"></text>
          </view>
        </view>
        <view class="select-bar bg-white">
          <button
            plain="true"
            class="mini-btn action"
            type="default"
            size="mini"
            @tap="empty"
          >
            {{ emptyText }}
          </button>
          <button
            class="mini-btn action"
            type="primary"
            size="mini"
            @tap="confirmClick"
          >
            {{ confirmText }}
          </button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'zqsSelect',
  data() {
    return {
      isShowModal: false,
      searchInput: '',
      options: [],
    }
  },
  props: {
    showSearch: {
      // 是否显示搜索框
      type: Boolean,
      default: true,
    },
    value: {
      type: [Number, String, Array, Object],
      default: [],
    },
    placeholder: {
      // 占位符
      default: '',
      type: String,
    },
    multiple: {
      // 是否多选
      default: false,
      type: Boolean,
    },
    list: {
      default: () => [],
      type: Array,
    },
    valueKey: {
      // 指定list中valueKey的值作为下拉框绑定内容
      default: 'value',
      type: String,
    },
    labelKey: {
      // 指定list中labelKey的值作为下拉框显示内容
      default: 'label',
      type: String,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
    clearable: {
      default: false,
      type: Boolean,
    },
    emptyText: {
      default: '重置',
      type: String,
    },
    title: {
      default: '选择内容',
      type: String,
    },
    confirmText: {
      default: '确定',
      type: String,
    },
    color: {
      default: '#000000',
      type: String,
    },
    selectColor: {
      default: '#0081ff',
      type: String,
    },
    bgColor: {
      default: '#ffffff',
      type: String,
    },
    selectBgColor: {
      default: '#FFFFFF',
      type: String,
    },
    valueType: {
      default: 'single',
      type: String, // single || all
    },
    showSearchBtn: {
      default: true,
      type: Boolean, // single || all
    },
    showArrow: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['openDeepScroll', 'closeDeepScroll'],
  computed: {
    _value: {
      get() {
        return this.get_value(this.value)
      },
      set(val) {
        this.$emit('input', val)
		this.$emit("update:value",val);
      },
    },
  },
  created() {},
  methods: {
    handleSearch() {
      this.$emit('search', this.searchInput)
    },
	inputSearch(){
		
	},
    get_value(val) {
      // 将数组值转换为以,隔开的字符串
      if (val || val === 0) {
        if (Array.isArray(val)) {
          let chooseAttr = []
          val.forEach((item) => {
            let choose = this.list.find((temp) => {
              let val_val = this.getValueKeyValue(temp)
              return item === val_val
            })
            // 判断是否存在
            if (choose) {
              chooseAttr.push(choose)
            }
          })
          let values = ''
          if (chooseAttr.length > 0) {
            values = chooseAttr
              .map((temp) => this.getLabelKeyValue(temp))
              .join(',')
          }

          return values
        } else {
          let choose = this.list.find((temp) => {
            let val_val = this.getValueKeyValue(temp)
            return val === val_val
          })
          if (choose) {
            return this.getLabelKeyValue(choose)
          } else {
            return val
          }
        }
      } else {
        return ''
      }
    },
    select(item) {
      // 点击选项
      let val = this.getValueKeyValue(item)
      if (this.multiple) {  
        let _value = this.value
        let index = _value ? _value.indexOf(val) : -1
        if (index != -1) {
          _value.splice(index, 1)
          this.options.splice(index, 1)
		  this.$emit("update:value",_value);
          this.$emit('input', _value)
        } else {
          _value.push(val)
          this.options.push(item)
		  this.$emit("update:value",_value);
          this.$emit('input', _value)
        }
        this.$emit('change', item)
      } else {
        let label = this.getLabelKeyValue(item)
        if (this._value) {
          if (label.indexOf(this._value) !== -1) {
            this.$emit('input', '')
			this.$emit("update:value",'');
          } else {
            this.$emit('input', val)
			this.$emit("update:value",val);
          }
        } else {
          this.$emit('input', val)
		  this.$emit("update:value",val);
        }

        // 单选选中的当前项所有
        this.$emit('change', item)
        this.hideModal()
      }
    },
    valueIndexOf(item) {
      let val = this.getValueKeyValue(item)
      if (Array.isArray(this.value)) {
        return this.value.indexOf(val) != -1
      } else {
        return this.value === val
      }
    },
    getLabelKeyValue(item) {
      // 获取label
      return item[this.labelKey]
    },
    getValueKeyValue(item) {
      // 获取value
      return item[this.valueKey]
    },
    empty() {
      // 清空
      if (this.multiple) {
		this.$emit("update:value",[]);
        this.$emit('change', [])
        this.$emit('input', [])
      } else {
		this.$emit("update:value",[]);
        this.$emit('change', '')
        this.$emit('input', '')
      }
    },
    // cancelClick() {
    //   // 点击取消
    //   this.$emit('cancel', this._value)
    //   this.hideModal()
    // },
    confirmClick() {
      // 点击确定
      if (this.valueType === 'all') {
        this.$emit('confirm', this.options)
      } else {
        this.$emit('confirm', this._value)
      }
      this.hideModal()
    },
    showModal() {
      // 显示model
      if (!this.disabled) {
        this.isShowModal = true
        // 打开禁止穿透滚动
        this.$emit('openDeepScroll')
      }
    },
    hideModal() {
      // 隐藏model
      this.isShowModal = false
      // 关闭禁止穿透滚动
      this.$emit('closeDeepScroll')
    },
  },
  watch: {
    searchInput(val) {
      if (!this.$props.showSearchBtn) this.$emit('search', val)
    },
  },
}
</script>
<style>
@font-face {
  font-family: 'selectIcon';
  src: url('//at.alicdn.com/t/font_1833441_ycfzdhg2u3.eot?t=1590375117208');
  /* IE9 */
  src: url('//at.alicdn.com/t/font_1833441_ycfzdhg2u3.eot?t=1590375117208#iefix')
      format('embedded-opentype'),
    /* IE6-IE8 */
      url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAAMEAAsAAAAABvQAAAK4AAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCDBgqBRIFCATYCJAMMCwgABCAFhQUHNRsfBsg+QCa3uoO0oAJTMwhxVu965keqWBy1hkbwtfzWb2Z279/shRhJisKF6FApKLI7oyBbpAaHo3w24k+ca9EUJbDmjaeznUdZ/FOUlkWdJ33rizZY/Pw6J5Xw0qKYxHTMesePHVT6EFpaC4zV70sKi2bYgNPc1w0WHnDVC/e/UnNTgyP+4Jq6BBpIHoisgypLaIAFEtU0wgeaIG8Yu4nAIZwnUK1QgFfOT6nUUoBpgXjj2lqplTMpiuXtCW3N2iK+aPTS2/Qdnzny8d+5IEiaDMy99exklra//FrKnX48pChmgrq5QcYRQCEe17ruqgqLAKv8WntwqwhpLms/nB5yW/iHRxJEC0QOgT3NnfgF01NBKvOuIzNoZdh5gJuAeGrsozE8vOJ7u5D832oz55039W5G+S52K0H+zNf1TJz07k26kqoQybRfwVFV4rjDS/K8EXUyuF1cXnT3weKS9Rvdm/xe7h8oA1hLwOR18R+Y4n4zwpr4z5SU089Vc+cpfWL+mn5APmT3Z39jeOs/GbWjK+DnmsuL/u6ehMX4j4yedSVkAUUuPh3TY022MtKZUEOtPqCb8Bkvnr5XT6imU0gGrEJW7aAL/gw0OhegVV2F6pC7uTOppirKIA4MFQhTrpCM+AbZlDu64L/QmAkQWlMhQXU75D07O9Gtl0PUYjTBLyAzOLNQYtypIEEjvsXtBLQTooV2nrQrGEau2gKmZlR4L8gwnGtBJbUn1diCOOQUnEkTkRAOeci9KHOQxvFro+tx3ZcGAaeljstCSBNDJuArgIyBYyy6OdZxAhHIELu1IC9AtgShCVtLltEKrSff1XoHJo3RC33hM63o3j6pSNkmqmIWEAtxFHB2OwoRBAfyeqE3r2ogHeF42dBhs7gvf7CukH5MmlUGOCpHihxFfs6TehDyKCqVAA==')
      format('woff2'),
    url('//at.alicdn.com/t/font_1833441_ycfzdhg2u3.woff?t=1590375117208')
      format('woff'),
    url('//at.alicdn.com/t/font_1833441_ycfzdhg2u3.ttf?t=1590375117208')
      format('truetype'),
    /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
      url('//at.alicdn.com/t/font_1833441_ycfzdhg2u3.svg?t=1590375117208#selectIcon')
      format('svg');
  /* iOS 4.1- */
}

.title-main {
  display: flex;
  justify-content: center;
  width: 100%;
}

.title-detail {
  display: flex;
  width: 88%;
  justify-content: center;
  padding: 30rpx 0;
  /*  border-bottom: 1rpx solid #e6e1e1; */
}

.selectIcon {
  font-family: 'selectIcon' !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icongou:before {
  content: '\e61c';
}

.iconcross:before {
  content: '\e61a';
}
</style>
<style lang="scss" scoped>
.main {
  font-size: 28rpx;
}

.bg-white {
  background-color: #ffffff;
}

.input {
  display: flex;
  align-items: center;
  // font-size: 28rpx;
  // height: 60rpx;
  // padding: 10rpx 20rpx;
  // border-radius: 10rpx;
  // border-style: solid;
  // border-width: 1rpx;
  // border-color: rgba(0, 0, 0, 0.1);

  input {
    flex: 1;
    color: #333333;
  }

  .selector-icon {
    width: 32rpx;
    height: 36rpx;
    vertical-align: middle;
  }
}

.select-modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9999;
  opacity: 0;
  outline: 0;
  text-align: center;
  -ms-transform: scale(1.185);
  transform: scale(1.185);
  backface-visibility: hidden;
  perspective: 2000rpx;
  background: rgba(0, 0, 0, 0.6);
  transition: all 0.3s ease-in-out 0s;
  pointer-events: none;
  margin-bottom: -1000rpx;

  &::before {
    content: '\200B';
    display: inline-block;
    height: 100%;
    vertical-align: bottom;
  }

  .select-dialog {
    position: absolute;
    left: 0;
    bottom: 0;
    display: inline-block;
    margin-left: auto;
    margin-right: auto;
    background-color: #f8f8f8;
    overflow: hidden;
    width: 100%;
    border-radius: 0;

    .select-content {
      // background-color: #F1F1F1;
      height: 60vh;
      overflow: auto;

      .select-item {
        text-align: left;
        padding: 20rpx 40rpx;
        display: flex;
		border-bottom: 2px solid #f5f2f2;

        // ::after {
        //   content: '';
        //   width: 100%;
        //   height: 1px;
        //   display: block;
        //   margin: 0 auto;
        //   border-bottom: 2px solid #f5f2f2;
        //   padding: 1px;
        // }

        .title {
          flex: 1;
        }
      }
    }
  }
}

.select-modal.show {
  opacity: 1;
  transition-duration: 0.3s;
  -ms-transform: scale(1);
  transform: scale(1);
  overflow-x: hidden;
  overflow-y: auto;
  pointer-events: auto;
  margin-bottom: 0;
}

.select-bar {
  padding: 0 80rpx;
  display: flex;
  position: relative;
  align-items: center;
  min-height: 80rpx;
  justify-content: space-between;
  margin-bottom: 50rpx;

  .action {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 100%;
    padding: 0 100rpx;
  }
}

.search-box {
  display: flex;
  margin: 10rpx 0;
  align-items: center;
  padding: 10rpx 40rpx;
}

.search-input {
  flex: 1;
  height: 67rpx;
  line-height: 67rpx;
  border-radius: 40rpx;
  background: #f5f2f2;
}

.search-text {
  padding-left: 30rpx;
}
</style>
