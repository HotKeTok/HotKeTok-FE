import { typo, color } from '../../../styles/tokens';
import styled from 'styled-components';
import { formatNumberWithCommas } from '../../../utils/number';

/**
 * @function BillItem
 * @param {string} type ("income" | "expense") - 항목 유형
 * @param {string} title - 항목 제목
 * @param {string} date - 항목 날짜 (예: "2024.9.11")
 * @param {number} amount - 항목 금액 (예: 130000)
 * @param {number} id - 항목 고유 ID
 * @returns
 */
export default function BillItem({ id, title, date, amount, type }) {
  return (
    <MainContainer key={id}>
      <Container>
        <Info>{title}</Info>
        <Info>{formatNumberWithCommas(amount)}원</Info>
      </Container>

      <Container>
        <Date>{date}</Date>
        <Type type={type}>{type === 'income' ? '입금' : '출금'}</Type>
      </Container>
    </MainContainer>
  );
}

const MainContainer = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Info = styled.div`
  ${typo('body1')}
  color: ${color('grayscale.800')};
`;

const Date = styled.div`
  ${typo('caption1')}
  color: ${color('grayscale.400')};
`;

const Type = styled.div`
  ${typo('caption1')}
  color: ${props => (props.type === 'income' ? '#FF3F3F' : '#3A84FF')};
`;
