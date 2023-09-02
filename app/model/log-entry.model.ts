import { Schema, model } from 'mongoose';
import { LogEntry } from '../types/log-entry.js';

const schema = new Schema<LogEntry>({
    serverName: {
        type: String,
        required: true,
        index: true
    },
    ipAddress: {
        type: String,
        required: true,
        index: true
    },
    user: {
        type: String
    },
    datetime: {
        type: Date,
        required: true,
    },
    method: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
        index: true
    },
    protocol: {
        type: String,
        required: true,
    },
    status: {
        type: Number,
        required: true,
    },
    bytesSent: {
        type: Number,
        required: true,
    },
    referer: {
        type: String,
    },
    userAgent: {
        type: String,
        index: true
    }
});

export const LogEntryModel = model<LogEntry>('LogEntry', schema);
