import styled from 'styled-components';
import { typo, color } from '../../../styles/tokens';
import { formatNumberWithCommas } from '../../../utils/number';
import CloseIcn from '../../../assets/common/icon-close.svg?react';
import ChartCategoryBar from './GraphCategoryBar';
import BillSummary from './BillSummary';
import { Row } from '../../../styles/flex';

// 증감 텍스트 헬퍼 함수
const formatIncrease = (value, tab) => {
  if (tab === '공과금') {
    if (value > 0) return <StatusText isIncrease>{formatNumberWithCommas(value)} 증가</StatusText>;
    if (value < 0) return <StatusText>{formatNumberWithCommas(Math.abs(value))} 감소</StatusText>;
    return <StatusText>변동 없음</StatusText>; // 변동 없음
  } else return <StatusText isIncrease>입금</StatusText>; // todo: 입금/출금으로 변경
};

export default function ModalBillDetail({ year, billData, onClose, tab }) {
  if (!billData) {
    return (
      <ModalWrapper>
        <ModalHeader>
          <h4>{tab} 내역</h4>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        <p>선택된 {tab} 내역이 없습니다.</p>
      </ModalWrapper>
    );
  }

  const { electricity, gas, water } = billData.detail;
  const chartData = [
    { name: '전기요금', amount: electricity.amount, increase: electricity.increase },
    { name: '수도요금', amount: water.amount, increase: water.increase },
    { name: '도시가스', amount: gas.amount, increase: gas.increase },
  ];
  // todo: 관리비 내역도 데이터 가공하여 내려줌

  return (
    <ModalWrapper>
      <ModalHeader>
        <h4>
          {year}년 {billData.month}월 {tab}
        </h4>
        <CloseButton onClick={onClose}>
          <CloseIcn />
        </CloseButton>
      </ModalHeader>

      <SummaryWrapper>
        {tab === '공과금' && <ChartCategoryBar chartData={chartData} />}
        {tab === '공동 관리비' && (
          <BillSummary month={billData.month} balance={457000} income={910000} expense={453000} />
        )}
      </SummaryWrapper>

      <DetailList>
        {chartData.map(item => (
          <DetailItem key={item.name}>
            <Row $justify="space-between" $align="center" style={{ width: '100%' }}>
              <Body1>{item.name}</Body1>
              <Body1>{formatNumberWithCommas(item.amount)}원</Body1>
            </Row>
            <SubTextRow $justify="space-between" $align="center">
              {tab === '공동 관리비' && <DateText>2024.9.11</DateText>}
              <span>{formatIncrease(item.increase)}</span>
            </SubTextRow>
          </DetailItem>
        ))}
      </DetailList>
    </ModalWrapper>
  );
}

const ModalWrapper = styled.div`
  background-color: white;
  padding: 20px 30px;
  border-radius: 30px;

  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  h4 {
    ${typo('body2')};
    color: ${color('grayscale.400')};
  }
`;

const CloseButton = styled.div`
  padding: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SummaryWrapper = styled.div`
  width: 100%;
  margin-bottom: 40px;
`;

const DetailList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;

  > div {
    text-align: right;
    span {
      ${typo('caption1')};
      font-weight: 400;
    }
  }
`;

const StatusText = styled.span`
  ${typo('caption1')};
  color: ${props => (props.isIncrease ? '#3C66FF' : '#FF3F3F')};
`;

const DateText = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.400')};
`;

const Body1 = styled.div`
  ${typo('body1')};
  color: ${color('grayscale.800')};
`;

const SubTextRow = styled(Row)`
  width: 100%;

  & > *:only-child {
    margin-left: auto;
  }
`;
