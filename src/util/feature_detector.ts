module RongIMLib {
  class FeatureDectector {
    supportWebSocket(): boolean {
      return true;
    }

    supportXHRPolling(): boolean {
      return true;
    }

    supportIndexedDB(): boolean {
      return true;
    }

    supportWebStorage(): boolean {
      return true;
    }

    supportWebNotification(): boolean {
      return true;
    }

    isCookieEnabled(): boolean {
      return true;
    }
  }
}
