module RongIMLib {
	export class Upload{



		static getFileInfo(){

		}

		static defineUpload(){

		}
		
		/**
		* 不支持 HTML5 的情况，需要自定义 base64 转换方法
		* 把 base64 放置 callback 中返回
		*/
		static converToBase64(file:any,callback:Function){

		}

		/**
		* data.base64 base64 必填
		* data.url 为空使用默认 post url
		*/
		postBase64(data:any,callback:Function){

		}

	}
}