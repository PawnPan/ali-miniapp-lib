import cloud from "@tbmp/mp-cloud-sdk"

export function checkFollow (uid) {
  return new Promise(resolve => {
    my.tb.checkShopFavoredStatus({
      id: uid,
      success: res => {
        resolve(res)
      },
      fail: res => {
        throw res
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
    console.log("before auth")
    my.authorize({
      scopes: 'scope.userInfo',
      success: res => {
        console.log('auth success, ', res)
        resolve(res)
      },
      fail: res => {
        console.log('auth failed, ', res)
      },
      complete: res => {
        console.log("auth complete. ", res)
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

export function openItem(itemId) {
  my.tb.openDetail({
    itemId,
  })
}

export class HttpRequest {
  constructor (cloudId, initParam) {
    const param = initParam || {
      env: 'test'
    }

    cloud.init(param)
    this.cloud = cloud

    if (cloudId) {
      this.cloudId = cloudId
    }
  }

  async request (params) {
    const config = Object.assign({}, params)
    if (this.cloudId) {
      config['exts'] = { cloudAppId: this.cloudId }
    }

    console.log('application.httpRequest config: ', config)

    return this.cloud.application.httpRequest(config)
  }

  async get (path, params, headers) {
    const config = {
      path,
      method: 'GET',
      params
    }
    if (headers) {
      config['headers'] = headers
    }
    return this.request(config)
  }

  // content type 会被强制重写成applicaton/json，
  async post (path, params, headers) {
    const config = {
      path,
      method: 'POST',
      params,
      headers: Object.assign(
        {},
        headers, 
        {
          'Content-Type': 'application/json'
        }
      )
    }
    return this.request(config)
  }
}
