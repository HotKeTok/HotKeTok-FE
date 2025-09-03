// src/components/layout/Flex.js
import styled, { css } from 'styled-components';

/** 공통 spacing 변환기 */
const toSize = (v) => (typeof v === 'number' ? `${v}px` : v);

/** Flex 스타일 변환 */
const mapFlex = (cfg = {}) => css`
  ${cfg.inline ? 'display: inline-flex;' : 'display: flex;'}
  ${cfg.direction ? `flex-direction: ${cfg.direction};` : ''}
  ${cfg.align ? `align-items: ${cfg.align};` : ''}
  ${cfg.justify ? `justify-content: ${cfg.justify};` : ''}
  ${cfg.wrap ? `flex-wrap: ${cfg.wrap};` : ''}
  ${cfg.gap != null ? `gap: ${toSize(cfg.gap)};` : ''}
  ${cfg.grow != null ? `flex-grow: ${cfg.grow};` : ''}
  ${cfg.shrink != null ? `flex-shrink: ${cfg.shrink};` : ''}
  ${cfg.basis ? `flex-basis: ${cfg.basis};` : ''}
  ${cfg.center ? 'align-items: center; justify-content: center;' : ''}
  ${cfg.fullWidth ? 'width: 100%;' : ''}
  ${cfg.fullHeight ? 'height: 100%;' : ''}
`;

/** Flex 기본 컴포넌트 */
export const Flex = styled.div`
  ${({
    $inline,
    $direction = 'row',
    $align,
    $justify,
    $wrap,
    $gap,
    $grow,
    $shrink,
    $basis,
    $center,
    $fullWidth,
    $fullHeight,
  }) =>
    mapFlex({
      inline: $inline,
      direction: $direction,
      align: $align,
      justify: $justify,
      wrap: $wrap,
      gap: $gap,
      grow: $grow,
      shrink: $shrink,
      basis: $basis,
      center: $center,
      fullWidth: $fullWidth,
      fullHeight: $fullHeight,
    })}
`;

/** 가로 배치 */
export const Row = styled(Flex).attrs({ $direction: 'row' })``;

/** 세로 배치 */
export const Column = styled(Flex).attrs({ $direction: 'column' })``;

/** 공간 밀어내기 (푸터/버튼 정렬 등에 활용) */
export const Spacer = styled.div`
  flex: 1 1 auto;
`;

/** 아이템 개별 제어 */
export const FlexItem = styled.div`
  ${({ $grow, $shrink, $basis }) => css`
    ${$grow != null ? `flex-grow: ${$grow};` : ''}
    ${$shrink != null ? `flex-shrink: ${$shrink};` : ''}
    ${$basis ? `flex-basis: ${$basis};` : ''}
  `}
`;
