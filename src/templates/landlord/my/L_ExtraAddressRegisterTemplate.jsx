// src/templates/landlord/my/L_ExtraAddressRegisterTemplate.jsx
import React, { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useFunnel } from '@use-funnel/react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';

import TopBar from '../../../components/common/TopBar';
import { Row, Column, Spacer } from '../../../styles/flex';
import { color, typo } from '../../../styles/tokens';
import TextField from '../../../components/common/TextField';
import Button from '../../../components/common/Button';
import ButtonSmall from '../../../components/common/ButtonSmall';

import iconCheck from '../../../assets/repair/request-repair/icon_big-check.png';

/* -------------------------------------------
 * (SignUp 흐름과 동일 톤) 진행바 구간
 * ----------------------------------------- */
const PROGRESS_RANGE = {
  AddressKeyword: [0, 25],
  AddressConfirm: [25, 50],
  HouseholdCount: [50, 70],
  UploadDeed: [70, 100],
};

function getProgressRange(step) {
  const [start, end] = PROGRESS_RANGE[step] ?? [0, 100];
  return { start, end };
}

function ProgressBar({ start, end }) {
  const width = Math.max(0, Math.min(100, end - start));
  return (
    <ProgressTrack>
      <ProgressFill $start={start} $width={width} />
    </ProgressTrack>
  );
}

/* -------------------------------------------
 * 목 주소 검색 (UI 데모용)
 * ----------------------------------------- */
function mockSearchAddresses(keyword) {
  const seed = (keyword || '').trim();
  if (!seed) return [];
  return [
    {
      id: '1',
      road: `서울특별시 강남구 ${seed} 112길 46`,
      jibun: '역삼동 102-1',
      bname: '현대프라자',
    },
    { id: '2', road: `서울특별시 강남구 ${seed} 19길 7`, jibun: '역삼동 33-2', bname: '강남N타워' },
    { id: '3', road: `서울특별시 강남구 ${seed}로 10`, jibun: '역삼동 10-21', bname: '역삼하이힐' },
  ];
}

/* =========================================================
 * STEP 1. 주소 검색
 *  - 타이틀/예시/결과 리스트 UI를 SignUp의 톤으로 맞춤
 * ======================================================= */
function StepAddressKeyword({ onPick, onBack, defaultKeyword }) {
  const [keyword, setKeyword] = useState(defaultKeyword ?? '');
  const [results, setResults] = useState([]);
  const [showExamples, setShowExamples] = useState(true);

  const doSearch = () => {
    const list = mockSearchAddresses(keyword);
    setResults(list);
    setShowExamples(false);
  };

  return (
    <PageWrap>
      <TopBar title="주소 등록" onBack={onBack} />
      <ProgressBar {...getProgressRange('AddressKeyword')} />

      <StepTitle>{'관리할 건물의\n주소를 등록해주세요'}</StepTitle>

      <div style={{ padding: '0 27px' }}>
        <Column $gap={4}>
          <Label>주소 검색</Label>
          <Row $gap={6}>
            <TextField
              placeholder="예) 판교역로 235, 도산대로 33"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && keyword.trim() && doSearch()}
            />
            <ButtonSmall text="검색" width="30%" active={!!keyword.trim()} onClick={doSearch} />
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
            {results.map(a => (
              <AddressRow key={a.id} onClick={() => onPick(a)}>
                <AddrMain title={a.road}>{a.road}</AddrMain>
                <Row $gap={8} $align="center">
                  <Jibun>지번</Jibun>
                  <JibunAddr>{a.jibun}</JibunAddr>
                </Row>
              </AddressRow>
            ))}
          </ListWrap>
        )}

        {!showExamples && results.length === 0 && (
          <EmptyHint>검색 결과가 없습니다. 키워드를 다시 입력해주세요.</EmptyHint>
        )}
      </div>
    </PageWrap>
  );
}

/* =========================================================
 * STEP 2. 주소 확인(선택 후)
 *  - 선택한 주소 박스 + ‘참고/상세(선택)’ 필드(회원가입 집주인 플로우 톤)
 *  - 필수값 없음 → 바로 다음 단계 가능
 * ======================================================= */
