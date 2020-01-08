export function checkFollow (uid) {
  return new Promise(resolve => {
    my.tb.checkShopFavoredStatus({
      id: uid,
      success: res => {
        resolve(res)
      }
    })
  })
}

export function doFollow (uid) {
  return new Promise(resolve => {
    my.tb.favorShop({
      id: uid,
      success: res => resolve(res)
    })
  })
}

function doAuth () {
  return new Promise(resolve => {
    my.authorize({
      scopes: 'scope.userInfo',
      success: res => {
        console.log('auth success, ', res)
        resolve(res)
      },
      fail: res => {
        console.log('auth failed, ', res)
      }
    })
  })
}

export async function getAuthUserInfo () {
  const auth = await doAuth()
  return new Promise(resolve => {
    my.getAuthUserInfo({
      success: res => {
        console.log('load user info success, ', res)
        resolve(res)
      },
      fail: res => {
        console.log('get auth user info failed. ', res)
      }
    })
  })
}

export function openShop (sid) {
  const url = 'https://shop' + sid + '.taobao.com/'
  my.call(
    'navigateToOutside',
    {
      url
    },
    res => {
      my.alert({ content: 'success - ' + JSON.stringify(res) })
    }
  )
}

export function doShare () {
  my.showSharePanel()
}
