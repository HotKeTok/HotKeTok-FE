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
    return isoString;
  }
}

export function getHHMMTime(isoString) {
  const date = new Date(isoString);

  // 시와 분 가져오기
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${hours}:${minutes}`;
}

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
