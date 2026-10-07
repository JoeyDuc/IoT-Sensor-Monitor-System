import dayjs from 'dayjs';

function makeRecord(id, user, device, action, status, timeStr) {
  const ts = dayjs(timeStr, 'DD/MM/YYYY HH:mm:ss');
  return {
    id,
    user,
    device,
    action,   // TURN_ON | TURN_OFF
    status,   // SUCCESS | FAILED
    time: ts.format('DD/MM/YYYY HH:mm:ss'),
    timestamp: ts.valueOf(),
  };
}

export const historyData = [
  makeRecord('h-001', 'admin',  'Đèn LED 1 (Nhiệt độ)', 'TURN_ON',  'SUCCESS', '18/08/2026 18:20:30'),
  makeRecord('h-002', 'admin',  'Đèn LED 1 (Nhiệt độ)', 'TURN_OFF', 'SUCCESS', '18/08/2026 18:25:10'),
  makeRecord('h-003', 'admin',  'Đèn LED 2 (Độ ẩm)',    'TURN_ON',  'FAILED',  '18/08/2026 18:30:42'),
  makeRecord('h-004', 'user01', 'Đèn LED 3 (Ánh sáng)', 'TURN_ON',  'SUCCESS', '18/08/2026 18:35:15'),
  makeRecord('h-005', 'user01', 'Đèn LED 3 (Ánh sáng)', 'TURN_OFF', 'SUCCESS', '18/08/2026 18:40:00'),
  makeRecord('h-006', 'admin',  'Đèn LED 2 (Độ ẩm)',    'TURN_ON',  'SUCCESS', '18/08/2026 19:00:00'),
  makeRecord('h-007', 'admin',  'Đèn LED 2 (Độ ẩm)',    'TURN_OFF', 'SUCCESS', '18/08/2026 19:30:00'),
  makeRecord('h-008', 'user02', 'Đèn LED 1 (Nhiệt độ)', 'TURN_ON',  'SUCCESS', '17/08/2026 08:10:05'),
  makeRecord('h-009', 'user02', 'Đèn LED 1 (Nhiệt độ)', 'TURN_OFF', 'FAILED',  '17/08/2026 08:15:22'),
  makeRecord('h-010', 'admin',  'Đèn LED 3 (Ánh sáng)', 'TURN_ON',  'SUCCESS', '17/08/2026 09:00:00'),
  makeRecord('h-011', 'admin',  'Đèn LED 3 (Ánh sáng)', 'TURN_OFF', 'SUCCESS', '17/08/2026 12:00:00'),
  makeRecord('h-012', 'user01', 'Đèn LED 2 (Độ ẩm)',    'TURN_ON',  'SUCCESS', '17/08/2026 20:00:00'),
  makeRecord('h-013', 'user01', 'Đèn LED 2 (Độ ẩm)',    'TURN_OFF', 'SUCCESS', '17/08/2026 23:00:00'),
  makeRecord('h-014', 'admin',  'Đèn LED 1 (Nhiệt độ)', 'TURN_ON',  'SUCCESS', '16/08/2026 07:30:00'),
  makeRecord('h-015', 'admin',  'Đèn LED 1 (Nhiệt độ)', 'TURN_OFF', 'SUCCESS', '16/08/2026 11:00:00'),
  makeRecord('h-016', 'user02', 'Đèn LED 3 (Ánh sáng)', 'TURN_ON',  'FAILED',  '16/08/2026 13:00:00'),
  makeRecord('h-017', 'user02', 'Đèn LED 3 (Ánh sáng)', 'TURN_ON',  'SUCCESS', '16/08/2026 13:05:00'),
  makeRecord('h-018', 'admin',  'Đèn LED 2 (Độ ẩm)',    'TURN_ON',  'SUCCESS', '15/08/2026 18:00:00'),
  makeRecord('h-019', 'admin',  'Đèn LED 2 (Độ ẩm)',    'TURN_OFF', 'SUCCESS', '15/08/2026 23:30:00'),
  makeRecord('h-020', 'user01', 'Đèn LED 1 (Nhiệt độ)', 'TURN_ON',  'SUCCESS', '15/08/2026 19:00:00'),
  makeRecord('h-021', 'user01', 'Đèn LED 1 (Nhiệt độ)', 'TURN_OFF', 'FAILED',  '15/08/2026 22:00:00'),
  makeRecord('h-022', 'admin',  'Đèn LED 3 (Ánh sáng)', 'TURN_OFF', 'SUCCESS', '14/08/2026 21:00:00'),
  makeRecord('h-023', 'user02', 'Đèn LED 2 (Độ ẩm)',    'TURN_ON',  'SUCCESS', '14/08/2026 08:00:00'),
  makeRecord('h-024', 'user02', 'Đèn LED 2 (Độ ẩm)',    'TURN_OFF', 'SUCCESS', '14/08/2026 10:00:00'),
  makeRecord('h-025', 'admin',  'Đèn LED 1 (Nhiệt độ)', 'TURN_ON',  'SUCCESS', '13/08/2026 06:30:00'),
];

export const DEVICES = [
  'All Devices',
  'Đèn LED 1 (Nhiệt độ)',
  'Đèn LED 2 (Độ ẩm)',
  'Đèn LED 3 (Ánh sáng)',
];
export const ACTIONS  = ['All Actions', 'TURN_ON', 'TURN_OFF'];
export const STATUSES = ['All Status', 'SUCCESS', 'FAILED'];
