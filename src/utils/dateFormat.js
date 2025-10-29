// 날짜를 YYYY.MM.DD 형식으로 변환하는 함수
export function formatDateToYMD(isoString) {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString; // 잘못된 날짜면 그대로 반환

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}.${month}.${day}`;
  } catch (e) {
    console.error(e);
    return isoString;
  }
}

/**
 * @function formatTimestamp
 * @description ISO 8601 형식의 날짜 문자열을 받아서,
 *             '오전/오후 HH:MM' 형식으로 변환하여 반환합니다.
 * @param {*} isoString
 * @returns
 */
export const getHHMMTimeWithHour12 = isoString => {
  return new Date(isoString).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

// HH:MM 형식으로 변환하는 함수
export function getHHMMTime(isoString) {
  const date = new Date(isoString);

  // 시와 분 가져오기
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}`;
}

/**
 * @function formatTodayTimeOrIsoTime
 * @description ISO 8601 형식의 날짜 문자열을 받아서,
 *              오늘 날짜인 경우 '오전/오후 HH:MM' 형식으로,
 *              그 외의 경우 'YYYY.MM.DD' 형식으로 변환하여 반환합니다.
 * @param {string} isoString - ISO 8601 형식의 날짜 문자열
 * @returns {string} 변환된 날짜 문자열
 */
export const formatTodayTimeOrIsoTime = isoString => {
  const DateTmp = new Date(isoString);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (DateTmp >= startOfToday) {
    return DateTmp.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } else {
    return DateTmp.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
      .replace(/\.$/, '')
      .replace(/ /g, '');
  }
};

/**
 * @description ISO 8601 형식의 날짜 문자열을 "YYYY-MM-DD" 형식으로 변환합니다.
 */
export function formatDateToYYYYMMDD(isoString) {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString; // 잘못된 날짜면 그대로 반환

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  } catch (e) {
    return isoString;
  }
}

/** ISO 문자열 → "오전/오후 h:mm" */
export function formatKoreanAmPmTime(isoString) {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    const h24 = date.getHours();
    const mm = String(date.getMinutes()).padStart(2, '0');
    const isAM = h24 < 12;
    let h12 = h24 % 12;
    if (h12 === 0) h12 = 12; // 0시는 12로 표기

    return `${isAM ? '오전' : '오후'} ${h12}:${mm}`;
  } catch (e) {
    return isoString;
  }
}

/** ISO 문자열 → "YYYY.MM.DD / 오전 h:mm" */
export function formatYMDWithKoreanTime(isoString) {
  const d = formatDateToYMD(isoString);
  const t = formatKoreanAmPmTime(isoString);
  if (!d && !t) return '';
  if (!d) return t;
  if (!t) return d;
  return `${d} / ${t}`;
}

// 날짜 포맷팅을 위한 헬퍼 함수
/**
 * @function formatIsTodayOrIsoTime
 * @description ISO 8601 형식의 날짜 문자열을 받아서,
 *              오늘 날짜인 경우 '오늘' 문자열을,
 *              그 외의 경우 'YYYY년 M월 D일' 형식으로 변환하여 반환합니다.
 * @param {*} isoString
 * @returns
 */
export const formatIsTodayOrIsoTime = isoString => {
  const messageDate = new Date(isoString);
  const now = new Date();

  const isToday = messageDate.setHours(0, 0, 0, 0) === now.setHours(0, 0, 0, 0);
  if (isToday) {
    return '오늘';
  }

  return messageDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// 8시간 전 시간으로 오는 시간을 8시간을 단순히 더해주는 함수
export function toKoreanTime(isoString) {
  const date = new Date(isoString);
  date.setHours(date.getHours() + 9);
  return date.toISOString();
}

// 채팅방 목록을 최근 메시지 시간 순으로 정렬하는 함수
export function sortChatRoomsByLastMessageTime(chatRooms) {
  return [...chatRooms].sort((a, b) => {
    const cleanTimeB = b.lastMessageTime.replace(/(\.\d{3})\d+/, '$1');
    const cleanTimeA = a.lastMessageTime.replace(/(\.\d{3})\d+/, '$1');

    return new Date(cleanTimeB) - new Date(cleanTimeA);
  });
}
