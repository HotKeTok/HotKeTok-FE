import React, { useState } from 'react';
import TopBar from '../common/TopBar';
import TextField from '../common/TextField';
import Button from '../common/Button';
import { Column, Row, Spacer } from '../../styles/flex';
import { getProgressRange } from './progress';
import ProgressBar from './ProgressBar';
import { PageWrap, StepTitle, Label, ExampleTitle } from './InitProcessStyles';

export default function StepLandlordHouseholdCount({ defaultCount = '', onNext, onBack }) {
  const [count, setCount] = useState(String(defaultCount ?? ''));
  const n = Number(count);
  const isValid = Number.isInteger(n) && n > 0 && n < 10000;

  return (
    <PageWrap>
      <TopBar title="회원 등록" onBack={onBack} />
      <ProgressBar {...getProgressRange('L_HouseholdCount')} />
      <StepTitle>{'이 건물에는\n총 몇 가구가 있나요?'}</StepTitle>

      <div style={{ padding: '0 24px' }}>
        <Column $gap={4}>
          <Label>가구 수</Label>
          <Row $gap={10} $align="center">
            <TextField
              placeholder="예) 1"
              inputMode="numeric"
              value={count}
              onChange={e => setCount(e.target.value.replace(/[^\d]/g, ''))}
              suffix="가구"
            />
            <ExampleTitle>가구</ExampleTitle>
          </Row>
        </Column>
      </div>

      <Spacer />
      <div style={{ padding: '30px 24px', position: 'sticky', bottom: '0' }}>
        <Button text="다음" active={isValid} onClick={() => isValid && onNext(n)} />
      </div>
    </PageWrap>
  );
}
