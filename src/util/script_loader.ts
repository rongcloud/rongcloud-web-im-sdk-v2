module RongIMLib {
  class ScriptLoader {
    load(src: string, onLoad?: any, onError?: any): void {
      var scriptElement = document.createElement("script");

      scriptElement.async = true;

      if (onLoad) { scriptElement.onload = onLoad; }
      if (onLoad) { scriptElement.onerror = onError; }

      (document.head || document.getElementsByTagName("head")[0]).appendChild(scriptElement);

      scriptElement.src = src;
    }
  }
}
