// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ // 初始化云开发环境
  env: cloud.DYNAMIC_CURRENT_ENV // 当前环境的常量
})
const db = cloud.database()
var date2 = new Date();
// const deleteOver = async (_list, _days) => {
    
//     _list.forEach(element => {
//       if(new Date(element.date).getTime() == date2.getTime()){
//         db.collection('StudyList').where({
//             _id: element._id
//           }).remove()
//       }
//       })
// }

exports.main = async (event, context) => {
    await db.collection('StudyList').get().data.forEach(element => {
        if(new Date(element.date).getTime() == date2.getTime()){
          db.collection('StudyList').where({
              _id: element._id
            }).remove()
        }
    })
}