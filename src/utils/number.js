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
