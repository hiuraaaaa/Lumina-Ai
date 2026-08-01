// components/DebugOverlay.tsx
// Hapus komponen ini setelah selesai debug!
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  Modal, StyleSheet, Dimensions,
} from 'react-native';

const { width, height } = Dimensions.get('window');

type LogEntry = {
  id: number;
  level: 'log' | 'warn' | 'error' | 'info';
  msg: string;
  time: string;
};

let logs: LogEntry[] = [];
let listeners: ((logs: LogEntry[]) => void)[] = [];
let idCounter = 0;

const addLog = (level: LogEntry['level'], ...args: any[]) => {
  const msg = args.map(a => {
    try { return typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a); }
    catch { return String(a); }
  }).join(' ');
  const entry: LogEntry = {
    id: idCounter++,
    level,
    msg,
    time: new Date().toTimeString().slice(0, 8),
  };
  logs = [entry, ...logs].slice(0, 100); // keep last 100
  listeners.forEach(fn => fn([...logs]));
};

// Patch console
const _log   = console.log;
const _warn  = console.warn;
const _error = console.error;
const _info  = console.info;

console.log   = (...a) => { _log(...a);   addLog('log', ...a); };
console.warn  = (...a) => { _warn(...a);  addLog('warn', ...a); };
console.error = (...a) => { _error(...a); addLog('error', ...a); };
console.info  = (...a) => { _info(...a);  addLog('info', ...a); };

// Global error catcher
const origHandler = ErrorUtils.getGlobalHandler();
ErrorUtils.setGlobalHandler((err, isFatal) => {
  addLog('error', `[${isFatal ? 'FATAL' : 'ERROR'}] ${err?.message}\n${err?.stack}`);
  origHandler?.(err, isFatal);
});

const COLOR: Record<LogEntry['level'], string> = {
  log:   '#ffffff',
  info:  '#4a9eff',
  warn:  '#F6CF80',
  error: '#e63946',
};

export default function DebugOverlay() {
  const [visible, setVisible] = useState(false);
  const [entries, setEntries] = useState<LogEntry[]>([...logs]);
  const [filter, setFilter] = useState<LogEntry['level'] | 'all'>('all');

  useEffect(() => {
    const fn = (l: LogEntry[]) => setEntries([...l]);
    listeners.push(fn);
    return () => { listeners = listeners.filter(x => x !== fn); };
  }, []);

  const filtered = filter === 'all' ? entries : entries.filter(e => e.level === filter);

  return (
    <>
      {/* Floating button */}
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={{
          position: 'absolute',
          bottom: 100,
          left: 16,
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: '#e63946',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          elevation: 10,
          shadowColor: '#000',
          shadowOpacity: 0.4,
          shadowRadius: 8,
        }}
      >
        <Text style={{ color: '#fff', fontSize: 18, fontWeight: '900' }}>D</Text>
        {entries.some(e => e.level === 'error') && (
          <View style={{
            position: 'absolute', top: 0, right: 0,
            width: 12, height: 12, borderRadius: 6,
            backgroundColor: '#F6CF80',
          }} />
        )}
      </TouchableOpacity>

      <Modal visible={visible} animationType="slide" transparent onRequestClose={() => setVisible(false)}>
        <View style={{
          flex: 1, backgroundColor: 'rgba(0,0,0,0.95)',
          paddingTop: 48,
        }}>
          {/* Header */}
          <View style={{
            flexDirection: 'row', alignItems: 'center',
            paddingHorizontal: 12, paddingBottom: 10,
            borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)',
            gap: 8,
          }}>
            <Text style={{ color: '#fff', fontWeight: '900', fontSize: 14, flex: 1 }}>
              Debug Log ({filtered.length})
            </Text>
            {(['all', 'error', 'warn', 'log'] as const).map(f => (
              <TouchableOpacity
                key={f}
                onPress={() => setFilter(f)}
                style={{
                  paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
                  backgroundColor: filter === f ? '#F6CF80' : 'rgba(255,255,255,0.1)',
                }}
              >
                <Text style={{
                  color: filter === f ? '#000' : '#fff',
                  fontSize: 10, fontWeight: '700',
                }}>
                  {f.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => { logs = []; setEntries([]); }}
              style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: 'rgba(230,57,70,0.3)' }}
            >
              <Text style={{ color: '#e63946', fontSize: 10, fontWeight: '700' }}>CLR</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setVisible(false)}
              style={{ paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.1)' }}
            >
              <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Logs */}
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 10, gap: 4 }}>
            {filtered.length === 0 ? (
              <Text style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: 40 }}>
                Tidak ada log
              </Text>
            ) : filtered.map(e => (
              <View key={e.id} style={{
                backgroundColor: `${COLOR[e.level]}10`,
                borderLeftWidth: 3, borderLeftColor: COLOR[e.level],
                borderRadius: 4, padding: 8, marginBottom: 4,
              }}>
                <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 9, marginBottom: 2 }}>
                  {e.time} [{e.level.toUpperCase()}]
                </Text>
                <Text style={{ color: COLOR[e.level], fontSize: 11, fontFamily: 'monospace' }}>
                  {e.msg}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

