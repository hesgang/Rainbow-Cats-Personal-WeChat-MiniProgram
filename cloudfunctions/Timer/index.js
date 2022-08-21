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
    if(event.TriggerName == "deleteTrigger"){
        // 删除完成后得学习任务
        db.collection('StudyList').where({
            available: false //false完成
            }).remove()

        

    }
    // 删除超过七天的已经完成的任务
    if(event.TriggerName == "deleteTrigger"){
        var nowDate = new Date();
        var _list = await db.collection('MissionList').where({
            available: false //false完成
            }).get()
        _list = _list.data
        for(i=0;i<_list.length;i++){
            var delayDate = nowDate.getTime() - new Date(_list[i].date).getTime();   //时间差的毫秒数 
            var dateDays = Math.ceil(delayDate/(24*3600*1000)); //计算出相差天数，并向上取整
            if(dateDays > 7){
                // return dateDays
                await db.collection('MissionList').where({
                    _id: _list[i]._id
                  }).remove()
            }
        }
    }
    return event
    
    // return await db.collection('StudyList').where({
    //     available: false
    //   }).get()
}