describe 'Util',->
  it 'CookieProvider-setItem',->
    provider = new RongIMLib.CookieProvider()
    provider.setItem "rongSDK01","testVal"
    provider.setItem "rongSDK02","rongItemVal"
    provider.setItem "naviTest01","naviTestVal"
  it 'CookieProvider-getItem',->
    provider = new RongIMLib.CookieProvider()
    val = provider.getItem "rongSDK01"
    console.log val
  it 'CookieProvider-getItemKey',->
    provider = new RongIMLib.CookieProvider()
    keys = provider.getItemKey  "navi"
    console.log keys
  it 'CookieProvider-onOutOfQuota ',->
    provider = new RongIMLib.CookieProvider()
    quota = provider.onOutOfQuota()
    console.log quota
  it 'CookieProvider-removeItem ',(done)->
    setTimeout(->
      provider = new RongIMLib.CookieProvider()
      provider.removeItem  "rongSDK"
      done()
    ,750)
  it 'CookieProvider-clearItem  ',(done)->
    setTimeout(->
      provider = new RongIMLib.CookieProvider()
      provider.clearItem
      done()
    ,850)
