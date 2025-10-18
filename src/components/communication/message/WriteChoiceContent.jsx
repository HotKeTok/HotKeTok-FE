import styled from 'styled-components';
import { color, typo } from '../../../styles/tokens';
import BoxToggle from './BoxToggle';
import WriteMessage from '../../../assets/communication/message/WriteMessage.png';
import { Column } from '../../../styles/flex';

export default function WriteChoiceContent({ handleSelectReceiver, selectedReceiver, tenantList }) {
  const sortedTenantList = tenantList.sort((a, b) => {
    const floorA = parseInt(a.floor);
    const floorB = parseInt(b.floor);
    return floorA - floorB;
  });

  return (
    <>
      <Column $gap={12} $justify="center" $align="center" style={{ width: '100%', paddingTop: 10 }}>
        <img src={WriteMessage} style={{ width: 78, objectFit: 'cover' }} />
        <Caption1>이웃의 호수를 선택하고 전하고 싶은 메세지를 쪽지로 보내보세요.</Caption1>
      </Column>
      <ToggleContainer>
        {sortedTenantList.map(data => (
          <BoxToggle
            key={data.floor}
            handleSelectReceiver={handleSelectReceiver}
            floor={data.floor}
            units={data.units}
            selectedId={selectedReceiver}
          />
        ))}
      </ToggleContainer>
    </>
  );
}

const ToggleContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 8px;

  padding: 10px;
`;

const Caption1 = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.600')};
`;
