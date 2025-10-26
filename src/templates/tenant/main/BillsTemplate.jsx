import { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { ScrollableContent } from '../../../styles/layout';
import TopBar from '../../../components/common/TopBar';
import { typo, color } from '../../../styles/tokens';
import TabBar from '../../../components/common/TabBar';
import { Column, Row } from '../../../styles/flex';
import YearSelect from '../../../components/main/bills/YearSelect';
import MonthBillsItem from '../../../components/main/bills/MonthBillsItem';
import BottomSheet from '../../../components/common/BottomSheet';
import { Page } from '../../../styles/layout';
import { TOP_BAR_HEIGHT } from '../../../styles/layout';
import GraphUtilityBills from '../../../components/main/bills/GraphUtilityBills';
import ModalBillDetail from '../../../components/main/bills/ModalBillDetail';

const TabBarText = [
  { id: 1, text: '공과금' },
  { id: 2, text: '공동 관리비' },
];

const monthsLabel = m => `${m}월`;
const won = n => `${n.toLocaleString()}원`;

export default function BillsTemplate({
  activeTab,
  setActiveTab,
  year,
  setYear,

  billList,
  commonBillDetail,
  fetchCommonBillsDetail,
  loading,
  modalLoading,
}) {
  const scrollRef = useRef(null);

  const [modal, setModal] = useState(false);
  const [selectedUtilityBill, setSelectedUtilityBill] = useState(null); // 선택된 공과금 내역

  // 유저 보유 연도 (목데이터)
  const userYears = [2025, 2024, 2023, 2022];

  // 탭이 바뀔 때마다 스크롤 위로
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTab]);

  const handleOpenDetailModal = (year, month) => {
    if (activeTab === '공동 관리비') {
      fetchCommonBillsDetail(year, month);
    } else {
      const bill = billList.find(item => item.month === month);
      setSelectedUtilityBill(bill);
    }
    setModal(true);
  };

  const latest = billList ? billList.map(item => item).sort((a, b) => b.month - a.month)[0] : null;
  const LATEST_DATE = latest ? `${year}년 ${latest.month}월분` : '';
  const LATEST_COST = latest ? latest.balance : 0;

  const sorted = billList ? billList.map(item => item).sort((a, b) => b.month - a.month) : [];

  return (
    <Wrapper>
      <TopBar title="내역 보기" />
      <div style={{ position: 'sticky', top: 0, zIndex: 10, backgroundColor: 'white' }}>
        <TabBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          tabTexts={TabBarText.map(tab => tab.text)}
        />
      </div>

      {/* 공통 바텀시트 */}
      <BottomSheet isOpen={modal} onClose={() => setModal(false)} height={'90%'}>
        <ModalBillDetail
          loading={modalLoading}
          year={year}
          month={activeTab === '공과금' ? selectedUtilityBill?.month : commonBillDetail?.month}
          utilityBillData={selectedUtilityBill}
          commonBillData={commonBillDetail}
          onClose={() => setModal(false)}
          tab={activeTab}
        />
      </BottomSheet>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px' }}>데이터를 불러오는 중입니다..</div>
      ) : (
        <ScrollableContent
          ref={scrollRef}
          style={{ height: `calc(100vh - ${TOP_BAR_HEIGHT} - 40px)` }}
        >
          <Content>
            <Row $align="flex-end" $justify="space-between" style={{ marginBottom: 20 }}>
              <Column $gap={4} $align="flex-start" style={{ marginBottom: 10 }}>
                {billList && (
                  <>
                    <Date>{LATEST_DATE}</Date>
                    <MainCost>{won(LATEST_COST)}</MainCost>
                  </>
                )}
              </Column>
              {activeTab === '공동 관리비' && (
                <ListHeader>
                  <YearSelect value={year} onChange={setYear} years={userYears} />
                </ListHeader>
              )}
            </Row>

            {activeTab === '공과금' && (
              <>
                <GraphUtilityBills year={year} />
                <ListHeader style={{ marginBottom: 10 }}>
                  <YearSelect value={year} onChange={setYear} years={userYears} />
                </ListHeader>
              </>
            )}

            <List>
              {sorted.length !== 0 ? (
                sorted.map(item => (
                  <MonthBillsItem
                    key={`${year}-${item.month}`}
                    year={year}
                    item={item}
                    monthsLabel={monthsLabel}
                    won={won}
                    onClick={() => handleOpenDetailModal(year, item.month)}
                  />
                ))
              ) : (
                <Row $justify="center" style={{ marginTop: 50 }}>
                  {year}년 내역이 없습니다.
                </Row>
              )}
            </List>
          </Content>
        </ScrollableContent>
      )}
    </Wrapper>
  );
}

const Wrapper = styled(Page)`
  background-color: #fff;
  position: relative;
`;

const Content = styled.div`
  padding: 24px 25px;
`;

const Date = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.700')};
`;

const MainCost = styled.div`
  ${typo('h2')};
  color: ${color('brand.primary')};
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  ${typo('button2')};
  color: ${color('grayscale.600')};
  padding: 6px 16px;
`;

/* 리스트 */

const List = styled.ul`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
