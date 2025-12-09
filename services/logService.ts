export interface LogEntry {
    id: string;
    timestamp: Date;
    level: 'info' | 'warn' | 'error';
    message: string;
    data?: any;
}

type LogListener = (logs: LogEntry[]) => void;

class LogService {
    private logs: LogEntry[] = [];
    private listeners: LogListener[] = [];

    log(message: string, data?: any) {
        this.addLog('info', message, data);
    }

    warn(message: string, data?: any) {
        this.addLog('warn', message, data);
    }

    error(message: string, data?: any) {
        this.addLog('error', message, data);
    }

    private addLog(level: 'info' | 'warn' | 'error', message: string, data?: any) {
        const entry: LogEntry = {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date(),
            level,
            message,
            data
        };
        this.logs = [entry, ...this.logs].slice(0, 100); // Keep last 100 logs
        this.notifyListeners();

        // Also log to console
        const consoleMethod = level === 'info' ? console.log : level === 'warn' ? console.warn : console.error;
        if (data) consoleMethod(`[${level.toUpperCase()}] ${message}`, data);
        else consoleMethod(`[${level.toUpperCase()}] ${message}`);
    }

    subscribe(listener: LogListener) {
        this.listeners.push(listener);
        listener(this.logs);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    private notifyListeners() {
        this.listeners.forEach(l => l(this.logs));
    }

    getLogs() {
        return this.logs;
    }

    clear() {
        this.logs = [];
        this.notifyListeners();
    }
}

export const logService = new LogService();
