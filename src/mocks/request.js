import { SAMPLE_THUMB } from './images';

// mode: 'SELF' | 'LANDLORD'
export function buildMockRequest(mode = 'SELF') {
  return {
    categoryLabel: '기타',
    requestedAt: '2024.10.13',
    hopeAt: '2024.11.20 / 오전 12:30',
    payerLabel: mode === 'SELF' ? '본인 부담' : '집주인 부담',
    address: '동작 핫케톡 스테이 304호',
    images: [SAMPLE_THUMB, SAMPLE_THUMB],
    description:
      '바퀴벌레가 너무 많아졌습니다. 약 2주정도 된 것 같아요. 집에서 음식을 자주 해먹는 것도 아니고 매번 꼼꼼하게 청소하는데 원인을 모르겠습니다.',
  };
}
