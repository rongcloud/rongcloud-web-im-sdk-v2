module RongIMLib {
    export class DBUtil {
        private db: any;
        userId: string;
        //RongIMClint.init 时候执行，传入当前登录人的Id
        init(userId: string): boolean {
            var me = this, isInit = false;
            me.userId = userId;
            me.db = openDatabase("RongIMLibDB", "1.0", "RongIMLibDB", 10 * 1024 * 1024);
            if (me.db) {
                isInit = true;
                var converSql: string = "create table if not exists t_conversation_" + userId + " (conversationType,targetId,content,sentTime,isTop)";
                var messageSql: string = "create table if not exists t_message_" + userId + " (id integer not null primary key autoincrement,messageType,messageUId,conversationType,targetId,sentTime,content,localMsg)";
                me.execUpdate(converSql);
                me.execUpdate(messageSql);
            }
            return isInit;
        }

        execSearchByParams(sql: string, values: any[], callback: any) {
            this.db.transaction(function(tx: any) {
                tx.executeSql(sql, values, function(tx: any, results: any) {
                    callback(results.rows,results.rowsAffected);
                }, function(tx: any,results:any) {
                    throw new Error("{errorCode:" + results.code + ",content:" + results.message + "}");
                });
            });
        }

        execSearch(sql: string, callback: any) {
            this.db.transaction(function(tx: any) {
                tx.executeSql(sql, [],function(tx: any, results: any) {
                    callback(results.rows,results.rowsAffected);
                }, function(tx: any, result: any) {
                    throw new Error("{errorCode:" + result.code + ",content:" + result.message + "}");
                });
            });
        }

        execUpdateByParams(sql: string, values: any[]) {
            this.db.transaction(function(tx: any) {
                tx.executeSql(sql, values);
            }, function(tx: any, result: any) {
                throw new Error("{errorCode:" + tx.code + ",content:" + tx.message + "}");
            });
        }
        execUpdate(sql: string) {
            this.db.transaction(function(tx: any) {
                tx.executeSql(sql);
            }, function(tx: any, result: any) {
                throw new Error("{errorCode:" + tx.code + ",content:" + tx.message + "}");
            });
        }
    }
}
