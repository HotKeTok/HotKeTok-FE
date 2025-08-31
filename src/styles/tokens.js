import { css } from 'styled-components';

/**
 * 
 * @param {object} obj 
 * @param {string} path 
 * @returns 
 */
const get = (obj, path) => path.split('.').reduce((o, k) => o?.[k], obj);

// 타이포 프리셋: ${typo('caption1')}
export const typo = (key) => ({ theme }) => css`${get(theme, `fonts.${key}`)}`;

// 컬러 단축: ${color('grayscale.800')}
// ${color('brand.primary')}
export const color = (path) => ({ theme }) => get(theme, `colors.${path}`);