function StepAddressConfirm({ baseAddress, onNext, onBack }) {
  const [refDetail, setRefDetail] = useState(''); // 참고항목/상세(선택)

  return (
    <PageWrap>
      <TopBar title="주소 등록" onBack={onBack} />
      <ProgressBar {...getProgressRange('AddressConfirm')} />

      <StepTitle>{'관리할 건물의\n주소를 등록해주세요'}</StepTitle>

      <div style={{ padding: '0 24px' }}>
        <SelectedBox>
          <AddrMain>
            {baseAddress.road}
            {baseAddress.bname ? ` (${baseAddress.bname})` : ''}
          </AddrMain>
          <Row $gap={8} $align="center">
            <Jibun>지번</Jibun>
            <JibunAddr>{baseAddress.jibun}</JibunAddr>
          </Row>
        </SelectedBox>

        <Column $gap={8}>
          <Label>참고/상세 (선택)</Label>
          <TextField
            placeholder="예) 관리사무소 지하 1층 / 경비실 우편함 옆"
            value={refDetail}
            onChange={e => setRefDetail(e.target.value)}
          />
        </Column>
      </div>

      <Spacer />
      <div style={{ padding: '30px 24px' }}>
        <Button text="다음" active onClick={() => onNext({ refDetail: refDetail.trim() })} />
      </div>
    </PageWrap>
  );
}

/* =========================================================
 * STEP 3. 총 가구 수 입력
 *  - SignUp 집주인 플로우 텍스트 그대로
 * ======================================================= */
function StepHouseholdCount({ onNext, onBack }) {
  const [count, setCount] = useState('');
  const onlyDigits = v => v.replace(/\D/g, '');
  const valid = /^\d+$/.test(count) && Number(count) > 0;

  return (
    <PageWrap>
      <TopBar title="주소 등록" onBack={onBack} />
      <ProgressBar {...getProgressRange('HouseholdCount')} />

      <StepTitle>{'이 건물에는\n총 몇 가구가 있나요?'}</StepTitle>

      <div style={{ padding: '0 24px' }}>
        <TextField
          placeholder="예) 1"
          inputMode="numeric"
          value={count}
          onChange={e => setCount(onlyDigits(e.target.value))}
          suffix="가구"
        />
      </div>

      <Spacer />
      <div style={{ padding: '30px 24px' }}>
        <Button text="다음" active={valid} onClick={() => onNext(Number(count))} />
      </div>
    </PageWrap>
  );
}

/* =========================================================
 * STEP 4. 등기부등본 업로드
 *  - SignUp 집주인과 동일한 카드형 업로드 UI
 * ======================================================= */
function StepUploadDeed({ onNext, onBack }) {
  const [file, setFile] = useState(null);

  return (
    <PageWrap>
      <TopBar title="주소 등록" onBack={onBack} />
      <ProgressBar {...getProgressRange('UploadDeed')} />

      <StepTitle>{'집주인 인증을 위해\n등기부등본을 업로드해주세요.'}</StepTitle>

      <UploadCard as="label">
        <input
          type="file"
          accept="image/*,.pdf"
          style={{ display: 'none' }}
          onChange={e => {
            const f = e.target.files?.[0];
            if (f) setFile(f);
          }}
        />
        {file ? <UploadName>{file.name}</UploadName> : <UploadHint>파일 선택하기</UploadHint>}
        <UploadNote>
          • 등기부등본은 최근 발급본을 권장합니다.
          <br />• 인증 완료 후 민감 정보는 안전하게 파기됩니다.
        </UploadNote>
      </UploadCard>

      <Spacer />
      <div style={{ padding: '30px 24px' }}>
        <Button text="다음" active={!!file} onClick={() => onNext(file)} />
      </div>
    </PageWrap>
  );
}

/* =========================================================
 * STEP 5. 완료
 * ======================================================= */
function StepDone({ payload }) {
  const nav = useNavigate();

  // 완료 시 목록으로 복귀 + 신규 주소 추가 상태 전달(필요 시 서버 연동 위치)
  const finish = () => {
    const newItem = {
      id: String(Date.now()),
      placeType: 'ETC', // 집주인 목록은 분류 자체가 단순 — 필요 시 변경
      alias: payload?.bname || '관리 건물',
      address1: [payload?.road, payload?.bname].filter(Boolean).join(' '),
      address2: payload?.refDetail || '',
      verified: false,
      isCurrent: false,
    };
    nav('/address-admin', { replace: true, state: { add: newItem } });
  };

  return (
    <PageWrap>
      <CenterCol>
        <SubmitIcon src={iconCheck} />
        <SuccessTitle>인증이 요청되었어요!</SuccessTitle>
        <SuccessSub>입력하신 정보로 확인 후 알려드릴게요.</SuccessSub>
      </CenterCol>

      <div style={{ padding: '30px 24px' }}>
        <Button text="완료하기" active onClick={finish} />
      </div>
    </PageWrap>
  );
}

/* =========================================================
 * 메인: Funnel.Render
 *  - SignUp(집주인)과 동일 동선/문구/톤으로 연결
 * ======================================================= */
