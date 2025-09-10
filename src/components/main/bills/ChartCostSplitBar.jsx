import styled from "styled-components";
import { color } from "../../../styles/tokens";

export default function ChartCostSplitBar({year, month, electric, water, gas}) {
  const data = [
    { label: '전기요금', value: electric },
    { label: '수도요금', value: water },
    { label: '도시가스', value: gas },
  ];

  return (
    <Card aria-label={`${year}년 ${month}월 항목별 공과금 막대 차트`}>
      {/* 차트 구현 예정 */}
    </Card>
  );
}

const Card = styled.div`
  background:#fff;
  border:1px solid ${color('grayscale.200')};
  border-radius:16px;
  box-shadow:0 6px 24px rgba(16,24,40,.06);
  padding:12px;
`;