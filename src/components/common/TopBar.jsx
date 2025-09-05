import React from 'react';
import styled from 'styled-components';
import BackButton from '../../assets/common/icon-back-button.svg';
import { color, typo } from '../../styles/tokens';
import { Row } from '../../styles/flex';
import { useNavigate } from 'react-router-dom';

export default function TopBar({ title }) {
  const nav = useNavigate();

  const moveBack = () => {
    nav(-1);
  };

  return (
    <Container>
      <RowForTopBar $justify="space-between" $align="center">
        <BackButtonWrapper onClick={moveBack}>
          <img src={BackButton} alt="뒤로가기버튼" />
        </BackButtonWrapper>
        <Title>{title}</Title>
        <div style={{ width: '44px', height: '44px' }} />
      </RowForTopBar>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  padding-top: 52px;
`;

const BackButtonWrapper = styled.div`
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  /* 아이콘 크기는 그대로 */
  img {
    width: 8px;
    height: 14px;
  }
`;

const RowForTopBar = styled(Row)`
  padding: 0px 6px 4.5px 6px;
`;

const Title = styled.div`
  ${typo('subtitle1')};
  color: ${color('grayscale.800')};
`;
