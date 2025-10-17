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
  ContentArea,
  EmptyText,
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
    const res = await onSearchAddress({ keyword: keyword.trim(), page: 0, pageSize: 10 });
    if (res?.success) {
      setResults(res.items || []);
      setShowExamples(false);
    } else {
      setResults([]);
      setShowExamples(false);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (loading?.searchingAddress) return;
    handleSearch();
  };
  return (
    <PageWrap>
      <TopBar title="회원 등록" onBack={onBack} />
      <ProgressBar {...getProgressRange('AddressKeyword')} />
      <StepTitle>{titleText || '주소를 등록해주세요'}</StepTitle>

      <ContentArea>
        <Column $gap={2} style={{ marginBottom: 30 }}>
          <Label>주소 검색</Label>
          <Row as="form" $gap={6} onSubmit={handleSubmit}>
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
              type="submit"
            />
          </Row>
        </Column>

        {showExamples && (
          <Column $gap={10}>
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
          <ListWrap>
            {results.map((a, i) => {
              // 괄호 안쪽 주소 분리
              const match = (a.roadAddr || '').match(/^(.*?)\s*(\(.*\))$/);
              const mainAddr = match ? match[1] : a.roadAddr;
              const subAddr = match ? match[2] : '';

              return (
                <AddressCard key={i} onClick={() => onPick(a)}>
                  <Column $gap={10}>
                    <Addr>
                      {mainAddr}
                      {subAddr && (
                        <>
                          <br />
                          <div>{subAddr}</div>
                        </>
                      )}
                    </Addr>
                    <Row $gap={8} $align="center">
                      <Jibun>지번</Jibun>
                      <JibunAddr>{a.jibunAddr || ''}</JibunAddr>
                    </Row>
                  </Column>
                </AddressCard>
              );
            })}
          </ListWrap>
        )}

        {!showExamples && results.length === 0 && !loading?.searchingAddress && (
          <EmptyText>검색 결과가 없습니다. 키워드를 다시 입력해주세요.</EmptyText>
        )}
      </ContentArea>
    </PageWrap>
  );
}
