import TopBar from "../../components/common/TopBar";
import { Page, ScrollableContent } from "../../styles/layout";
import styled, {css} from "styled-components";
import { useState} from "react";
import { useNavigate } from "react-router-dom";
import { color, typo } from "../../styles/tokens";
import MessageItem from "../../components/communication/message/MessageItem";
import { Column } from "../../styles/flex";

export default function MessageTemplate({ receivedMessages, sentMessages }){
     const navigate = useNavigate();

    // 0: 받은 쪽지, 1: 보낸 쪽지
    const [toggleState, setToggleState] = useState(0);

    const handleItemClick = (id) => {
        navigate(`/message/detail/${id}`, {
            state: { type: toggleState === 0 ? "receive" : "sent" }
        });
    };


    return (
        <Page>
            <TopBar title="쪽지 내역"/>
            <ToggleContainer>
                <Toggle state={toggleState === 0} onClick={() => setToggleState(0)}>
                받은 쪽지
                </Toggle>
                <Toggle state={toggleState === 1} onClick={() => setToggleState(1)}>
                    보낸 쪽지
                </Toggle>
            </ToggleContainer>
        <IndexContainer>
            {toggleState === 0 ? "보낸 이웃" : "받은 이웃"}
            <div>내용</div>
            <div>날짜</div>
        </IndexContainer>
        <ScrollableContent style={{padding: "0 20px", paddingBottom: 200, backgroundColor: '#f5f6f6'}}>
          <Column $gap={6}>
            {toggleState === 0
            ? receivedMessages.map((entry) => (
                <MessageItem
                    entry={entry}
                    onClick={()=>handleItemClick(entry.id)}
                />
              ))
            : sentMessages.map((entry) => (
                <MessageItem
                    entry={entry}
                    onClick={()=>handleItemClick(entry.id)}
                />
              ))}
          </Column>
        </ScrollableContent>
    </Page>
    )
}

const ToggleContainer = styled.div`
  width: 100%;

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
`;

const Toggle = styled.div`
  width: 50%;
  padding: 10px 0px;
  cursor: pointer;

  display: flex;
  justify-content: center;
  align-items: center;

  ${(props) =>
    props.state
      ? css`
          border-bottom: 2px solid #323232;
          color: #1f1f1f;
          ${typo('subtitle1')};
        `
      : css`
          border-bottom: 2px solid #dedede;
          color:${color('grayscale.600')};
          ${typo('body1')};
        `}
`;

const IndexContainer = styled.div`
  width: 100%;
  padding: 20px 27px 10px 27px;

  background: #f5f6f6;
  ${typo('body2')};
  color: ${color('grayscale.500')};

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
