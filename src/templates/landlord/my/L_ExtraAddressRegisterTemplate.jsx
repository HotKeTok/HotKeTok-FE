// src/templates/landlord/my/L_ExtraAddressRegisterTemplate.jsx
import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useFunnel } from '@use-funnel/react-router-dom';
import { useLocation } from 'react-router-dom';

import TopBar from '../../../components/common/TopBar';
import { Row, Column, Spacer } from '../../../styles/flex';
import { color, typo } from '../../../styles/tokens';
import TextField from '../../../components/common/TextField';
import Button from '../../../components/common/Button';
import ButtonSmall from '../../../components/common/ButtonSmall';

import iconCheck from '../../../assets/repair/request-repair/icon_big-check.png';
import iconFolder from '../../../assets/common/icon-folder.svg';

/* -------------------------------------------
 * (SignUp 흐름과 동일 톤) 진행바 구간
 * ----------------------------------------- */
const PROGRESS_RANGE = {
  AddressKeyword: [0, 33],
  AddressConfirm: [0, 33],
  HouseholdCount: [33, 66],
  UploadDeed: [66, 100],
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

/* =========================================================
 * STEP 1. 주소 검색
 *  - 타이틀/예시/결과 리스트 UI를 InitProcess의 톤으로 맞춤
 *  - onSearch 콜백으로 실제 주소 검색 API 연동
 * ======================================================= */
function StepAddressKeyword({ onPick, onBack, defaultKeyword, onSearch }) {
  const [keyword, setKeyword] = useState(defaultKeyword ?? '');
  const [results, setResults] = useState([]);
  const [showExamples, setShowExamples] = useState(true);

  const doSearch = async () => {
    if (!keyword.trim()) return;
    const list = await onSearch?.(keyword);
    setResults(Array.isArray(list) ? list : []);
    setShowExamples(false);
  };

  return (
    <PageWrap>
      <TopBar title="주소 등록" />
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
          <ListWrap style={{ marginTop: 30 }}>
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
  const canNext = refDetail.trim().length > 0;

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
          <Label>상세주소</Label>
          <TextField
            placeholder="예) 현대프라자"
            value={refDetail}
            onChange={e => setRefDetail(e.target.value)}
          />
          <Label style={{ color: '#3C66FF' }}>* 건물명을 입력해주세요.</Label>
        </Column>
      </div>

      <Spacer />
      <div style={{ padding: '30px 24px' }}>
        <Button
          text="다음"
          active={canNext}
          onClick={() => {
            if (!canNext) return;
            onNext({ refDetail: refDetail.trim() });
          }}
        />
      </div>
    </PageWrap>
  );
}

/* =========================================================
 * STEP 3. 총 가구 수 입력
 *  - InitProcess 집주인 플로우 텍스트 그대로
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
        <Column $gap={4}>
          <Label>가구 수</Label>
          <Row $gap={10} $align="center">
            <TextField
              placeholder="예) 1"
              inputMode="numeric"
              value={count}
              onChange={e => setCount(onlyDigits(e.target.value))}
              suffix="가구"
            />
            <ExampleTitle>가구</ExampleTitle>
          </Row>
        </Column>
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
 *  - InitProcess 집주인과 동일한 카드형 업로드 UI
 *  - 다음 단계로 file 객체 자체 전달 (fileName 아님)
 * ======================================================= */
function StepUploadDeed({ onNext, onBack }) {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const inputId = 'deed-input';

  const handlePick = e => {
    const f = e.target.files?.[0];
    if (!f) return;
    const ok = f.type === 'application/pdf' || f.type.startsWith('image/');
    if (!ok) {
      alert('PDF 또는 이미지 파일만 업로드할 수 있어요.');
      e.target.value = '';
      return;
    }
    setFile(f);
    setFileName(f.name);
  };

  return (
    <PageWrap>
      <TopBar title="주소 등록" onBack={onBack} />
      <ProgressBar {...getProgressRange('UploadDeed')} />
      <StepTitle>{'집주인 인증을 위해\n등기부등본을 업로드해주세요.'}</StepTitle>

      <div style={{ padding: '0 24px' }}>
        <UploadBox onClick={() => document.getElementById(inputId).click()}>
          <Column $gap={10} $align="center">
            <UploadIcon src={iconFolder} alt="" />
            <UploadTitle>{fileName || '파일 선택하기'}</UploadTitle>
          </Column>
          <input
            id={inputId}
            type="file"
            accept="application/pdf,image/*"
            style={{ display: 'none' }}
            onChange={handlePick}
          />
        </UploadBox>

        <div style={{ marginTop: 10 }}>
          <SmallNotice style={{ color: '#3C66FF' }}>
            * 등기부등본은 PDF나 이미지로 등록할 수 있어요.
            <br />* 제출된 자료는 인증 외 다른 용도로 사용되지 않아요.
          </SmallNotice>
        </div>
      </div>

      <Spacer />
      <div style={{ padding: '30px 24px' }}>
        <Button text="다음" active={!!file} onClick={() => onNext({ file })} />
      </div>
    </PageWrap>
  );
}

/* =========================================================
 * STEP 5. 완료
 *  - 실제 서버 등록은 상위 onSubmit(payload) 콜백에서 수행
 * ======================================================= */
function StepDone({ payload, onSubmit }) {
  const finish = () => {
    onSubmit?.(payload);
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
 *  - 상위에서 전달한 onSearch / onSubmit을 연결
 * ======================================================= */
export default function L_ExtraAddressRegisterTemplate({ onSearch, onSubmit }) {
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
          onSearch={onSearch}
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
          onNext={({ file }) =>
            history.push('Done', {
              ...context,
              road: context.base.road,
              jibun: context.base.jibun,
              bname: context.base.bname,
              refDetail: context.refDetail,
              count: context.count,
              file,
            })
          }
        />
      )}
      Done={({ context }) => <StepDone payload={context} onSubmit={onSubmit} />}
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
  white-space: nowrap;
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
  display: flex;
  flex-direction: column;
  gap: 10px;
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
  margin-bottom: 30px;
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

const SmallNotice = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.500')};
`;

const UploadBox = styled.div`
  width: 100%;
  height: 160px;
  border: 1px dashed ${color('grayscale.300')};
  border-radius: 6px;
  background: #fafafb;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const UploadIcon = styled.img`
  width: 33px;
`;

const UploadTitle = styled.div`
  ${typo('body2')};
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
