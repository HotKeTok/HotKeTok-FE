import { typo } from '../../styles/tokens';
import Alarm from './Alarm';
import styled from 'styled-components';
import IconChat from '../../assets/common/icon-chat.svg?react';
import { useNavigate } from 'react-router-dom';

export default function PageHeader({ leftComponent, isLightVersion = false }) {
  const navigate = useNavigate();

  return (
    <Container>
      {leftComponent}
      <BtnContainer>
        <IconChat
          width={44}
          height={44}
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/message')}
        />
        <Alarm isLightVersion={isLightVersion} />
      </BtnContainer>
    </Container>
  );
}

const Container = styled.div`
  width: auto;
  padding: 28px 24px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  ${typo('subtitle1')}
`;

const BtnContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
