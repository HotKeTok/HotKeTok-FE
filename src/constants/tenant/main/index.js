export const AUTH_TEXT = {
  TENANT: {
    black: [
      '집주인이 이름 / 휴대폰 번호 / 주소 정보를 바탕으로 확인중이에요.',
      '인증요청 후 집주인이 확인하면 인증이 완료됩니다. ',
    ],
    primary: ['인증이 완료되면 알림을 보내드릴게요!'],
  },
  LANDLORD: {
    black: ['등기부 등본을 바탕으로 주소를 인증 중이에요'],
    primary: ['인증이 완료되면 알림을 보내드릴게요!'],
  },
};

export const NOTICE_CARD_MOCK = [
  {
    id: 1,
    title: '분리수거 안내',
    date: '2022-11-04', // 표시용은 YYYY.MM.DD로 포맷해서 쓰면 됨
    pinned: true, // 핀 고정
    border: true,
  },
  {
    id: 2,
    title: '한양빌라 관리비 인하 공지',
    date: '2024-12-01',
    pinned: false,
  },
  {
    id: 3,
    title: '층간소음 관련 공지',
    date: '2024-12-12',
    pinned: false,
  },
];
