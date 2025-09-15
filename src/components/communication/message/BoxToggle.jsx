import React, { useState, useRef } from "react";
import styled, { css } from "styled-components";
import ArrowDown from "../../../assets/common/icon-arrow-down.svg?react";
import Compliment from "../../../assets/communication/message/tag/Tag_Compliment_black.svg?react";
import Noise from "../../../assets/communication/message/tag/Tag_Noise_black.svg?react";
import Quiet from "../../../assets/communication/message/tag/Tag_Quiet_black.svg?react";
import Sleeping from "../../../assets/communication/message/tag/Tag_Sleeping_black.svg?react";
import { typo } from "../../../styles/tokens";

export default function BoxToggle ({ floor, handleSelectReceiver, selectedId }) {
  const [isOpen, setIsOpen] = useState(false);

  const contentRef = useRef(null);

  const toggleHandler = () => {
    setIsOpen((prev) => !prev);
  };

  // TODO: api에서 받아온 호수 데이터 매핑, tag 여러개 처리

  return (
    <ToggleContainer>
      <ToggleHeader onClick={toggleHandler}>
        <Subtitle1>{floor}층</Subtitle1>
        <Arrow
          isOpen={isOpen}
          src={ArrowDown}
          style={{ width: 10, objectFit: "cover" }}
        ><ArrowDown/>
        </Arrow>
      </ToggleHeader>

      <ToggleContentContainer
        ref={contentRef}
        isOpen={isOpen}
        maxHeight={contentRef.current?.scrollHeight}
      >
        <ToggleContent
          onClick={() => handleSelectReceiver(floor * 100 + 1)}
          state={selectedId === floor * 100 + 1}
        >
          <Body2 className="body2">{floor}01호</Body2>
          <Compliment />
        </ToggleContent>
        <ToggleContent
          onClick={() => handleSelectReceiver(floor * 100 + 2)}
          state={selectedId === floor * 100 + 2}
        >
          <Body2 className="body2">{floor}02호</Body2>
          <Sleeping />
        </ToggleContent>
        <ToggleContent
          onClick={() => handleSelectReceiver(floor * 100 + 3)}
          state={selectedId === floor * 100 + 3}
        >
          <Body2 className="body2">{floor}03호</Body2>
        </ToggleContent>
        <ToggleContent
          onClick={() => handleSelectReceiver(floor * 100 + 4)}
          state={selectedId === floor * 100 + 4}
        >
          <Body2 className="body2">{floor}04호</Body2>
          <Quiet/>
        </ToggleContent>
        <ToggleContent
          onClick={() => handleSelectReceiver(floor * 100 + 5)}
          state={selectedId === floor * 100 + 5}
        >
          <Body2 className="body2">{floor}05호</Body2>
          <Noise/>
        </ToggleContent>
      </ToggleContentContainer>
    </ToggleContainer>
  );
};

const ToggleContainer = styled.div`
  width: 100%;
  padding: 16px 14px;

  border: 1px solid #efefef;
  border-radius: 10px;
  background: #fafafb;
  overflow: hidden;
`;

const ToggleHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background: #f9f9f9;
  font-weight: bold;
  font-size: 18px;

  color: #1f1f1f;
`;

const Arrow = styled.div`
  transition: transform 0.3s ease;
  transform: rotate(${(props) => (props.isOpen ? "180deg" : "0deg")});
  width: 10px;
  object-fit: cover;
`;

const ToggleContentContainer = styled.div`
  overflow: hidden;
  padding: ${(props) => (props.isOpen ? "16px 0px" : "0px 0px")};

  max-height: ${(props) => (props.isOpen ? `400px` : "0px")};
  transition: max-height 0.3s ease, padding 0.5s ease;

  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
`;

const ToggleContent = styled.div`
  height: 60px;
  padding: 0px 15px;
  background-color: #fff;
  border-radius: 10px;
  border: 1.5px solid #dedede;
  width: 100%;
  color: black;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  cursor: pointer;

  ${(props) =>
    props.state
      ? css`
          border: 1.5px solid var(--Color-Primary, #01d281);
        `
      : css``}
`;


const Subtitle1 = styled.div`
    ${typo('subtitle1')};
`

const Body2= styled.div`
    ${(typo('body2'))};
`