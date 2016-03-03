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
                var converSql: string = "CREATE TABLE IF NOT EXISTS T_CONVERSATION_" + userId + " (CONVERSATIONTYPE,TARGETID,CONTENT,SENTTIME,ISTOP)";
                var messageSql: string = "CREATE TABLE IF NOT EXISTS T_MESSAGE_" + userId + " (ID INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,MESSAGETYPE,MESSAGEUID,CONVERSATIONTYPE,TARGETID,SENTTIME,CONTENT,LOCALMSG)";
                me.execUpdate(converSql);
                me.execUpdate(messageSql);
            }
            return isInit;
        }

        execSearchByParams(sql: string, values: string[], callback: any) {
            this.db.transaction(function(tx: any) {
                tx.executeSql(sql, values, function(tx: any, results: any) {
                    callback(results.rows);
                });
            });
        }

        execSearch(sql: string, callback: any) {
            this.db.trasaction(function(tx: any) {
                tx.executeSql(sql, function(tx: any, results: any) {
                    callback(results.rows);
                });
            });
        }

        execUpdateByParams(sql: string, values: any[]) {
            this.db.transaction(function(tx: any) {
                tx.executeSql(sql, values);
            });
        }
        execUpdate(sql: string) {
            this.db.transaction(function(tx: any) {
                tx.executeSql(sql);
            });
        }
    }
}
