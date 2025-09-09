import styled from "styled-components";
import { typo, color } from "../../styles/tokens";

export default function TabBar({activeTab, setActiveTab, tabTexts}){
    return (
        <StyledTabBar>
                <Tab
                  $active={activeTab === tabTexts[0]}
                  onClick={() => setActiveTab(tabTexts[0])}
                >
                  {tabTexts[0]}
                </Tab>
                <Tab
                  $active={activeTab === tabTexts[1]}
                  onClick={() => setActiveTab(tabTexts[1])}
                >
                  {tabTexts[1]}
                </Tab>
        </StyledTabBar>
    )
}


const StyledTabBar = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #efefef;
`;

const Tab = styled.button`
  flex: 1;
  height: 39px;
  border: 0;
  background: none;
  cursor: pointer;

  ${typo('subtitle1')}

  color: ${(p) => (p.$active ? color('grayscale.800') : color('grayscale.400'))};
  border-bottom: ${(p) => (p.$active ? "1.5px solid #323232" : "1.5px solid transparent")};

  transition: color 0.2s ease, border-bottom-color 0.2s ease;
`;
