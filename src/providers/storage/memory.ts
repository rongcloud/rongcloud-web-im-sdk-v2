// module RongIMLib {
//     export class MemoryProvider implements StorageProvider {
//         /**
//          * 存放变量仓库
//          */
//         private memoryDepot: { [s: string]: any } = {};
//
//         setItem(composedKey: string, object: any): void {
//             this.memoryDepot[composedKey] = object;
//         }
//
//         getItem(composedKey: string): any {
//             return this.memoryDepot[composedKey];
//         }
//
//         removeItem(composedKey: string): void {
//             delete this.memoryDepot[composedKey];
//         }
//
//         clearItem(): void {
//             var me = this;
//             for (var key in me.memoryDepot) {
//                 delete me.memoryDepot[key];
//             }
//         }
//         getKeys(regStr: string, isUseDef?: boolean): string[] {
//             var keys: string[], regExp = !isUseDef ? new RegExp(regStr + "_[0-9]") : new RegExp(regStr);
//             for (var k in this.memoryDepot) {
//                 if (regExp.test(k)) {
//                     keys.push(k);
//                 }
//             }
//             return keys;
//         }
//         getMsgKeys(regStr: string, isUseDef?: boolean): string[] {
//             return null;
//         }
//         onOutOfQuota(): number {
//             return 0;
//         }
//     }
// }
