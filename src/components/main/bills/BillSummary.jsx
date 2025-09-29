import styled from 'styled-components';
import { typo, color } from '../../../styles/tokens';
import { formatNumberWithCommas } from '../../../utils/number';
import { Column } from '../../../styles/flex';

export default function BillSummary({ month, balance, income, expense }) {
  return (
    <Container>
      <Title style={{ paddingBottom: 12 }}>{month}월 공동 관리비 현황</Title>
      <Column $gap={4}>
        <Content>
          <Label>잔액</Label>
          <Amount type="balance">{formatNumberWithCommas(balance)}원</Amount>
        </Content>
        <Content>
          <Label>수입</Label>
          <Amount type="income">{formatNumberWithCommas(income)}원</Amount>
        </Content>
        <Content>
          <Label>지출</Label>
          <Amount type="expense">{formatNumberWithCommas(expense)}원</Amount>
        </Content>
      </Column>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  padding: 14px 20px;

  border-radius: 20px;
  background-color: ${color('grayscale.100')};
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.1);
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.div`
  ${typo('subtitle1')}
  color: #000;
`;

const Label = styled.div`
  ${typo('body2')}
  color: ${color('grayscale.500')};
`;

const Amount = styled.div`
  ${typo('button2')}
  border-radius: 4px;

  color: ${({ type }) =>
    type === 'balance' ? color('grayscale.800') : type === 'income' ? '#3C66FF' : '#FF3F3F'};

  background-color: ${({ type }) =>
    type === 'balance'
      ? color('grayscale.200')
      : type === 'income'
      ? 'rgba(60, 102, 255, 0.10)'
      : 'rgba(255, 63, 63, 0.10)'};

  padding: 2px 4px;
  display: inline-block;
`;
