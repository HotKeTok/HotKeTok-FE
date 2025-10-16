import React, { useState } from 'react';
import TopBar from '../common/TopBar';
import TextField from '../common/TextField';
import Button from '../common/Button';
import { Row, Column, Spacer } from '../../styles/flex';
import { getProgressRange } from './progress';
import ProgressBar from './ProgressBar';
import {
  PageWrap,
  StepTitle,
  SelectedBox,
  Addr,
  Jibun,
  JibunAddr,
  ExampleTitle,
  ExampleDesc,
} from './InitProcessStyles';

export default function StepUnitInput({ baseAddress, defaultUnit, onNext }) {
  const [floor, setFloor] = useState(defaultUnit?.floor != null ? String(defaultUnit.floor) : '');
  const [ho, setHo] = useState(defaultUnit?.ho != null ? String(defaultUnit.ho) : '');

  const floorNum = Number(floor);
  const hoNum = Number(ho);
  const isValidFloor = Number.isInteger(floorNum) && floorNum >= -5 && floorNum <= 200;
  const isValidHo = Number.isInteger(hoNum) && hoNum > 0 && hoNum <= 9999;
  const canSubmit = isValidFloor && isValidHo;

  const onlyDigits = v => v.replace(/[^\d-]/g, '');

  return (
    <PageWrap>
      <TopBar title="회원 등록" />
      <ProgressBar {...getProgressRange('UnitInput')} />
      <StepTitle>{'내 거주지의 \n주소를 등록해주세요'}</StepTitle>

      <div style={{ padding: '0 24px' }}>
        <SelectedBox>
          <Addr>{baseAddress.roadAddr}</Addr>
          <Row $gap={8} $align="center">
            <Jibun>지번</Jibun>
            <JibunAddr>{baseAddress.jibunAddr || ''}</JibunAddr>
          </Row>
        </SelectedBox>

        <Row $gap={24}>
          <Column style={{ flex: 1 }}>
            <ExampleDesc>층수</ExampleDesc>
            <Row $gap={10} $align="center">
              <TextField
                placeholder="예) 1"
                inputMode="numeric"
                value={floor}
                onChange={e => setFloor(onlyDigits(e.target.value))}
                suffix="층"
              />
              <ExampleTitle>층</ExampleTitle>
            </Row>
          </Column>
          <Column style={{ flex: 1 }}>
            <ExampleDesc>호수</ExampleDesc>
            <Row $gap={10} $align="center">
              <TextField
                placeholder="예) 101"
                inputMode="numeric"
                value={ho}
                onChange={e => setHo(onlyDigits(e.target.value))}
                suffix="호"
              />
              <ExampleTitle>호</ExampleTitle>
            </Row>
          </Column>
        </Row>
      </div>

      <Spacer />
      <div style={{ padding: '30px 24px' }}>
        <Button
          text="다음"
          active={canSubmit}
          onClick={() => canSubmit && onNext?.({ floor: floorNum, ho: hoNum })}
        />
      </div>
    </PageWrap>
  );
}
