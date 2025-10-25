/**
 * @function formatNumberWithCommas
 * @description 숫자를 천 단위로 콤마(,)를 추가하여 포맷팅하는 함수
 * @param {number} number - 포맷팅할 숫자
 * @returns {string} 천 단위로 콤마가 추가된 문자열
 */
export function formatNumberWithCommas(number) {
  if (typeof number !== 'number') return number;
  return number.toLocaleString();
}

// 전화번호 하이픈 추가
export function formatPhoneNumber(phoneNumber) {
  if (typeof phoneNumber !== 'string') return phoneNumber;
  const cleaned = phoneNumber.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2,3})(\d{3,4})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return phoneNumber;
}
