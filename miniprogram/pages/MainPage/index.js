/* Main page of the app */
Page({
    data: {
        creditA: 0,
        creditB: 0,

        userA: '',
        userB: '',
        date: '',

        days: 0,
        sentences: ["你在哪里，家就在哪里","牵了手就不能松开了，这是我们的约定","我最喜欢的一个词，叫“我们”","世界从来不会辜负可爱的人，而我们如此可爱","我能做的不多，但你需要的时候，我总是在的","自从我们相遇的那一刻，你是我白天黑夜不落的星","愿未来所有好时光都有你相伴","只希望，我们都不要收敛对彼此的爱意"],
        lenOfSentences: 0,

        studyMissions: [],
        slideButtons: [
          {extClass: 'markBtn', text: '标记', src: "Images/icon_mark.svg"},
          {extClass: 'removeBtn', text: '删除', src: 'Images/icon_del.svg'}
        ],
    },

    async onShow(){
      await wx.cloud.callFunction({name: 'getList', data: {list: getApp().globalData.collectionStudyList}}).then(data => {
        this.setData({studyMissions: data.result.data})
        // this.filterMission()
        this.getScreenSize()
      })
        this.setData({
            userA: getApp().globalData.userA,
            userB: getApp().globalData.userB,
            lenOfSentences: this.data.sentences.length,
            date: getApp().globalData.date,     
        })
        this.getCredit()
        // this.getCreditB()
        this.getDays()
    },

    getCreditA(){
        wx.cloud.callFunction({name: 'ggetList', data: {list: getApp().globalData.collectionUserList, _openid: getApp().globalData._openidB}})
        .then(res => {
          this.setData({creditA: res.result.data[0].credit})
        })
    },
    
    getCreditB(){
        wx.cloud.callFunction({name: 'getList', data: {list: getApp().globalData.collectionUserList, _openid: getApp().globalData._openidB}})
        .then(res => {
            this.setData({creditB: res.result.data[1].credit})
        })
    },

    getCredit(){
        wx.cloud.callFunction({name: 'getList', data: {list: getApp().globalData.collectionUserList, _openid: getApp().globalData._openidB}})
        .then(res => {
            this.setData({creditA: res.result.data[0].credit, creditB: res.result.data[1].credit})
        })
    },

    getDays(){
        var date1= this.data.date;  //开始时间
        var date2 = new Date();    //结束时间
        var date3 = date2.getTime() - new Date(date1).getTime();   //时间差的毫秒数      
        //计算出相差天数
        this.setData({
            days: Math.floor(date3/(24*3600*1000))
        })
    },


  //获取页面大小
  async getScreenSize(){
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          screenWidth: res.windowWidth,
          screenHeight: res.windowHeight
        })
      }
    })
  },
  //转到添加任务
  async toAddPage(){
    wx.navigateTo({url: '../StudyAdd/index'})
  },


      //响应左划按钮事件逻辑
  async slideButton(element){
    //得到UI序号
    const {index} = element.detail

    //根据序号获得任务
    const missionIndex = element.currentTarget.dataset.index
    const mission = this.data.studyMissions[missionIndex]

    await wx.cloud.callFunction({name: 'getOpenId'}).then(async openid => {
        //处理完成点击事件
        if (index === 0) {
            if(mission.available) {
                this.finishMission(element)
            }else{
                wx.showToast({
                    title: '任务已经完成',
                    icon: 'error',
                    duration: 2000
                })
            }

        }else  if (index === 1) {      //处理删除按钮点击事件
                wx.cloud.callFunction({name: 'deleteElement', data: {_id: mission._id, list: getApp().globalData.collectionStudyList}})
                //更新本地数据
                this.data.studyMissions.splice(missionIndex, 1)
            }

            //触发显示更新
            this.setData({studyMissions: this.data.studyMissions})
    })
  },

  //转到任务详情
  async toDetailPage(element) {
    const missionIndex = element.currentTarget.dataset.index
    const mission = this.data.studyMissions[missionIndex]
    wx.navigateTo({url: '../MissionDetail/index?id=' + mission._id})
  },

    //完成任务
    async finishMission(element) {
      //根据序号获得触发切换事件的待办
      const missionIndex = element.currentTarget.dataset.index
      const mission = this.data.studyMissions[missionIndex]
  
      await wx.cloud.callFunction({name: 'getOpenId'}).then(async openid => {
        if(mission._openid === openid.result){
          //完成对方任务，奖金打入对方账号
          wx.cloud.callFunction({name: 'editAvailable', data: {_id: mission._id, value: false, list: getApp().globalData.collectionStudyList}})
          wx.cloud.callFunction({name: 'editFinish', data: {_id: mission._id, value: "完成", list: getApp().globalData.collectionStudyList}})
          wx.cloud.callFunction({name: 'editCredit', data: {_openid: mission._openid, value: mission.credit, list: getApp().globalData.collectionUserList}})
  
          //触发显示更新
          mission.available = false
          this.setData({studyMissions: this.data.studyMissions})
          getCredit()
          
  
          //显示提示
          wx.showToast({
              title: '任务完成',
              icon: 'success',
              duration: 2000
          })
          
  
        }else{
          wx.showToast({
            title: '不能帮助完成任务',
            icon: 'error',
            duration: 2000
          })
        }
      })
    },
})