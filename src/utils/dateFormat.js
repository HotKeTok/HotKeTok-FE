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
