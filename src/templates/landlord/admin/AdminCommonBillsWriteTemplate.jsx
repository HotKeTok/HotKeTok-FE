import TopBar from '../../../components/common/TopBar';
import {
  BottomButtonContainer,
  PageWithoutBottomBar,
  ScrollableNoBottomBarContent,
} from '../../../styles/layout';
import styled, { css } from 'styled-components';
import { typo, color } from '../../../styles/tokens';
import { Column, Row } from '../../../styles/flex';
import { useState } from 'react';
import { formatDateToYMD } from '../../../utils/dateFormat';
import CalendarIcn from '../../../assets/common/icon-calendar.svg?react';
import Button from '../../../components/common/Button';
import BaseModal from '../../../components/common/BaseModal';
import Calendar from '../../../components/common/Calendar';
import { useNavigate } from 'react-router-dom';
import { formatNumberWithCommas } from '../../../utils/number'; // 콤마 포맷팅 함수 import

export default function AdminCommonBillsWriteTemplate() {
  const navigate = useNavigate();

  const today = formatDateToYMD(new Date());
  const [date, setDate] = useState(today);
  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [type, setType] = useState('income'); // 'income' | 'expense'
  const [content, setContent] = useState('');
  const [amount, setAmount] = useState(''); // State에는 콤마 없는 순수 숫자 문자열만 저장

  // 모든 인풋이 채워졌는지 확인하는 유효성 검사 함수
  const isValidForm = () => {
    return (
      content.trim() !== '' && amount.trim() !== '' && !isNaN(Number(amount)) && Number(amount) > 0
    );
  };

  const handleFormSubmit = () => {
    if (!isValidForm()) return;
    // 제출 시에는 콤마 없는 순수 숫자인 amount state를 사용
    console.log({ date, type, content, amount });
    navigate(-1); // 이전 페이지로 이동
  };

  const handleDateConfirm = selectedDate => {
    setDate(selectedDate);
    setDateModalOpen(false);
  };

  // 금액 입력 처리를 위한 핸들러
  const handleAmountChange = e => {
    const pureNumber = e.target.value.replace(/,/g, '');

    if (pureNumber === '' || !isNaN(pureNumber)) {
      setAmount(pureNumber);
    }
  };

  return (
    <PageWithoutBottomBar>
      <TopBar title="공동 관리비 기록" />
      <ScrollableNoBottomBarContent style={{ paddingLeft: 24, paddingRight: 24 }}>
        <Column $gap={40} style={{ marginTop: 30, width: '100%' }}>
          {/* 날짜 영역 */}
          <Row $justify="space-between" $align="center" style={{ width: '100%' }}>
            <Row $gap={20} $align="center">
              <Label>날짜</Label>
              <DateText>{date.toString()}</DateText>
            </Row>
            <DateButton
              $gap={10}
              $justify="center"
              $align="center"
              onClick={() => setDateModalOpen(true)}
            >
              <CalendarIcn />
              <span>날짜 선택</span>
            </DateButton>
          </Row>
          {/* 내용 영역 */}
          <Column $gap={10} style={{ width: '100%' }}>
            <Label>내용</Label>
            <Row $gap={10} style={{ width: '100%' }}>
              <CustomBtn $active={type === 'income'} onClick={() => setType('income')}>
                입금
              </CustomBtn>
              <CustomBtn $active={type === 'expense'} onClick={() => setType('expense')}>
                출금
              </CustomBtn>
            </Row>
            <Input
              type="text"
              placeholder="내용을 입력하세요.(예: 전기공사)"
              value={content}
              onChange={e => setContent(e.target.value)}
            />
          </Column>
          {/* 금액 영역 */}
          <Column $gap={10} style={{ width: '100%' }}>
            <Label>금액</Label>
            <Row $gap={5} $align="center">
              <Input
                value={amount === '' ? '' : formatNumberWithCommas(Number(amount))}
                onChange={handleAmountChange}
                type="text"
                inputMode="numeric"
                placeholder="금액을 입력하세요.(예: 12,000)"
              />
              <Unit>원</Unit>
            </Row>
          </Column>
        </Column>
      </ScrollableNoBottomBarContent>
      <BottomButtonContainer>
        <Button active={isValidForm()} text="기록하기" onClick={handleFormSubmit} />
      </BottomButtonContainer>

      {/* 달력 모달 */}
      <BaseModal
        isOpen={dateModalOpen}
        onClose={() => setDateModalOpen(false)}
        showCloseIcon={false}
      >
        <Calendar
          selectedDate={date}
          onClose={() => setDateModalOpen(false)}
          onConfirm={handleDateConfirm}
        />
      </BaseModal>
    </PageWithoutBottomBar>
  );
}

const Label = styled.div`
  ${typo('body1')}
  color: ${color('grayscale.700')};
`;

const DateText = styled.div`
  color: ${color('grayscale.800')};
  ${typo('subtitle1')}
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  background-color: ${color('grayscale.100')};
  border: 1px solid ${color('grayscale.200')};
  border-radius: 8px;
  ${typo('body1')}
  color: ${color('grayscale.900')};
  &::placeholder {
    color: ${color('grayscale.400')};
  }
  &:focus {
    border-color: ${color('brand.primary')};
    outline: none;
  }
  -moz-appearance: textfield;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const DateButton = styled(Row)`
  padding: 10px 20px;
  border-radius: 30px;
  background-color: ${color('brand.primary')};
  ${typo('button1')}
  color: white;
  cursor: pointer;
`;

const Unit = styled.span`
  ${typo('h3')}
  color: ${color('grayscale.700')};
`;

const CustomBtn = styled.button`
  width: 50%;
  height: 44px;
  border-radius: 8px;
  ${typo('button2')};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  ${props =>
    props.$active
      ? css`
          background-color: ${color('brand.primary')};
          color: white;
          border: 1px solid ${color('brand.primary')};
        `
      : css`
          background-color: white;
          border: 1px solid ${color('grayscale.300')};
          color: ${color('grayscale.600')};
        `}
`;
