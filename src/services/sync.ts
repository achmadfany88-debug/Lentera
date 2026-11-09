/**
 * Real-Time Cross-Device / Cross-Tab Synchronization Service
 * Utilizes standard BroadcastChannel API + Web Push Notification API
 */

export type SyncEventType = 
  | 'USER_UPDATED'
  | 'PMK_DATA_SYNCED'
  | 'CACHE_INVALIDATED'
  | 'PUSH_NOTIFICATION_BROADCAST'
  | 'HEARTBEAT';

export interface SyncMessage {
  type: SyncEventType;
  senderId: string;
  timestamp: number;
  payload?: any;
}

type SyncListener = (msg: SyncMessage) => void;

class RealtimeSyncEngine {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<SyncListener> = new Set();
  private clientId = `client-${Math.random().toString(36).substring(2, 9)}`;
  private isOnline = navigator.onLine;
  private lastSyncedTime = Date.now();
  private isSyncing = false;

  constructor() {
    this.initChannel();
    this.setupNetworkListeners();
  }

  private initChannel() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('lentera_realtime_sync_v1');
        this.channel.onmessage = (event: MessageEvent<SyncMessage>) => {
          this.handleIncomingMessage(event.data);
        };
      } catch (err) {
        console.warn('[SyncEngine] BroadcastChannel error, using fallback:', err);
      }
    }
  }

  private setupNetworkListeners() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.isOnline = true;
        this.broadcast({
          type: 'HEARTBEAT',
          timestamp: Date.now(),
          payload: { status: 'reconnected' }
        });
      });
      window.addEventListener('offline', () => {
        this.isOnline = false;
      });
    }
  }

  private handleIncomingMessage(msg: SyncMessage) {
    if (msg.senderId === this.clientId) return; // Don't echo self
    this.lastSyncedTime = Date.now();
    this.listeners.forEach(fn => fn(msg));
  }

  public subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  public broadcast(message: Omit<SyncMessage, 'senderId'>): void {
    const fullMsg: SyncMessage = {
      ...message,
      senderId: this.clientId,
    };
    this.lastSyncedTime = Date.now();

    if (this.channel) {
      try {
        this.channel.postMessage(fullMsg);
      } catch (e) {
        console.error('[SyncEngine] Broadcast send error:', e);
      }
    }

    // Also notify local listeners
    this.listeners.forEach(fn => fn(fullMsg));
  }

  public async triggerManualSync(): Promise<{ success: boolean; durationMs: number }> {
    this.isSyncing = true;
    const start = performance.now();
    
    // Simulate lightweight server-side handshake / synchronization query
    await new Promise(resolve => setTimeout(resolve, 350));
    
    this.broadcast({
      type: 'PMK_DATA_SYNCED',
      timestamp: Date.now(),
      payload: { source: 'manual_refresh' }
    });

    this.isSyncing = false;
    this.lastSyncedTime = Date.now();
    const durationMs = Math.round(performance.now() - start);
    return { success: true, durationMs };
  }

  public getStatus() {
    return {
      isOnline: this.isOnline,
      isSyncing: this.isSyncing,
      lastSyncedTime: this.lastSyncedTime,
      clientId: this.clientId,
    };
  }

  /**
   * Request Web Push Notification Permission and trigger notification
   */
  public async requestNotificationPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      return 'denied';
    }
    if (Notification.permission === 'granted') {
      return 'granted';
    }
    return await Notification.requestPermission();
  }

  public sendPushNotification(title: string, options?: NotificationOptions) {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          ...options,
        });
      } catch {
        // Fallback handled by in-app toast
      }
    }
  }
}

export const syncEngine = new RealtimeSyncEngine();
