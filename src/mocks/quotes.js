import { SAMPLE_AVATAR } from './images';

export const MOCK_QUOTES = [
  {
    id: 'q1',
    companyName: '메종인테리어',
    phone: '02-0000-0000',
    price: 230000,
    content: '업계 최고 수준 보장합니다. 합리적인 가격에 모시겠습니다.',
    avatar: SAMPLE_AVATAR,
  },
  {
    id: 'q2',
    companyName: 'GS건설',
    phone: '02-0000-0000',
    price: 220000,
    content: '업계 최고 수준 보장합니다. 합리적인 가격에 모시겠습니다.',
    avatar: SAMPLE_AVATAR,
  },
  {
    id: 'q3',
    companyName: '세이브프롬',
    phone: '02-0000-0000',
    price: 245000,
    content: '업계 최고 수준 보장합니다. 합리적인 가격에 모시겠습니다.',
    avatar: SAMPLE_AVATAR,
  },
];

// 편의 함수(선택)
export const getMockQuoteById = id => MOCK_QUOTES.find(q => q.id === id) || null;