export default function L_ExtraAddressRegisterTemplate() {
  const location = useLocation();

  const Funnel = useFunnel({
    id: 'landlord-address-add',
    initial: { step: 'AddressKeyword', context: {} },
    steps: {},
    routes: step => `/landlord/address/add/${step}`,
  });

  return (
    <Funnel.Render
      AddressKeyword={({ history, context }) => (
        <StepAddressKeyword
          defaultKeyword={context.keyword}
          onBack={() => history.exit('/address-admin')}
          onPick={base => history.push('AddressConfirm', { ...context, base })}
        />
      )}
      AddressConfirm={({ history, context }) => (
        <StepAddressConfirm
          baseAddress={context.base}
          onBack={history.back}
          onNext={({ refDetail }) => history.push('HouseholdCount', { ...context, refDetail })}
        />
      )}
      HouseholdCount={({ history, context }) => (
        <StepHouseholdCount
          onBack={history.back}
          onNext={count => history.push('UploadDeed', { ...context, count })}
        />
      )}
      UploadDeed={({ history, context }) => (
        <StepUploadDeed
          onBack={history.back}
          onNext={file =>
            history.push('Done', {
              ...context,
              road: context.base.road,
              jibun: context.base.jibun,
              bname: context.base.bname,
              refDetail: context.refDetail,
              count: context.count,
              fileName: file?.name,
            })
          }
        />
      )}
      Done={({ context }) => <StepDone payload={context} />}
    />
  );
}

/* ============================= 스타일 ============================= */
const PageWrap = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #fff;
`;

const StepTitle = styled.div`
  ${typo('h2')};
  color: ${color('grayscale.800')};
  white-space: pre-line;
  margin: 30px 0 40px 28px;
`;

const Label = styled.div`
  ${typo('caption2')};
  color: ${color('grayscale.500')};
`;

const ExampleTitle = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.600')};
`;
const ExampleDesc = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.500')};
`;

const ListWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const AddressRow = styled.div`
  width: 100%;
  padding-bottom: 12px;
  margin-bottom: 12px;
  border-bottom: 1px solid ${color('grayscale.200')};
  cursor: pointer;
`;
const EmptyHint = styled.div`
  margin-top: 16px;
  ${typo('caption1')};
  color: ${color('grayscale.500')};
`;

const SelectedBox = styled.div`
  display: flex;
  width: 100%;
  padding: 14px;
  flex-direction: column;
  gap: 10px;
  border-radius: 10px;
  border: 1px solid #efefef;
  background: #fafafb;
  margin-bottom: 20px;
`;

const AddrMain = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.800')};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
  overflow-wrap: anywhere;
`;

const Jibun = styled.div`
  display: flex;
  width: 38px;
  height: 22px;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  border: 0.5px solid #a8a8a8;
  ${typo('caption2')};
  color: ${color('grayscale.500')};
`;
const JibunAddr = styled.div`
  ${typo('caption2')};
  color: ${color('grayscale.600')};
`;

const UploadCard = styled.div`
  margin: 0 24px;
  padding: 36px 18px 18px;
  border: 1.5px dashed ${color('grayscale.400')};
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  background: ${color('grayscale.50')};
`;
const UploadHint = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.600')};
`;
const UploadName = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.800')};
  margin-bottom: 8px;
`;
const UploadNote = styled.div`
  margin-top: 10px;
  ${typo('caption2')};
  color: ${color('grayscale.500')};
`;

const CenterCol = styled.div`
  display: flex;
  min-height: calc(100dvh - 120px);
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-align: center;
`;

const fadeUp = keyframes`
  from { transform: translateY(8px); opacity: 0; }
  to   { transform: translateY(0);   opacity: 1; }
`;
const pop = keyframes`
  0%   { transform: scale(0.6); opacity: 0; }
  60%  { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); }
`;

const SubmitIcon = styled.img`
  width: 90px;
  animation: ${pop} 560ms ease both;
`;
const SuccessTitle = styled.div`
  ${typo('h3')};
  color: ${color('grayscale.800')};
  animation: ${fadeUp} 360ms ease 80ms both;
`;
const SuccessSub = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.700')};
  animation: ${fadeUp} 360ms ease 120ms both;
`;

/* 진행바 */
const ProgressTrack = styled.div`
  position: relative;
  height: 2px;
  width: 100%;
  background: ${color('grayscale.200')};
`;
const ProgressFill = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${({ $start = 0 }) => `${$start}%`};
  width: ${({ $width = 0 }) => `${$width}%`};
  background: ${color('brand.primary')};
  transition: left 220ms ease, width 220ms ease;
`;
