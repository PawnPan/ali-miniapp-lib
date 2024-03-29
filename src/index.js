import cloud from "@tbmp/mp-cloud-sdk";

export function checkFollow(uid) {
  return new Promise((resolve) => {
    my.tb.checkShopFavoredStatus({
      id: uid,
      success: (res) => {
        resolve(res);
      },
      fail: (res) => {
        throw res;
      },
    });
  });
}

export function doFollow(uid) {
  return new Promise((resolve, reject) => {
    my.tb.favorShop({
      id: uid,
      success: (res) => resolve(res),
      fail: reject,
    });
  });
}

function doAuth() {
  return new Promise((resolve, reject) => {
    my.showLoading({ content: "呼起授权中..." });
    my.authorize({
      scopes: "scope.userInfo",
      success: (res) => {
        console.log("auth success, ", res);
        resolve(res);
      },
      fail: (res) => {
        console.log("auth failed, ", res);
        reject(res);
      },
      complete: (res) => {
        my.hideLoading();
        console.log("auth complete. ", res);
      },
    });
  });
}

export async function getAuthUserInfo() {
  const auth = await doAuth();
  return new Promise((resolve, reject) => {
    my.getAuthUserInfo({
      success: (res) => {
        console.log("load user info success, ", res);
        resolve(res);
      },
      fail: (res) => {
        console.log("get auth user info failed. ", res);
        reject(res);
      },
    });
  });
}

export function addCartItem(iid) {
  return new Promise((resolve, reject) => {
    const param = {
      itemId: iid,
      success: (res) => {
        if (res.skuCloseFrom === "closeBtn" || res.skuCloseFrom === "") {
          reject();
        } else {
          resolve();
        }
      },
      fail: reject,
    };
    my.tb.showSku(param);
  });
}

export function favorItem(iid) {
  return new Promise((resolve, reject) => {
    const params = {
      id: +iid,
      success: resolve,
      fail: reject,
    };
    my.tb.collectGoods(params);
  });
}

export function openShop(sid) {
  const url = "https://shop" + sid + ".taobao.com/";
  my.call("navigateToOutside", {
    url,
  });
}

export function doShare() {
  my.showSharePanel();
}

export function openItem(itemId) {
  my.tb.openDetail({
    itemId: itemId + "",
  });
}

export class HttpRequest {
  headers = {};
  constructor(cloudId, initParam, headers) {
    const param = initParam || {
      env: "test",
    };

    cloud.init(param);
    this.cloud = cloud;

    if (cloudId) {
      this.cloudId = cloudId;
    }
    this.headers = headers;
  }

  async request(params) {
    const config = Object.assign({}, params);
    if (this.cloudId) {
      config["exts"] = { cloudAppId: this.cloudId };
    }
    if (config.headers) {
      config.headers = Object.assign(this.headers, config.headers);
    } else {
      config.headers = this.headers;
    }

    console.log("application.httpRequest config: ", config);

    return this.cloud.application.httpRequest(config);
  }

  async get(path, params, headers) {
    const config = {
      path,
      method: "GET",
      params,
    };
    if (headers) {
      config["headers"] = headers;
    }
    return this.request(config);
  }

  // content type 会被强制重写成applicaton/json，
  async post(path, params, headers) {
    const config = {
      path,
      method: "POST",
      params,
      headers: Object.assign({}, headers, {
        "Content-Type": "application/json",
      }),
    };
    return this.request(config);
  }
}
