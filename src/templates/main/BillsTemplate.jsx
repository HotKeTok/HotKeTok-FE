// pages/BillsTemplate.jsx
import { useMemo, useState } from "react";
import styled from "styled-components";
import { ScrollableNoBottomBarContent,} from "../../styles/layout";
import TopBar from "../../components/common/TopBar";
import { typo, color } from "../../styles/tokens";
import TabBar from "../../components/common/TabBar";
import ChartCostSplitBar from "../../components/main/bills/ChartCostSplitBar";
import ChartUsageLine from "../../components/main/bills/ChartUsageLine";
import { Column, Row } from "../../styles/flex";
import YearSelect from "../../components/main/bills/YearSelect"
import BillItem from "../../components/main/bills/BillItem";
import BottomSheet from "../../components/common/BottomSheet";

export default function BillsTemplate({ activeTab, setActiveTab }) {
  const [modal, setModal] = useState(false);
  const [year, setYear] = useState(2024);

  // 유저 보유 연도 (목데이터)
  const userYears = [2024, 2023, 2022];

  // 연도별 월 내역 (목데이터) — 최신월이 위로 오도록 month desc.
  const billsByYear = {
    2024: [
      { month: 10, value: 130410, paidAt: "2024.10.11" },
      { month: 9, value: 132100, paidAt: "2024.9.11" },
      { month: 8, value: 141020, paidAt: "2024.8.11" },
      { month: 7, value: 140410, paidAt: "2024.7.11" },
      { month: 6, value: 135210, paidAt: "2024.6.11" },
    ],
    2023: [
      { month: 12, value: 124000, paidAt: "2023.12.10" },
      { month: 11, value: 118400, paidAt: "2023.11.10" },
      { month: 10, value: 133200, paidAt: "2023.10.10" },
    ],
    2022: [
      { month: 12, value: 99000, paidAt: "2022.12.10" },
      { month: 11, value: 102300, paidAt: "2022.11.10" },
    ],
  };

  const monthsLabel = (m) => `${m}월`;
  const won = (n) => `${n.toLocaleString()}원`;

  const currentList = billsByYear[year] ?? [];
  const latest = useMemo(
    () => (currentList.length ? currentList[0] : null),
    [currentList]
  );

  const LATEST_DATE = latest ? `${year}년 ${latest.month}월` : "";
  const LATEST_COST = latest ? latest.value : 0;

  const TabBarText = [
    { id: 1, text: "공과금" },
    { id: 2, text: "공동 관리비" },
  ];

  return (
    <Wrapper>
    <div style={{ position: "sticky", top: 0, zIndex: 10, backgroundColor: "white" }}> 
     <TopBar title="내역 보기" />
      <TabBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        tabTexts={TabBarText.map((tab) => tab.text)}
      />
        </div>

        {
            <BottomSheet isOpen={modal} onClose={() => setModal(false)} height={"90%"}>
                <div>Modal Content</div>
            </BottomSheet>
        }

<ScrollableContainer>
    <Content>
        <Column $gap={4} $align="flex-start" style={{ marginBottom: 10 }}>
          <Date>{LATEST_DATE}</Date>
          <MainCost>{won(LATEST_COST)}</MainCost>
        </Column>

        {activeTab === "공과금" && (
          <ChartUsageLine
            year={year}
            // monthly={lineMonthly.map(({ month, value }) => ({ month, value }))}
          />
        )}

        <ListHeader>
          <YearSelect value={year} onChange={setYear} years={userYears} />
        </ListHeader>

        <List>
          {currentList.map((item) => (
            <BillItem
              key={`${year}-${item.month}`}
              year={year}
              item={item}
              monthsLabel={monthsLabel}
              won={won}
              onClick={() => setModal(true)}
            />
          ))}
        </List>
      </Content>
</ScrollableContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
    background-color: #fff;
    position: relative;
`

const ScrollableContainer = styled(ScrollableNoBottomBarContent)`
`;

const Content = styled.div`
  padding: 24px 25px;
`;

const Date = styled.div`
  ${typo("body2")};
  color: ${color("grayscale.700")};
`;

const MainCost = styled.div`
  ${typo("h2")};
  color: ${color("brand.primary")};
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  ${typo("button2")};
  color: ${color("grayscale.600")};
  padding: 6px 16px;
`;

/* 리스트 */

const List= styled.ul`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
`