module RongIMLib {
    /**
     * 工具类
     */
    export class MessageUtil {
        ArrayForm(typearray: any): Array<any> {
            if (Object.prototype.toString.call(typearray) == "[object ArrayBuffer]") {
                var arr = new Uint8Array(typearray);
                return [].splice.call(arr);
            }
            return typearray;
        }
    }
    
}
