// 공통 상수/유틸 (기존과 동일)
export const REPAIR_TYPES = [
  { key: 'appliance', label: '가전' },
  { key: 'door_window', label: '문/창문' },
  { key: 'water_boiler', label: '수도/보일러' },
  { key: 'electric', label: '전기/조명' },
  { key: 'etc', label: '기타' },
];

export const TIME_OPTIONS = [
  '오전 10:00',
  '오전 11:00',
  '오후 12:00',
  '오후 1:00',
  '오후 2:00',
  '오후 3:00',
  '오후 4:00',
  '오후 5:00',
  '오후 6:00',
];

export function getNext7Days() {
  const out = [];
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const w = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()];
    out.push({
      key: d.toISOString().slice(0, 10),
      dateObj: d,
      label: `${d.getMonth() + 1}.${String(d.getDate()).padStart(2, '0')} (${w})`,
      justDate: d.getDate(),
    });
  }
  return out;
}
