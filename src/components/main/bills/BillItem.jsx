import styled from "styled-components";
import { color, typo } from "../../../styles/tokens";
import { Column, Row } from "../../../styles/flex";
import ArrowRight from "../../../assets/common/icon-arrow-right.svg?react"

export default function BillItem({year, item, monthsLabel, won, onClick}) {
    return (
      <ListItem key={`${year}-${item.month}`} $justify="space-between" $align="center" onClick={onClick}>
        <Column $gap={2} style={{flex: 1}}>
          <RowTop>
              <Title>{`${year}년 ${monthsLabel(item.month)}`}</Title>
              <Right>
                <Amount>{won(item.value)}</Amount>
              </Right>
          </RowTop>
          <Date>{item.paidAt}</Date>
        </Column>

        <RightCol>
                <ArrowRightStyled width={10} height={10} />
              </RightCol>
      </ListItem>
  )
}

const ListItem = styled(Row)`
  cursor: pointer
`;

const RowTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.div`
  ${typo("body1")};
  color: black;
`;

const Right = styled.div`
  display: flex;
  gap: 8px;
`;

const Amount = styled.div`
  ${typo("body1")};
  color: #000;
`;

const RightCol = styled.div`
  flex: 0 0 auto;
  display: flex;
  width: 40px;

  justify-content: center;
  align-items: center;
`;


const ArrowRightStyled = styled(ArrowRight)`
  width: 10px;
  height: 10px;

  path {
    stroke: #000;
  }
`;

const Date= styled.div`
  ${typo("caption1")};
  color: ${color("grayscale.400")};

  text-align: right;
`