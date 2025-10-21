// src/utils/format.js
/**
 * 서버 enum category 문자열을 UI-friendly하게 변환
 * "문_창문" → "문/창문"
 */
export function formatCategoryName(value) {
  if (!value || typeof value !== 'string') return '';
  return value.replace(/_/g, '/');
}
