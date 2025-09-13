import { SAMPLE_THUMB, SAMPLE_AVATAR } from './images';

/** STEP 상수는 페이지에도 있지만, mock에서도 숫자 그대로 사용 */
const STEP = { FINDING: 1, CHOOSE: 2, MATCHED: 3, DONE: 4 };
const MODE = { SELF: 'SELF', LANDLORD: 'LANDLORD' };

function makeRequest({ mode, categoryLabel, requestedAt, hopeAt, address, description }) {
  return {
    categoryLabel,
    requestedAt, // "YYYY.MM.DD"
    hopeAt, // "YYYY.MM.DD / 오전 12:30"
    payerLabel: mode === MODE.SELF ? '본인 부담' : '집주인 부담',
    address,
    images: [SAMPLE_THUMB, SAMPLE_THUMB],
    description,
  };
}
function q(id, n, companyName, price) {
  return {
    id: `${id}-q${n}`,
    companyName,
    phone: '02-0000-0000',
    price,
    content: '업계 최고 수준 보장합니다. 합리적인 가격에 모시겠습니다.',
    avatar: SAMPLE_AVATAR,
  };
}

/**
 * REPAIR_REQUESTS
 * - 비용부담: SELF / LANDLORD 각각 STEP1~STEP4 모두 존재
 * - STEP3, STEP4에는 quotes 2~3개 포함
 * - STEP4는 selectedQuoteId(선택된 견적) 포함
 */
export const REPAIR_REQUESTS = [
  // ---------- SELF ----------
  {
    id: 'self-1',
    mode: MODE.SELF,
    step: STEP.FINDING,
    request: makeRequest({
      mode: MODE.SELF,
      categoryLabel: '가전',
      requestedAt: '2024.10.10',
      hopeAt: '2024.11.22 / 오전 10:00',
      address: '동작 핫케톡 스테이 101호',
      description: '세탁기 고장 증상. 급수 오류가 뜹니다.',
    }),
    quotes: [],
    selectedQuoteId: null,
  },
  {
    id: 'self-2',
    mode: MODE.SELF,
    step: STEP.CHOOSE,
    request: makeRequest({
      mode: MODE.SELF,
      categoryLabel: '문/창문',
      requestedAt: '2024.10.12',
      hopeAt: '2024.11.23 / 오후 02:00',
      address: '동작 핫케톡 스테이 102호',
      description: '방문 손잡이가 헐거워졌어요.',
    }),
    quotes: [],
    selectedQuoteId: null,
  },
  {
    id: 'self-3',
    mode: MODE.SELF,
    step: STEP.MATCHED,
    request: makeRequest({
      mode: MODE.SELF,
      categoryLabel: '수도/보일러',
      requestedAt: '2024.10.13',
      hopeAt: '2024.11.24 / 오전 11:30',
      address: '동작 핫케톡 스테이 103호',
      description: '보일러 난방이 안 켜져요.',
    }),
    quotes: [
      q('self-3', 1, '메종인테리어', 210000),
      q('self-3', 2, 'GS건설', 230000),
      q('self-3', 3, '세이브프롬', 225000),
    ],
    selectedQuoteId: 'self-3-q2', // 매칭된 업체(아직 완료 X)
  },
  {
    id: 'self-4',
    mode: MODE.SELF,
    step: STEP.DONE,
    request: makeRequest({
      mode: MODE.SELF,
      categoryLabel: '기타',
      requestedAt: '2024.10.13',
      hopeAt: '2024.11.20 / 오전 12:30',
      address: '동작 핫케톡 스테이 104호',
      description: '바퀴벌레 방역 요청.',
    }),
    quotes: [
      q('self-4', 1, '메종인테리어', 230000),
      q('self-4', 2, 'GS건설', 220000),
      q('self-4', 3, '세이브프롬', 230000),
    ],
    selectedQuoteId: 'self-4-q3', // ✅ 완료: 선택된 견적 존재
  },

  // ---------- LANDLORD ----------
  {
    id: 'll-1',
    mode: MODE.LANDLORD,
    step: STEP.FINDING,
    request: makeRequest({
      mode: MODE.LANDLORD,
      categoryLabel: '가전',
      requestedAt: '2024.10.15',
      hopeAt: '2024.11.26 / 오전 09:30',
      address: '동작 핫케톡 스테이 201호',
      description: '에어컨 실외기 소음.',
    }),
    quotes: [],
    selectedQuoteId: null,
  },
  {
    id: 'll-2',
    mode: MODE.LANDLORD,
    step: STEP.CHOOSE,
    request: makeRequest({
      mode: MODE.LANDLORD,
      categoryLabel: '문/창문',
      requestedAt: '2024.10.16',
      hopeAt: '2024.11.27 / 오후 01:00',
      address: '동작 핫케톡 스테이 202호',
      description: '현관문이 잘 안 닫혀요.',
    }),
    quotes: [],
    selectedQuoteId: null,
  },
  {
    id: 'll-3',
    mode: MODE.LANDLORD,
    step: STEP.MATCHED,
    request: makeRequest({
      mode: MODE.LANDLORD,
      categoryLabel: '수도/보일러',
      requestedAt: '2024.10.17',
      hopeAt: '2024.11.28 / 오후 03:00',
      address: '동작 핫케톡 스테이 203호',
      description: '부엌 싱크대 누수.',
    }),
    quotes: [q('ll-3', 1, '메종인테리어', 180000), q('ll-3', 2, 'GS건설', 195000)],
    selectedQuoteId: 'll-3-q1',
  },
  {
    id: 'll-4',
    mode: MODE.LANDLORD,
    step: STEP.DONE,
    request: makeRequest({
      mode: MODE.LANDLORD,
      categoryLabel: '기타',
      requestedAt: '2024.10.18',
      hopeAt: '2024.11.29 / 오전 10:30',
      address: '동작 핫케톡 스테이 204호',
      description: '현관 도어락 교체.',
    }),
    quotes: [q('ll-4', 1, '메종인테리어', 145000), q('ll-4', 2, '세이브프롬', 155000)],
    selectedQuoteId: 'll-4-q2', // ✅ 완료: 선택된 견적 존재
  },
];

