Page({
  //保存正在编辑的任务
  data: {
    title: '',
    desc: '',
    rangeArray: [0,10,20,30,40,50,60,70,80,90,100],
    credit: 0,
    maxCredit: getApp().globalData.maxCredit,
    presetIndex: 0,
    presets: [{
      name:"无预设",
      title:"",
      desc:"",
      credit: 0,
    },
    {
      name:"背单词/学英语",
      title:"学英语",
      desc:"必须要学习英语呀！",
      credit: 5,
    },
    {
        name:"休息",
        title:"休息",
        desc:"今天好好玩！",
        credit: -10,
      }],
    list: getApp().globalData.collectionStudyList,
  },

  //数据输入填写表单
  onTitleInput(e) {
    this.setData({
      title: e.detail.value,
      credit: 2
    })
  },
  onDescInput(e) {
    this.setData({
      desc: e.detail.value
    })
  },
//   onCreditInput(e) {
//     const val = e.detail.value;
//     this.setData({
//       credit: this.data.rangeArray[val[0]]
//     });
//   },
  onPresetChange(e){
    this.setData({
      presetIndex: e.detail.value,
      title: this.data.presets[e.detail.value].title,
      desc: this.data.presets[e.detail.value].desc,
      credit: this.data.presets[e.detail.value].credit,
    })
  },
// 步进器
  handleChange(e) {
    const { value } = e.detail;
    // console.log(value);
    this.setData({
        credit: value
    });
  },
  // 滑条
  onCreditInput(e) {
    // console.log(parseInt(e.detail.value/5))
    this.setData({
      credit: parseInt(e.detail.value/5)*5
    })
  },

  //保存任务
  async saveMission() {
    // 对输入框内容进行校验
    if (this.data.title === '') {
      wx.showToast({
        title: '标题未填写',
        icon: 'error',
        duration: 2000
      })
      return
    }
    if (this.data.title.length > 12) {
      wx.showToast({
        title: '标题过长',
        icon: 'error',
        duration: 2000
      })
      return
    }
    if (this.data.desc.length > 100) {
      wx.showToast({
        title: '描述过长',
        icon: 'error',
        duration: 2000
      })
      return
    }
    if (this.data.credit != 0) {
        await wx.cloud.callFunction({name: 'addElement', data: this.data}).then(
            () => {
                wx.showToast({
                    title: '添加成功',
                    icon: 'success',
                    duration: 1000
                })
            }
        )
        setTimeout(function () {
            wx.navigateBack()
        }, 1000)
    }
  },

  // 重置所有表单项
  resetMission() {
    this.setData({
      title: '',
      desc: '',
      credit: 0,
      presetIndex: 0,
      list: getApp().globalData.collectionStudyList,
    })
  }
})