// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ // 初始化云开发环境
  env: cloud.DYNAMIC_CURRENT_ENV // 当前环境的常量
})
const db = cloud.database()
const deleteOver = async (_list, _days) => {
  _list.forEach(element => {
    console.log(element)
  })
}

exports.main = async (event, context) => {
  console.log(db.collection('StudyList').get())
}