import TopBar from '../../../components/common/TopBar';
import {
  PageWithoutBottomBar,
  ScrollableContent,
  BottomButtonContainer,
} from '../../../styles/layout';
import WriteChoiceContent from '../../../components/communication/message/WriteChoiceContent';
import WriteFormContent from '../../../components/communication/message/WriteFormContent';
import { useState } from 'react';
import Button from '../../../components/common/Button';
import ActionGuideModal from '../../../components/common/ActionGuideModal';
import styled from 'styled-components';
import { color, typo } from '../../../styles/tokens';
import { Row } from '../../../styles/flex';
import { useNavigate } from 'react-router-dom';

export default function MessageWriteTemplate({
  state,
  setState,
  tenantList,
  selectedReceiver,
  setSelectedReceiver,
  fetchNewMessageData,
  preDefinedRecipient = { receiverId: null, senderNumber: null },
}) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    receiverId: selectedReceiver,
    isAnonymous: false,
    tag: [],
    silentTime: null,
    detailContent: '',
  });
  const [modal, setModal] = useState(false);

  const BTN_TEXT = '작성하기';

  const handleSelectReceiver = receiver => {
    setSelectedReceiver(receiver);
  };

  const btnClickHandler = () => {
    if (state === 0) setState(prev => prev + 1);
    else {
      // todo: 작성하기 버튼 클릭시 post api 요청
      setModal(true);
    }
  };

  const isFormValid = () => {
    const isQuietTagSelected = formData.tag.includes('quiet');
    const isContentValid = formData.detailContent.trim().length > 0;
    if (isQuietTagSelected) {
      return formData.silentTime && isContentValid;
    }
    return isContentValid;
  };

  const onConfirm = () => {
    const updatedFormData = {
      ...formData,
      receiverId: selectedReceiver,
    };
    fetchNewMessageData(updatedFormData).then(() => {
      setModal(false);
      navigate('/message');
    });
  };

  const getReceiverInfo = () => {
    if (preDefinedRecipient.receiverId) {
      return {
        unitNumber: preDefinedRecipient.senderNumber,
        userId: preDefinedRecipient.receiverId,
      };
    } else {
      return tenantList
        .flatMap(floor => floor.units)
        .find(unit => unit.userId === selectedReceiver);
    }
  };

  if (state === 1 && !selectedReceiver && !preDefinedRecipient.receiverId) {
    // 수신자가 선택되지 않았으면 호수 선택 화면으로 강제 이동
    setState(0);
  }
  return (
    <PageWithoutBottomBar>
      <TopBar title="쪽지 쓰기" />
      {/* 절대적인 탭바 추가 */}
      <ScrollableContent style={{ background: '#fff' }}>
        {state === 0 ? (
          <WriteChoiceContent
            handleSelectReceiver={string => handleSelectReceiver(string)}
            selectedReceiver={selectedReceiver}
            tenantList={tenantList}
          />
        ) : (
          <WriteFormContent
            receiverInfo={getReceiverInfo()}
            formData={formData}
            setFormData={setFormData}
          />
        )}
      </ScrollableContent>
      <BottomButtonContainer>
        <Button
          text={BTN_TEXT}
          onClick={btnClickHandler}
          active={state === 0 ? selectedReceiver : isFormValid()}
        />
      </BottomButtonContainer>
      {/* 확인 모달 */}
      {
        <ActionGuideModal
          isOpen={modal}
          titleComponent={
            <Row $align="center">
              <H3>
                {
                  tenantList
                    .flatMap(floor => floor.units)
                    .find(unit => unit.userId === selectedReceiver)?.unitNumber
                }
              </H3>
              <Body1>님께 쪽지를 보낼까요?</Body1>
            </Row>
          }
          description="서로를 존중하는 환경을 위해 비방, 욕설, 차별적 발언 등 부적절한 언어 사용은 자제 부탁드립니다. 이웃에게 불쾌감을 줄 수 있는 내용은 삼가해 주세요. 건전하고 즐거운 소통을 함께 만들어가요! 😊"
          onClose={() => setModal(false)}
          onConfirm={onConfirm}
          confirmText="네, 보낼게요"
        />
      }
    </PageWithoutBottomBar>
  );
}

const H3 = styled.div`
  ${typo('h3')};
  color: ${color('grayscale.800')};
`;

const Body1 = styled.div`
  ${typo('body1')};
  color: ${color('grayscale.800')};
`;
