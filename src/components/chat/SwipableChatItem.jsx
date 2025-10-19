import { useRef } from 'react';
import styled from 'styled-components';
import { typo, color } from '../../styles/tokens';

export default function SwipeableChatItem({ children, onDelete }) {
  const listRef = useRef(null);
  const isSwiping = useRef(false);
  const startX = useRef(0);
  const currentTranslateX = useRef(0);
  const isDragging = useRef(false);

  const getClientX = e => (e.touches ? e.touches[0].clientX : e.clientX);

  const onInteractionStart = e => {
    isDragging.current = false;
    startX.current = getClientX(e);
    isSwiping.current = true;
    listRef.current.style.transition = 'none';
  };

  const onInteractionMove = e => {
    if (!isSwiping.current) return;
    const currentX = getClientX(e);
    const deltaX = currentX - startX.current;

    // 이동 거리가 10px 이상일 때에만 드래그로 간주
    if (Math.abs(deltaX) > 10) {
      isDragging.current = true;
    }

    const newTranslateX = Math.min(0, Math.max(-90, currentTranslateX.current + deltaX));
    listRef.current.style.transform = `translateX(${newTranslateX}px)`;
  };

  const onInteractionEnd = () => {
    if (!isSwiping.current) return;
    isSwiping.current = false;
    listRef.current.style.transition = 'transform 0.3s ease-in-out';

    const transformMatrix = window.getComputedStyle(listRef.current).transform;
    const translateX = new DOMMatrix(transformMatrix).m41;

    if (translateX < -35) {
      listRef.current.style.transform = 'translateX(-90px)';
      currentTranslateX.current = -90;
    } else {
      listRef.current.style.transform = 'translateX(0px)';
      currentTranslateX.current = 0;
    }
  };

  // 스와이프 동작 중 클릭 이벤트 방지
  const handleClickCapture = e => {
    if (isDragging.current) {
      e.stopPropagation();
      // 이벤트 전파 막기
      e.preventDefault();
    }
  };

  return (
    <ChatItemContainer>
      <SwipeableWrapper
        ref={listRef}
        onMouseDown={onInteractionStart}
        onTouchStart={onInteractionStart}
        onMouseMove={onInteractionMove}
        onTouchMove={onInteractionMove}
        onMouseUp={onInteractionEnd}
        onTouchEnd={onInteractionEnd}
        onMouseLeave={onInteractionEnd}
        onClickCapture={handleClickCapture}
      >
        {children}
        <BtnWrapper>
          <DeleteButton onClick={onDelete}>삭제</DeleteButton>
        </BtnWrapper>
      </SwipeableWrapper>
    </ChatItemContainer>
  );
}

const ChatItemContainer = styled.li`
  overflow: hidden;
`;

const SwipeableWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  touch-action: pan-y;
`;

const BtnWrapper = styled.div`
  width: 90px;
  flex-shrink: 0;

  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const DeleteButton = styled.button`
  width: 80px;
  height: 44px;
  flex-shrink: 0;
  border: 1px solid ${color('brand.primary')};
  border-radius: 6px;

  ${typo('button2')}
  color: ${color('brand.primary')};

  display: flex;
  align-items: center;
  justify-content: center;

  cursor: pointer;
`;
