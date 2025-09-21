import React, { useState } from 'react';
import styled from 'styled-components';
import { color, typo } from '../../../styles/tokens';
import IconChecked from '../../../assets/common/icon-checked.svg?react';
import IconUnChecked from '../../../assets/common/icon-unchecked.svg?react';
import { TAG_DATA } from '../../../constants/tenant/main/communication/tag';
import { Row } from '../../../styles/flex';
import { TIME_OPTIONS } from '../../../constants/tenant/main/communication/message';

export default function WriteFormContent({ selectedId }) {
  const [anonymity, setAnonymity] = useState(true);
  const [tag, setTag] = useState([]);
  const [descript, setDescript] = useState('');
  const [silenceTime, setSilenceTime] = useState('');

  const toggleTag = id => {
    setTag(prev => {
      if (prev.includes(id)) return prev.filter(x => x !== id);
      return [...prev, id];
    });
  };

  const isSelected = id => tag.includes(id);

  return (
    <ContentContainer>
      <BasicInfoContainer>
        {/* 1. 받는 이웃 */}
        <BasicInfoRow>
          <BasicInfoIndex>받는 이웃</BasicInfoIndex>
          <Body1 style={{ color: `#1f1f1f` }}>{selectedId}호</Body1>
        </BasicInfoRow>

        {/* 익명 여부 */}
        <BasicInfoRow>
          <BasicInfoIndex>익명 여부</BasicInfoIndex>
          <Row $align="center">
            <CheckBtnContainer onClick={() => setAnonymity(v => !v)}>
              {anonymity ? <IconChecked /> : <IconUnChecked />}
            </CheckBtnContainer>
            <Caption2 style={{ color: '#9a9a9a' }}>쪽지가 익명으로 전송돼요.</Caption2>
          </Row>
        </BasicInfoRow>

        {/* 태그 선택 */}
        <BasicInfoColumn>
          <BasicInfoSmallColumn>
            <BasicInfoIndex>태그</BasicInfoIndex>
            <BasicInfoDescript>다중선택이 가능해요.</BasicInfoDescript>
          </BasicInfoSmallColumn>
          <TagTotalContainer>
            <TagRowContainer>
              {TAG_DATA.map(tagItem => {
                const selected = isSelected(tagItem.id);
                // 3. 선택 상태에 따라 적절한 아이콘 컴포넌트를 변수에 할당합니다.
                const IconComponent = selected ? tagItem.activeIcon : tagItem.icon;

                return (
                  <IconWrap
                    key={tagItem.id}
                    selected={selected}
                    onClick={() => toggleTag(tagItem.id)}
                  >
                    <IconComponent />
                  </IconWrap>
                );
              })}
            </TagRowContainer>
          </TagTotalContainer>
        </BasicInfoColumn>
      </BasicInfoContainer>

      {/* 침묵 시간대 선택 */}
      <BasicInfoContainer>
        <BasicInfoSmallColumn>
          <BasicInfoIndex>이 시간대에는 침묵을 지켜주세요.</BasicInfoIndex>
          <BasicInfoDescript>층간소음을 원하지 않는 시간대를 선택 해주세요.</BasicInfoDescript>
        </BasicInfoSmallColumn>
        <TimeSelect value={silenceTime} onChange={e => setSilenceTime(e.target.value)}>
          <option value="" disabled>
            시간 선택
          </option>
          {TIME_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TimeSelect>
      </BasicInfoContainer>

      {/* 상세 작성 */}
      <BasicInfoContainer style={{ gap: 5 }}>
        <BasicInfoIndex>상세 작성</BasicInfoIndex>
        <BasicInfoDescript>이웃에게 보낼 메세지를 작성해주세요.</BasicInfoDescript>

        <DescriptInput
          placeholder="이웃에게 불쾌감을 줄 수 있는 내용은 삼가해 주세요."
          value={descript}
          onChange={e => setDescript(e.target.value)}
          maxLength={100}
        />
        <WordCountContainer>
          <span style={{ color: '#a8a8a8' }}>
            <strong>{descript.length} / 100</strong>
          </span>
        </WordCountContainer>
      </BasicInfoContainer>
    </ContentContainer>
  );
}

const ContentContainer = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  gap: 30px;
  margin-bottom: 70px;

  padding: 24px 20px;
`;

const BasicInfoContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 30px;
`;

const BasicInfoRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
`;

const BasicInfoColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 15px;
`;

const BasicInfoSmallColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  gap: 2px;
  color: #1f1f1f;
`;

const BasicInfoIndex = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.700')};
`;

const Caption2 = styled.div`
  ${typo('caption2')};
`;

const BasicInfoDescript = styled(Caption2)`
  text-align: left;
  color: ${color('grayscale.600')};
`;

const CheckBtnContainer = styled.button`
  cursor: pointer;
  background: transparent;
  border: none;
  padding: 6px;
  display: flex;
  align-items: center;
`;

const TagTotalContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

const TagRowContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const IconWrap = styled.span`
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  & > svg {
    width: 100%;
    height: 100%;
  }
`;

const DescriptInput = styled.input`
  border: none;
  outline: none;
  width: 100%;
  display: flex;
  padding: 13px 15px;
  border-radius: 6px;
  border: 1px solid #efefef;
  background-color: #fafafb;
  color: #1f1f1f;

  &::placeholder {
    color: #a8a8a8;
    ${typo('body2')}
    color: ${color('grayscale.500')};
  }
`;

const WordCountContainer = styled(Caption2)`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const Body1 = styled.div`
  ${typo('body1')};
`;

const TimeSelect = styled.select`
  border: none;
  outline: none;
  width: 100%;
  display: flex;
  padding: 13px 15px;
  border-radius: 6px;
  border: 1px solid #efefef;
  background-color: #fafafb;
  ${typo('body2')};

  color: ${props => (props.value === '' ? '#9a9a9a' : '#1f1f1f')};

  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%208l5%205%205-5%22%20stroke%3D%22%239A9A9A%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E');
  background-repeat: no-repeat;
  background-position: right 15px center;
  background-size: 1em;
  cursor: pointer;

  option {
    color: #1f1f1f;
  }
`;
