# describe 'Utils Test',->
#   it 'MessageUtil-ArrayForm 应该返回[object Array]类型',->
#     abuf = new ArrayBuffer 32
#     typearray = new RongIMLib.MessageUtil().ArrayForm(abuf)
#     expect(Object::toString.call(typearray)).toEqual('[object Array]')
#
