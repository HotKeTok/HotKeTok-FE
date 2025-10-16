import React, { useState } from 'react';
import TopBar from '../common/TopBar';
import TextField from '../common/TextField';
import ButtonSmall from '../common/ButtonSmall';
import { Row, Column } from '../../styles/flex';
import { getProgressRange } from './progress';
import ProgressBar from './ProgressBar';
import {
  PageWrap,
  StepTitle,
  Label,
  ExampleTitle,
  ExampleDesc,
  ListWrap,
  AddressCard,
  Addr,
  Jibun,
  JibunAddr,
} from './InitProcessStyles';

export default function StepAddressKeyword({
  defaultKeyword,
  onPick,
  onBack,
  titleText,
  onSearchAddress,
  loading,
}) {
  const [keyword, setKeyword] = useState(defaultKeyword ?? '');
  const [results, setResults] = useState([]);
  const [showExamples, setShowExamples] = useState(true);

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    const res = await onSearchAddress({ keyword: keyword.trim(), page: 0, pageSize: 5 });
    if (res?.success) {
      setResults(res.items || []);
      setShowExamples(false);
    } else {
      setResults([]);
      setShowExamples(false);
    }
  };

  return (
    <PageWrap>
      <TopBar title="회원 등록" onBack={onBack} />
      <ProgressBar {...getProgressRange('AddressKeyword')} />
      <StepTitle>{titleText || '주소를 등록해주세요'}</StepTitle>

      <div style={{ padding: '0 27px' }}>
        <Column $gap={2} style={{ marginBottom: 30 }}>
          <Label>주소 검색</Label>
          <Row $gap={6}>
            <TextField
              placeholder="예) 판교역로 235, 도산대로 33"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
            />
            <ButtonSmall
              text={loading?.searchingAddress ? '검색중...' : '검색'}
              width="30%"
              active={!!keyword.trim() && !loading?.searchingAddress}
              onClick={handleSearch}
              disabled={loading?.searchingAddress}
            />
          </Row>
        </Column>

        {showExamples && (
          <Column $gap={10} style={{ marginTop: 30 }}>
            <Row $gap={10}>
              <ExampleTitle>도로명</ExampleTitle>
              <ExampleDesc>예) 판교역로 235, 도산대로 8길 23</ExampleDesc>
            </Row>
            <Row $gap={10}>
              <ExampleTitle>동주소</ExampleTitle>
              <ExampleDesc>예) 연희동 42-18</ExampleDesc>
            </Row>
            <Row $gap={10}>
              <ExampleTitle>건물명</ExampleTitle>
              <ExampleDesc>예) 텐즈힐</ExampleDesc>
            </Row>
          </Column>
        )}

        {!showExamples && results.length > 0 && (
          <ListWrap style={{ marginTop: 16 }}>
            {results.map((a, i) => (
              <AddressCard key={i} onClick={() => onPick(a)}>
                <Column $gap={10}>
                  <Addr>{a.roadAddr}</Addr>
                  <Row $gap={8} $align="center">
                    <Jibun>지번</Jibun>
                    <JibunAddr>{a.jibunAddr || ''}</JibunAddr>
                  </Row>
                </Column>
              </AddressCard>
            ))}
          </ListWrap>
        )}

        {!showExamples && results.length === 0 && !loading?.searchingAddress && (
          <div style={{ marginTop: 16, color: '#767676', fontSize: 14 }}>
            검색 결과가 없습니다. 키워드를 다시 입력해주세요.
          </div>
        )}
      </div>
    </PageWrap>
  );
}
