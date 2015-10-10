describe 'Utils Test',->
  it 'MessageUtil-ArrayForm 应该返回[object Array]类型',->
    abuf = new ArrayBuffer 32
    typearray = new RongIMLib.MessageUtil().ArrayForm(abuf)
    expect(Object::toString.call(typearray)).toEqual('[object Array]')
  it 'MessageUtil-ArrayForm 返回变量类型应该与传入相同',->
    arr = new Array();
    vals = new RongIMLib.MessageUtil().ArrayForm arr;
    expect(Object::toString.call(arr)).toEqual Object::toString.call vals

describe 'signalling-BaseMessage Test',->
  it "_name必须等于BaseMessage",->
    baseMesage = new RongIMLib.BaseMessage new RongIMLib.Header
    expect(baseMesage._name).toEqual 'BaseMessage'

describe 'signalling-ConnectMessage Test',->

  it "connectMessage创建之后 BaseMesage 中的ConnectMessage不能是undefined",->
    connectMessage = new RongIMLib.ConnectMessage new RongIMLib.Header
    baseMesage = new RongIMLib.BaseMessage new RongIMLib.Header
    expect(baseMesage.ConnectMessage).not.toBeUndefined()

  it "_name必须等于ConnectMessage",->
    connectMessage = new RongIMLib.ConnectMessage new RongIMLib.Header
    expect(connectMessage._name).toEqual 'ConnectMessage'
