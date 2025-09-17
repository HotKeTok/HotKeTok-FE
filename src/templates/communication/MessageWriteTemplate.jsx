import TopBar from "../../components/common/TopBar";
import { PageWithoutBottomBar, ScrollableContent, BottomButtonContainer} from "../../styles/layout";
import WriteChoiceContent from "../../components/communication/message/WriteChoiceContent";
import WriteFormContent from "../../components/communication/message/WriteFormContent";
import { useState } from "react";
import Button from "../../components/common/Button";
import ActionGuideModal from "../../components/common/ActionGuideModal";
import styled from "styled-components";
import { color, typo } from "../../styles/tokens";
import { Row } from "../../styles/flex";
import { useNavigate } from "react-router-dom";

export default function MessageWriteTemplate(){
    const navigate= useNavigate();

    const [modal, setModal]= useState(false);
    const [state, setState]= useState(0); // 0: 호수 선택, 1: 입력 폼 및 최종 제출
    const [selectedReceiver, setSelectedReceiver] = useState(null); // 선택된 수신자 정보

    const BTN_TEXT = "작성하기";

    const handleSelectReceiver = (receiver) => {
        setSelectedReceiver(receiver);
    }

    const btnClickHandler= () => {
      if(state === 0) setState(prev=>prev+1);
      else {
        // todo: 작성하기 버튼 클릭시 post api 요청
        setModal(true);
      }
    }

    const onConfirm = () => {
      navigate('/message');
    }

    return (
        <PageWithoutBottomBar>
            <TopBar title="쪽지 쓰기"/>
            {/* 절대적인 탭바 추가 */}
            <ScrollableContent style={{background: '#fff'}}>
              {
                state === 0 ? (
                  <WriteChoiceContent handleSelectReceiver={(number)=>handleSelectReceiver(number)} selectedReceiver={selectedReceiver} />
                ) : (
                  <WriteFormContent selectedReceiver={selectedReceiver} />
                )
              }
            </ScrollableContent>
             <BottomButtonContainer>
                  <Button text={BTN_TEXT} onClick={btnClickHandler} active={state===0 ? selectedReceiver : true}/>
            </BottomButtonContainer>
            {/* 확인 모달 */}
            {<ActionGuideModal
                isOpen={modal}
                titleComponent={<Row $align="center"><H3>{selectedReceiver}</H3><Body1>님께 쪽지를 보낼까요?</Body1></Row>}
                description="서로를 존중하는 환경을 위해 비방, 욕설, 차별적 발언 등 부적절한 언어 사용은 자제 부탁드립니다. 이웃에게 불쾌감을 줄 수 있는 내용은 삼가해 주세요. 건전하고 즐거운 소통을 함께 만들어가요! 😊"
                onCancel={() => setModal(false)}
                onConfirm={onConfirm}
                confirmText="확인"
              />}
        </PageWithoutBottomBar>
    )
}

const H3 = styled.div`
  ${typo('h3')};
  color: ${color('grayscale.800')};
`

const Body1 = styled.div`
  ${typo('body1')};
  color: ${color('grayscale.800')};
`