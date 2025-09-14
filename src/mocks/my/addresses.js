// src/mocks/my/addresses.js

/**
 * 장소 분류: 'HOME' | 'WORK' | 'ETC'
 * 인증 상태: verified: boolean
 * 현재 설정: isCurrent: boolean
 * 이웃에게 한마디: neighborNotes: array of keys
 *  - ALLOWED_NOTES 에 정의된 key 사용
 */

export const ALLOWED_NOTES = [
  { key: 'SLEEP_AFTER_10', label: '10시 이후로는 잡니다' },
  { key: 'HAS_BABY', label: '집에 아기가 있어요' },
  { key: 'HAS_PET', label: '반려동물이 있어요' },
  // 직접입력은 선택 시 chip 입력 UI에서 자유 텍스트를 받습니다.
];

export const ADDRESS_LIST_MOCK = [
  {
    id: 'addr-1',
    placeType: 'HOME',
    placeTypeLabel: '우리집',
    customPlaceName: '', // ETC일 때만 사용
    alias: '우리집',
    address1: '서울특별시 강남구 영동대로 112길 46',
    address2: '101동 403호',
    lot: '서울특별시 강남구 삼성동 109-21',
    verified: true,
    isCurrent: true,
    neighborNotes: ['SLEEP_AFTER_10'],
    extraNotes: '', // 직접 입력 메모 저장
  },
  {
    id: 'addr-2',
    placeType: 'WORK',
    placeTypeLabel: '회사',
    customPlaceName: '',
    alias: '공유오피스',
    address1: '서울특별시 강남구 영동대로 112길 46',
    address2: '202호',
    lot: '지번임',
    verified: false,
    isCurrent: false,
    neighborNotes: ['HAS_PET'],
    extraNotes: '',
  },
  {
    id: 'addr-3',
    placeType: 'ETC',
    placeTypeLabel: '기타',
    customPlaceName: '할머니댁',
    alias: '할머니댁',
    address1: '창원 용원로주택 202호',
    address2: '101호',
    lot: '지번임',
    verified: true,
    isCurrent: false,
    neighborNotes: ['HAS_BABY'],
    extraNotes: '',
  },
  {
    id: 'addr-4',
    placeType: 'ETC',
    placeTypeLabel: '기타',
    customPlaceName: '분가',
    alias: '분가',
    address1: '영월 00백로 205호',
    address2: '상세주소임',
    lot: '지번임',
    verified: true,
    isCurrent: false,
    neighborNotes: [],
    extraNotes: '',
  },
];
