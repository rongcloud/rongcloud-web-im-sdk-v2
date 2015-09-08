module RongIMLib {
  export interface StorageProvider {
    setObject(object: any, composedKey: ComposeKeyFunc): void;
    getObject(composedKey: ComposeKeyFunc): void;
    removeObject(composedKey: ComposeKeyFunc): void;
    onOutOfQuota(current_max_size: number): void;
    getDataAccessProvider(): DataAccessProvider;
  }

  export interface ComposeKeyFunc {
    (object: any): string;
  }
}
