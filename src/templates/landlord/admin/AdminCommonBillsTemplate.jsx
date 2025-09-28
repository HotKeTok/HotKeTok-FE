import React, { useState } from 'react'; // useState 추가
import TopBar from '../../../components/common/TopBar';
import { PageWithoutBottomBar, ScrollableNoBottomBarContent } from '../../../styles/layout';
import { typo, color } from '../../../styles/tokens';
import EmptyBills from '../../../assets/landlord/admin/Empty_Bills.svg?react';
import ButtonFixed from '../../../components/common/ButtonFixed';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import BillItem from '../../../components/main/bills/BillItem';
import { Column } from '../../../styles/flex';
import BillSummary from '../../../components/main/bills/BillSummary';
import Dropdown from '../../../components/common/Dropdown'; // DateDropdown 대신 Dropdown을 import

export default function AdminCommonBillsTemplate({ billsList, year, month, setYear, setMonth }) {
  const navigate = useNavigate();

  const [isYearOpen, setIsYearOpen] = useState(false);
  const [isMonthOpen, setIsMonthOpen] = useState(false);

  // 드롭다운에 표시할 년/월 옵션 데이터
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => ({
    label: `${currentYear - i}년`,
    value: currentYear - i,
  }));
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    label: `${i + 1}월`,
    value: i + 1,
  }));

  // 3. Dropdown에서 항목 선택 시 실행될 핸들러 함수
  const handleYearSelect = selectedItem => {
    setYear(selectedItem.value);
  };
  const handleMonthSelect = selectedItem => {
    setMonth(selectedItem.value);
  };

  const handleWriteBillBtnClick = () => {
    navigate(`/admin/common-bills/write`);
  };

  const dropdownButtonStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '44px',
    padding: '6px 16px',
    backgroundColor: '#fafafb',
    border: `1px solid #dedede`,
    borderRadius: '10px',
    color: color('grayscale.800'),
  };

  const menuStyle = {
    width: '100%',
    alignItems: 'center',
    textAlign: 'center',
  };

  return (
    <PageWithoutBottomBar>
      <TopBar title="공동 관리비 현황" />

      <ScrollableNoBottomBarContent
        style={{ paddingLeft: 27, paddingRight: 27, paddingBottom: 80, paddingTop: 0 }}
      >
        <FilterContainer>
          <Dropdown
            isOpen={isYearOpen}
            toggleDropdown={() => setIsYearOpen(!isYearOpen)}
            closeDropdown={() => setIsYearOpen(false)}
            selected={`${year}년`}
            setSelected={handleYearSelect}
            items={yearOptions}
            buttonStyle={dropdownButtonStyle}
            menuStyle={menuStyle}
          />
          <Dropdown
            isOpen={isMonthOpen}
            toggleDropdown={() => setIsMonthOpen(!isMonthOpen)}
            closeDropdown={() => setIsMonthOpen(false)}
            selected={`${month}월`}
            setSelected={handleMonthSelect}
            items={monthOptions}
            buttonStyle={dropdownButtonStyle}
            menuStyle={menuStyle}
          />
        </FilterContainer>
        {billsList.transactions.length === 0 ? (
          <Column
            $gap={10}
            $justify="center"
            $align="center"
            style={{ width: '100%', height: '90%' }}
          >
            <EmptyBills />
            <EmptyText>아직 추가된 공동 관리비 내역이 없어요.</EmptyText>
          </Column>
        ) : (
          <Column $gap={30}>
            <BillSummary
              month={month}
              balance={billsList.summary.balance}
              income={billsList.summary.income}
              expense={billsList.summary.expense}
            />
            <Column $gap={14}>
              {billsList.transactions.map(bill => (
                <BillItem key={bill.id} {...bill} />
              ))}
            </Column>
          </Column>
        )}
      </ScrollableNoBottomBarContent>
      <ButtonFixed text="관리비 내역 추가하기" onClick={handleWriteBillBtnClick} />
    </PageWithoutBottomBar>
  );
}

// --- Styled Components ---

const FilterContainer = styled.div`
  width: 100%;
  margin-bottom: 24px;

  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const EmptyText = styled.div`
  ${typo('body1')}
  color: ${color('grayscale.500')};
`;
