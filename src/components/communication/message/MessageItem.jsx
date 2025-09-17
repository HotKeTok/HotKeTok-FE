import React from "react";
import styled from "styled-components";
import { formatDateToYMD } from "../../../utils/dateFormat";
import { color, typo } from "../../../styles/tokens";

export default function MessageItem({ entry = {}, onClick }) {
  const { id, senderId, anonymity, content, createdAt } = entry || {};

  function handleClick() {
    if (typeof onClick === "function") onClick(id);
  }

  return (
    <Content role="button" onClick={handleClick} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && handleClick()}>
      <SenderLabel>
        {anonymity ? "익명" : `${senderId}호`}
      </SenderLabel>

      <MessageBody title={content}>
        {content}
      </MessageBody>

      <DateBox>{formatDateToYMD(createdAt)}</DateBox>
    </Content>
  );
}

const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;

  padding: 12px 10px;
  border-radius: 10px;

  cursor: pointer;
  background: #fff;

  &:hover {
    background: #f7f8fa;
  }
  &:focus {
    outline: 2px solid rgba(1, 210, 129, 0.2);
  }

`;

const SenderLabel = styled.div`
  min-width: 58px;
  margin: auto;

  color: ${color('grayscale.800')};
  ${typo('button2')};

  text-align:left;
  white-space: nowrap;
`;

const MessageBody = styled.div`
  flex: 1;
  text-align: left;

  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 줄 수 제한(2줄) */
  -webkit-box-orient: vertical;
  word-break: keep-all;

  color: ${color('grayscale.800')};
  ${typo('body2')};
`;

const DateBox = styled.div`
 color: ${color('grayscale.500')}; 
 ${typo('caption1')};

  white-space: nowrap;
  margin-left: 12px;
  text-align: right;

  min-width: 58px;
`;
