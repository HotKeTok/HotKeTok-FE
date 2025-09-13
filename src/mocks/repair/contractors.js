// src/mocks/contractors.js
function makeThumb({ w = 320, h = 240, text = 'IMAGE' } = {}) {
  const svg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
      <rect width="100%" height="100%" fill="#E9F8F2"/>
      <rect x="6" y="6" width="${w - 12}" height="${h - 12}" fill="#CFF3E5" rx="16"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
        font-size="22" font-family="Arial" fill="#00B07C">${text}</text>
    </svg>`
  );
  return `data:image/svg+xml;utf8,${svg}`;
}

export const MOCK_CONTRACTORS = [
  {
    id: '916',
    name: '메종 인테리어',
    categories: ['인테리어', '리모델링'],
    ratingAvg: 3.6,
    reviewCount: 10,
    badges: ['가견', '응/창문'],
    images: [
      makeThumb({ text: '매장 전경' }),
      makeThumb({ text: '시공 샷 #1' }),
      makeThumb({ text: '포트폴리오' }),
      makeThumb({ text: '상담실' }),
    ],
    contact: {
      phone: '02-0000-0000',
      hours: '10:00 ~ 22:00 (토, 일 휴무)',
      address: '서울특별시 동작구 상도동 0000',
    },
    intro: '추석 연휴동안에도 정상영업합니다. ^^ 전화주세요. 인테리어/리모델링 전문 업체입니다.',
    news: [
      {
        id: 'n1',
        date: '2023.03.03',
        title: '숭실대학교 특별 이벤트',
        body: '숭실대생 대상 여름방학 특별 이벤트 시작! 2주간 핫케톡으로 예약 시 10% 할인 드립니다.',
      },
      {
        id: 'n2',
        date: '2023.03.03',
        title: '임시 휴무 (05/08)',
        body: '어버이날 맞이하여 고향에 내려갑니다 🙂 잠시 휴무입니다. 모두 즐거운 하루 되세요!',
      },
    ],
    reviews: [
      {
        id: 'r1',
        user: '핫케톡',
        date: '2023.03.03',
        rating: 5,
        tags: ['가견'],
        body: '최고예요~ 근데 답장이 좀 느려요!',
        photos: [makeThumb({ text: '리뷰 사진1' }), makeThumb({ text: '리뷰 사진2' })],
      },
      {
        id: 'r2',
        user: '핫케톡',
        date: '2023.03.03',
        rating: 4,
        tags: ['응/창문'],
        body: '친절해요. 가격도 저렴하고 좋네요.',
        photos: [],
      },
      {
        id: 'r3',
        user: '하하',
        date: '2023.03.02',
        rating: 1,
        tags: [],
        body: '정말 최악입니다. 너무너무 별로예요. 진짜진짜 진짜 2.0은 별루입니다. 레알루 별루... 별점 1점도 아깝습니다. 여러분~ 여기 이용하지 마세요. 저는 이렇게까지 별로인 곳 처음봄',
        photos: [
          makeThumb({ text: '현장1' }),
          makeThumb({ text: '현장2' }),
          makeThumb({ text: '현장3' }),
        ],
      },
    ],
  },
  {
    id: 'A12',
    name: '916 DESIGN',
    categories: ['리모델링'],
    ratingAvg: 4.5,
    reviewCount: 7,
    badges: ['도배', '바닥'],
    images: [
      makeThumb({ text: '916 로고' }),
      makeThumb({ text: '쇼룸' }),
      makeThumb({ text: '시공컷' }),
    ],
    contact: {
      phone: '02-1111-2222',
      hours: '09:00 ~ 20:00 (연중무휴)',
      address: '서울특별시 관악구 신림동 123-4',
    },
    intro: '화이트 & 내추럴 무드 전문. 합리적인 견적과 깔끔한 마감 자신합니다.',
    news: [
      {
        id: 'n1',
        date: '2023.04.10',
        title: '봄맞이 부분 리모델링 패키지',
        body: '주방/거실/욕실 중 2곳 동시 시공 시 8% 할인.',
      },
    ],
    reviews: [
      {
        id: 'r1',
        user: '밍밍',
        date: '2023.04.12',
        rating: 5,
        tags: ['친절', '가성비'],
        body: '상담부터 마감까지 너무 만족. 다음에도 여기!',
        photos: [makeThumb({ text: '후기사진' })],
      },
      {
        id: 'r2',
        user: '준',
        date: '2023.04.11',
        rating: 3,
        tags: [],
        body: '전체적으로 무난. 일정은 조금 지연됨.',
        photos: [],
      },
    ],
  },
];
