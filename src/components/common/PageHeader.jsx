import { typo } from '../../styles/tokens';
import Alarm from './Alarm';
import styled from 'styled-components';
import IconChat from '../../assets/common/icon-chat.svg?react';
import IconChatWhite from '../../assets/common/icon-chat-white.svg?react';
import { useNavigate } from 'react-router-dom';

export default function PageHeader({
  leftComponent,
  isLightVersion = false,
  background,
  color = 'default',
}) {
  const navigate = useNavigate();

  const ChatIconComponent = color === 'white' ? IconChatWhite : IconChat;

  return (
    <Container background={background}>
      {leftComponent}
      <BtnContainer>
        <ChatIconComponent
          width={44}
          height={44}
          style={{ cursor: 'pointer' }}
          onClick={() => navigate('/chat')}
        />
        {/* color prop을 Alarm에도 그대로 전달 */}
        <Alarm isLightVersion={isLightVersion} color={color} />
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
  background: ${({ background }) => background || 'transparent'};
  ${typo('subtitle1')}
`;

const BtnContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
