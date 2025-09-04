import React from 'react';
import styled from 'styled-components';
import BackButton from '../../assets/common/BackButton.svg';
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
      <Row $justify="space-between" style={{ padding: '0px 24px 24px 24px' }}>
        <img src={BackButton} onClick={moveBack} style={{ cursor: 'pointer' }} alt="뒤로가기버튼" />
        <Title>{title}</Title>
        <div style={{ width: '8px', height: '14px' }} />
      </Row>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  padding-top: 52px;
`;

const Title = styled.div`
  ${typo('subtitle1')}
  color : ${color('grayscale.800')}
`;
