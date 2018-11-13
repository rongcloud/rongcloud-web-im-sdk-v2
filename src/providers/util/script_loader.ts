module RongIMLib {
  class ScriptLoader {
    load(src: string, onLoad?: ScriptLoaderCallback, onError?: ScriptLoaderCallback): void {
      var script: any = document.createElement("script");

      script.async = true;

      if (onLoad) {
        if (script.addEventListener) {
          script.addEventListener("load", function(event: Event): any {
            var target: any = event.target || event.srcElement;
            onLoad(target.src);
          }, false);
        } else if (script.readyState) {
          script.onreadystatechange = function(event: Event) {
            var target: any = event.srcElement;
            onLoad(target.src);
          };
        }
      }

      if (onError) {
        script.onerror = function(event: ErrorEvent): any {
          var target: any = event.target || event.srcElement;
          onError(target.src);
        };
      }

      (document.head || document.getElementsByTagName("head")[0]).appendChild(script);

      script.src = src;
    }
  }

  interface ScriptLoaderCallback {
    (src: string): void;
  }
}
