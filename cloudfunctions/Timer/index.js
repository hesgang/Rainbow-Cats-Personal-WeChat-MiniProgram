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
    // 检查任务是否完成
    if(event.TriggerName == "creditTrigger"){
        var AA = await db.collection('StudyList').where({
                available: true //true未完成
              }).get()
        await db.collection('UserList').where({
            _openid: 'oPx795EpVWVW8GgLxowWc7JYTeL0'
        }).update({
            data: {
                credit: db.command.inc(-2*AA.data.length)
            }
        })
    }
    if(event.TriggerName == "deleteStudyTrigger"){
        db.collection('StudyList').where({
            available: false //false完成
            }).remove()
    }
    return event
    
    // return await db.collection('StudyList').where({
    //     available: false
    //   }).get()
}