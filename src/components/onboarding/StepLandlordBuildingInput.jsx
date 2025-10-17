import React, { useState } from 'react';
import TopBar from '../common/TopBar';
import TextField from '../common/TextField';
import Button from '../common/Button';
import { Column, Row, Spacer } from '../../styles/flex';
import { getProgressRange } from './progress';
import ProgressBar from './ProgressBar';
import {
  PageWrap,
  StepTitle,
  SelectedBox,
  Addr,
  Jibun,
  JibunAddr,
  Label,
  ExampleTitle,
} from './InitProcessStyles';

export default function StepLandlordBuildingInput({
  baseAddress,
  defaultValue = '',
  onNext,
  onBack,
}) {
  const [buildingName, setBuildingName] = useState(defaultValue);
  const canSubmit = !!buildingName.trim();

  return (
    <PageWrap>
      <TopBar title="회원 등록" onBack={onBack} />
      <ProgressBar {...getProgressRange('L_UnitInput')} />
      <StepTitle>{'관리할 건물의\n주소를 등록해주세요'}</StepTitle>

      <div style={{ padding: '0 24px' }}>
        <SelectedBox>
          {(() => {
            const match = (baseAddress.roadAddr || '').match(/^(.*?)\s*(\(.*\))$/);
            const mainAddr = match ? match[1] : baseAddress.roadAddr || '';
            const subAddr = match ? match[2] : '';
            return (
              <Addr>
                {mainAddr}
                {subAddr && (
                  <>
                    <br />
                    <div>{subAddr}</div>
                  </>
                )}
              </Addr>
            );
          })()}
          <Row $gap={8} $align="center">
            <Jibun>지번</Jibun>
            <JibunAddr>{baseAddress.jibunAddr || ''}</JibunAddr>
          </Row>
        </SelectedBox>

        <Column $gap={4}>
          <Label>상세 주소(건물명)</Label>
          <TextField
            placeholder="예) 현대프라자"
            value={buildingName}
            onChange={e => setBuildingName(e.target.value)}
          />
          <Label style={{ color: '#3C66FF' }}>* 건물명을 입력해주세요.</Label>
        </Column>
      </div>

      <Spacer />
      <div style={{ padding: '30px 24px' }}>
        <Button
          text="다음"
          active={canSubmit}
          onClick={() => canSubmit && onNext({ detail: buildingName.trim() })}
        />
      </div>
    </PageWrap>
  );
}