/* -------- 헬퍼들 -------- */

// id로 원본 리퀘스트 조회
export function getRepairById(id) {
  return REPAIR_REQUESTS.find(r => r.id === id) || null;
}

// STEP4(완료)만 카드에 보여줄 최소 정보로 가공
export function getHistoryItems() {
  return REPAIR_REQUESTS.filter(r => r.step === STEP.DONE).map(r => {
    const sel = r.quotes.find(q => q.id === r.selectedQuoteId) || null;
    return {
      id: r.id,
      categoryLabel: r.request.categoryLabel, // 업종
      schedule: r.request.hopeAt, // 수리 예정 날짜(상세와 동일)
      price: sel ? sel.price : 0, // 금액(선택 견적가)
    };
  });
}

/** 상세 화면 주입용 초기값 세트로 변환 */
export function getProgressInitialProps(id) {
  const r = getRepairById(id);
  if (!r) return null;
  return {
    initialStep: r.step,
    initialMode: r.mode,
    initialSelectedQuoteId: r.selectedQuoteId ?? null,
    initialRequest: r.request,
    initialQuotes: r.quotes,
  };
}

// 홈화면 렌더링 위해 추가
const STEP_LABEL = {
  1: '업체 찾는 중',
  2: '견적서 선택',
  3: '업체 매칭',
  4: '처리 완료',
};

export function getActiveRepairs() {
  // STEP1~3만
  return REPAIR_REQUESTS.filter(r => r.step !== 4).map(r => ({
    id: r.id,
    step: r.step,
    categoryLabel: r.request.categoryLabel, // 업종
    schedule: r.request.hopeAt, // 수리 예정 날짜
    payerLabel: r.request.payerLabel, // 본인 부담 / 집주인 부담
    statusLabel: STEP_LABEL[r.step], // 업체 찾는 중 / 견적서 선택 / 업체 매칭
  }));
}
