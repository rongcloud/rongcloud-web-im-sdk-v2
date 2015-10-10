module RongIMLib {
  class HttpClient {
    post(url: string, headers: any, callback: HttpRequestCallback): void {
      this.request("POST", url, headers, callback);
    }

    get(url: string, headers:any, callback: HttpRequestCallback): void {
      this.request("GET", url, headers, callback);
    }

    request(method: string, url: string, headers: any, callback: HttpRequestCallback): void {
      var xhr: any = this.getXHR();
      xhr.get(method, url);
      xhr.send()
    }

    getXHR(): any {
      if (XMLHttpRequest) {
        return new XMLHttpRequest;
      } else {
        try { return new ActiveXObject("Microsoft.XMLHTTP"); } catch (e) {
          // Nothing to do.
        }
      }

      return null;
    }
  }

  class HttpResponse {

  }

  interface HttpRequestCallback {
    (response: HttpResponse): void;
  }
}
