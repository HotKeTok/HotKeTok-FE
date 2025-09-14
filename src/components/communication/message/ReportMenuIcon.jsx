import { useState } from "react";
import styled from "styled-components";
import MenuIcn from "../../../assets/common/icon-menu.svg?react";
import { color, typo } from "../../../styles/tokens";

export default function ReportMenuIcon({ onClick }) {
  const [showReport, setShowReport] = useState(false);

  const handleMenuClick = () => {
    setShowReport(prev => !prev); // 메뉴 클릭 시 토글
  };

  const handleReportClick = () => {
    onClick(); // 부모에서 정의한 onClick 실행
    setShowReport(false); // 버튼 숨기기
  };

  return (
    <Wrapper>
      <MenuWrapper onClick={handleMenuClick}>
        <MenuIcn />
      </MenuWrapper>

      {showReport && (
        <ReportButton onClick={handleReportClick}>
          신고하기
        </ReportButton>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const MenuWrapper = styled.div`
  cursor: pointer;
`;

const ReportButton = styled.div`
  position: absolute;
  top: 100%;
  right: 30%;
  padding: 16px 22px;

  background-color: ${color('grayscale.100')};
  border-radius: 10px;

  cursor: pointer;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.15);
  white-space: nowrap;
  z-index: 10;

  ${typo('body1')}

  &:active {
    background-color: ${color('grayscale.200')};
  }
`;
