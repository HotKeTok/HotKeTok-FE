import styled from "styled-components"
import { color, typo } from "../../../styles/tokens"
import BoxToggle from "./BoxToggle"
import WriteMessage from "../../../assets/communication/message/WriteMessage.png";
import { Column } from "../../../styles/flex";

/**
 * 
 * @param {()=>void} handleSelectReceiver - 받는 이웃 선택 핸들러
 * @params {number|null} selectedReceiver - 선택된 이웃 호수
 * @returns 
 */
export default function WriteChoiceContent({handleSelectReceiver, selectedReceiver}){
    return (
        <>
        <Column $gap={12} $justify="center" $align="center" style={{width: '100%', paddingTop: 10}}>
           <img src={WriteMessage} style={{ width: 78, objectFit: "cover" }} />
          <Caption1>
            이웃의 호수를 선택하고 전하고 싶은 메세지를 쪽지로 보내보세요.
          </Caption1>
        </Column>
        <ToggleContainer>
          <BoxToggle
            handleSelectReceiver={handleSelectReceiver}
            floor={1}
            selectedId={selectedReceiver}
          ></BoxToggle>
          <BoxToggle
            handleSelectReceiver={handleSelectReceiver}
            floor={2}
            selectedId={selectedReceiver}
          ></BoxToggle>
          <BoxToggle
            handleSelectReceiver={handleSelectReceiver}
            floor={3}
            selectedId={selectedReceiver}
          ></BoxToggle>
        </ToggleContainer>
      </>
    )
}

const ToggleContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 8px;

  padding: 10px;
`;

const Caption1= styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.600')};
`