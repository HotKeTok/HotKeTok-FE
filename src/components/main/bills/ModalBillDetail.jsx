import styled from 'styled-components';
import { typo, color } from '../../../styles/tokens';
import { formatNumberWithCommas } from '../../../utils/number';
import CloseIcn from '../../../assets/common/icon-close.svg?react';
import ChartCategoryBar from './GraphCategoryBar';
import BillSummary from './BillSummary';
import { Row } from '../../../styles/flex';
import { formatDateToYMD } from '../../../utils/dateFormat';

// 증감 텍스트 헬퍼 함수
const formatIncrease = (value, tab) => {
  if (tab === '공과금') {
    if (value > 0) return <StatusText isIncrease>{formatNumberWithCommas(value)} 증가</StatusText>;
    if (value < 0) return <StatusText>{formatNumberWithCommas(Math.abs(value))} 감소</StatusText>;
    return <StatusText>변동 없음</StatusText>; // 변동 없음
  } else return <StatusText isIncrease>입금</StatusText>; // todo: 입금/출금으로 변경
};

export default function ModalBillDetail({
  loading,
  year,
  month,
  utilityBillData,
  commonBillData,
  onClose,
  tab,
}) {
  if (loading) {
    return (
      <ModalWrapper>
        <ModalHeader>
          <h4>{tab} 내역</h4>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </ModalHeader>
        <p>로딩 중...</p>
      </ModalWrapper>
    );
  }

  if (!utilityBillData && !commonBillData) {
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

  let chartData = [];
  chartData = [
    {
      description: '전기요금',
      amount: utilityBillData.detail.electricity.amount,
      increase: utilityBillData.detail.electricity.increase,
    },
    {
      description: '수도요금',
      amount: utilityBillData.detail.water.amount,
      increase: utilityBillData.detail.water.increase,
    },
    {
      description: '도시가스',
      amount: utilityBillData.detail.gas.amount,
      increase: utilityBillData.detail.gas.increase,
    },
  ];

  const renderList = tab === '공동 관리비' ? commonBillData.details : chartData;

  return (
    <ModalWrapper>
      <ModalHeader>
        <h4>
          {year}년 {month}월 {tab}
        </h4>
        <CloseButton onClick={onClose}>
          <CloseIcn />
        </CloseButton>
      </ModalHeader>

      <SummaryWrapper>
        {tab === '공과금' && <ChartCategoryBar chartData={chartData} />}
        {tab === '공동 관리비' && (
          <BillSummary
            month={commonBillData.month}
            balance={commonBillData.balance}
            income={commonBillData.income}
            expense={commonBillData.expense}
          />
        )}
      </SummaryWrapper>

      <DetailList>
        {renderList.map(item => (
          <DetailItem key={item.description}>
            <Row $justify="space-between" $align="center" style={{ width: '100%' }}>
              <Body1>{item.description}</Body1>
              <Body1>{formatNumberWithCommas(item.amount)}원</Body1>
            </Row>
            <SubTextRow $justify="space-between" $align="center">
              {tab === '공동 관리비' && <DateText>{formatDateToYMD(item.date)}</DateText>}
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
