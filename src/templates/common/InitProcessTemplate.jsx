// src/templates/common/InitProcessTemplate.jsx
// ✅ UI/라우팅 전담 템플릿: API 호출은 상위 pages/common/InitProcess.jsx가 수행
import React, { useEffect, useMemo, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useFunnel } from '@use-funnel/react-router-dom';
import { useNavigate } from 'react-router-dom';

import TopBar from '../../components/common/TopBar';
import { color, typo } from '../../styles/tokens';
import { Row, Column, Spacer } from '../../styles/flex';
import TextField from '../../components/common/TextField';
import Button from '../../components/common/Button';
import ButtonSmall from '../../components/common/ButtonSmall';
import ModeItem from '../../components/common/ModeItem';
import Toast from '../../components/common/Toast';

import iconCheck from '../../assets/repair/request-repair/icon_big-check.png';
import iconFolder from '../../assets/common/icon-folder.svg';

/* ============================================================================
 * 진행률 매핑
 * ========================================================================== */
const PROGRESS_RANGE = {
  Role: [0, 33],
  AddressKeyword: [33, 66],
  UnitInput: [33, 66],
  Review: [66, 100],

  L_AddressKeyword: [33, 66],
  L_UnitInput: [33, 66], // 집주인: 건물명 입력
  L_HouseholdCount: [33, 66], // 집주인: 가구 수
  L_OwnerDocUpload: [66, 100], // 집주인: 등기부 업로드/제출
};
function getProgressRange(step) {
  const [start, end] = PROGRESS_RANGE[step] ?? [0, 100];
  return { start, end };
}

/* ============================================================================
 * 공통 토스트 훅
 * ========================================================================== */
function useToast() {
  const [toast, setToast] = useState({ open: false, message: '', icon: 'warning' });
  const open = (message, icon = 'warning') => setToast({ open: true, message, icon });
  const close = () => setToast({ open: false, message: '', icon: 'warning' });
  return { toast, open, close };
}

/* ============================================================================
 * 진행바
 * ========================================================================== */
function ProgressBar({ value = 0, start, end }) {
  const hasRange = typeof start === 'number' && typeof end === 'number';
  const s = hasRange ? Math.max(0, Math.min(100, start)) : 0;
  const e = hasRange ? Math.max(0, Math.min(100, end)) : Math.max(0, Math.min(100, value));
  const fill = hasRange ? Math.max(0, e - s) : e;
  return (
    <div>
      <ProgressTrack>
        <ProgressFill $start={s} $width={fill} />
      </ProgressTrack>
    </div>
  );
}

/* ============================================================================
 * STEP: 모드 선택
 * ========================================================================== */
function StepRole({ onNext }) {
  const [selectedRole, setSelectedRole] = useState(null); // 'tenant' | 'landlord'
  return (
    <PageWrap>
      <TopBar title="회원 등록" />
      <ProgressBar {...getProgressRange('Role')} />
      <StepTitle>{'핫케톡 이용모드를\n선택해 주세요'}</StepTitle>

      <Column $gap={10} style={{ padding: '0 20px' }}>
        <ModeItem selected={selectedRole === 'tenant'} onClick={() => setSelectedRole('tenant')}>
          <Column $gap={10}>
            <CardTitle>입주민</CardTitle>
            <CardDesc>임차인 / 세입자</CardDesc>
          </Column>
        </ModeItem>

        <ModeItem
          selected={selectedRole === 'landlord'}
          onClick={() => setSelectedRole('landlord')}
        >
          <Column $gap={10}>
            <CardTitle>집주인</CardTitle>
            <CardDesc>임대인 / 관리인(반장)</CardDesc>
          </Column>
        </ModeItem>
      </Column>

      <Spacer />
      <div style={{ padding: '30px 24px' }}>
        <Button
          text="선택하기"
          active={!!selectedRole}
          onClick={() => {
            if (!selectedRole) return;
            if (selectedRole === 'tenant') onNext({ step: 'AddressKeyword', role: 'tenant' });
            else onNext({ step: 'L_AddressKeyword', role: 'landlord' });
          }}
        />
      </div>
    </PageWrap>
  );
}

/* ============================================================================
 * STEP: 주소 검색 (공용 UI / 상위 콜백 onSearchAddress 사용)
 * ========================================================================== */
function StepAddressKeyword({
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
  const { open: openToast } = useToast(); // 로컬 미사용 예시용 (필요시 사용)

  const handleSearch = async () => {
    if (!keyword.trim()) return;
    const res = await onSearchAddress({ keyword: keyword.trim(), page: 0, pageSize: 5 });
    if (res?.success) {
      setResults(res.items || []);
      setShowExamples(false);
    } else {
      setResults([]);
      setShowExamples(false);
      // 상위에서 토스트를 띄우지 않으니, 필요시 여기서 띄우고 싶다면:
      // openToast(res?.message || '주소 검색에 실패했어요.');
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

/* ============================================================================
 * STEP: 입주민 — 층/호 입력
 * ========================================================================== */
function StepUnitInput({ baseAddress, defaultUnit, onNext }) {
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
          onClick={() => {
            if (!canSubmit) return;
            onNext?.({ floor: floorNum, ho: hoNum });
          }}
        />
      </div>
    </PageWrap>
  );
}

/* ============================================================================
 * STEP: 입주민 — 검토 & 요청하기 → 완료
 * ========================================================================== */
function StepReview({ baseAddress, floor, ho, requesting, onRequestTenant }) {
  const [requested, setRequested] = useState(false);
  const [showDoneBtn, setShowDoneBtn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!requested) return;
    const t = setTimeout(() => setShowDoneBtn(true), 800);
    return () => clearTimeout(t);
  }, [requested]);

  if (!requested) {
    return (
      <PageWrap>
        <TopBar title="회원 등록" onBack={() => window.history.back()} />
        <ProgressBar {...getProgressRange('Review')} />
        <StepTitle>{'입주민 인증을 진행할게요'}</StepTitle>

        <div style={{ padding: '0 28px' }}>
          <Column
            $gap={10}
            style={{
              borderBottom: '1px solid #EFEFEF',
              paddingBottom: 20,
              marginBottom: 20,
            }}
          >
            <InfoKey>정확한 주소가 맞나요?</InfoKey>

            <Caption1Addr>
              {baseAddress.roadAddr}
              <br />
              {floor != null && ho != null ? `${floor}층 ${ho}호` : null}
            </Caption1Addr>

            <Row $gap={8} $align="center">
              <Jibun>지번</Jibun>
              <JibunAddr>{baseAddress.jibunAddr || ''}</JibunAddr>
            </Row>
          </Column>

          <SmallNotice>
            집주인이 이름 / 휴대폰 번호 / 주소 정보를 바탕으로 확인해요.
            <br />
            인증요청 후 집주인이 확인하면 인증이 완료됩니다.
          </SmallNotice>
          <SmallNoticeGreen>인증이 완료되면 알림을 보내드릴게요!</SmallNoticeGreen>
        </div>

        <Spacer />

        <div style={{ padding: '30px 24px' }}>
          <Button
            text={requesting ? '요청 중...' : '요청하기'}
            active={!requesting}
            onClick={async () => {
              const ok = await onRequestTenant?.();
              if (ok) setRequested(true);
            }}
            disabled={requesting}
          />
        </div>
      </PageWrap>
    );
  }

  return (
    <PageWrap>
      <ContentWrapCentered>
        <SubmitIcon src={iconCheck} />
        <SuccessTitle>인증이 요청되었어요!</SuccessTitle>
        <SuccessSub>인증이 완료되면 알림을 보내드릴게요!</SuccessSub>
      </ContentWrapCentered>

      <div style={{ padding: '30px 24px' }}>
        <FadeInWrap $show={showDoneBtn}>
          <Button text="완료하기" active={showDoneBtn} onClick={() => navigate('/')} />
        </FadeInWrap>
      </div>
    </PageWrap>
  );
}

/* ============================================================================
 * STEP: 집주인 — 건물명 입력
 * ========================================================================== */
function StepOwnerBuildingInput({ baseAddress, defaultValue = '', onNext, onBack }) {
  const [buildingName, setBuildingName] = useState(defaultValue);
  const canSubmit = !!buildingName.trim();

  return (
    <PageWrap>
      <TopBar title="회원 등록" onBack={onBack} />
      <ProgressBar {...getProgressRange('L_UnitInput')} />
      <StepTitle>{'관리할 건물의\n주소를 등록해주세요'}</StepTitle>

      <div style={{ padding: '0 24px' }}>
        <SelectedBox>
          <Addr>{baseAddress.roadAddr}</Addr>
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

/* ============================================================================
 * STEP: 집주인 — 가구수 입력
 * ========================================================================== */
function StepOwnerHouseholdCount({ defaultCount = '', onNext, onBack }) {
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
      <div style={{ padding: '30px 24px' }}>
        <Button text="다음" active={isValid} onClick={() => isValid && onNext(n)} />
      </div>
    </PageWrap>
  );
}

/* ============================================================================
 * STEP: 집주인 — 등기부 업로드 + 제출 (상위 onSubmitOwner 사용)
 * ========================================================================== */
function StepOwnerDeedUpload({ defaultFileName = '', onSubmitOwner, submitting, onBack }) {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(defaultFileName || '');
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
      <TopBar title="회원 등록" onBack={onBack} />
      <ProgressBar {...getProgressRange('L_OwnerDocUpload')} />
      <StepTitle>{'집주인 인증을 위해\n등기부등본을 업로드해주세요.'}</StepTitle>

      <div style={{ padding: '0 24px' }}>
        <UploadBox onClick={() => document.getElementById(inputId).click()}>
          <div style={{ textAlign: 'center' }}>
            <Column $gap={10} $align="center">
              <UploadIcon src={iconFolder} />
              <UploadTitle>{fileName || '파일 선택하기'}</UploadTitle>
            </Column>
          </div>
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
        <Button
          text={submitting ? '제출 중...' : '등록 완료'}
          active={!!file && !submitting}
          onClick={() => onSubmitOwner?.(file)}
          disabled={!file || submitting}
        />
      </div>
    </PageWrap>
  );
}

/* ============================================================================
 * STEP: 집주인 — 환영
 * ========================================================================== */
function StepOwnerWelcome() {
  const navigate = useNavigate();
  const [showBtn, setShowBtn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShowBtn(true), 600);
    return () => clearTimeout(t);
  }, []);
  return (
    <PageWrap>
      <ContentWrapCentered>
        <SubmitIcon src={iconCheck} />
        <SuccessTitle>환영합니다!</SuccessTitle>
        <SuccessSub>등록이 완료되었어요.</SuccessSub>
      </ContentWrapCentered>
      <div style={{ padding: '30px 24px' }}>
        <FadeInWrap>
          <Button text="시작하기" active={showBtn} onClick={() => navigate('/')} />
        </FadeInWrap>
      </div>
    </PageWrap>
  );
}

/* ============================================================================
 * 메인 템플릿: 퍼널 라우팅 & 상위 콜백 연결
 * ========================================================================== */
export default function InitProcessTemplate({
  loading,
  onSearchAddress,
  onSubmitTenant,
  onSubmitOwner,
}) {
  const { toast, open: openToast, close: closeToast } = useToast();

  const Funnel = useFunnel({
    id: 'init-process',
    initial: { step: 'Role', context: {} },
    steps: {},
    routes: step => `/init/${step}`, // URL 반영(선호에 따라 제거 가능)
  });

  return (
    <>
      <Funnel.Render
        Role={({ history }) => (
          <StepRole
            onNext={({ step, role }) => {
              history.push(step, { role });
            }}
          />
        )}
        /* ------------------- 입주민 플로우 ------------------- */
        AddressKeyword={({ history, context }) => (
          <StepAddressKeyword
            titleText={'내 거주지의 \n주소를 등록해주세요'}
            defaultKeyword={context.addressKeyword}
            onBack={history.back}
            loading={loading}
            onSearchAddress={onSearchAddress}
            onPick={baseAddress => {
              history.push('UnitInput', { ...context, baseAddress, role: 'tenant' });
            }}
          />
        )}
        UnitInput={({ history, context }) => (
          <StepUnitInput
            baseAddress={context.baseAddress}
            defaultUnit={{ floor: context.floor, ho: context.ho }}
            onNext={({ floor, ho }) => {
              history.push('Review', { ...context, floor, ho, role: 'tenant' });
            }}
          />
        )}
        Review={({ history, context }) => (
          <StepReview
            baseAddress={context.baseAddress}
            floor={context.floor}
            ho={context.ho}
            requesting={loading?.submittingTenant}
            onRequestTenant={async () => {
              const res = await onSubmitTenant?.({
                address: context.baseAddress.roadAddr,
                floor: `${context.floor}층`,
                number: `${context.ho}호`,
                alias: '우리집',
                houseType: 'HOME',
              });
              if (res?.success) return true;
              openToast(res?.message || '요청 처리에 실패했어요.');
              return false;
            }}
          />
        )}
        /* ------------------- 집주인 플로우 ------------------- */
        L_AddressKeyword={({ history, context }) => (
          <StepAddressKeyword
            titleText={'관리할 건물의 \n주소를 등록해주세요'}
            defaultKeyword={context.addressKeyword}
            onBack={history.back}
            loading={loading}
            onSearchAddress={onSearchAddress}
            onPick={baseAddress => {
              history.push('L_UnitInput', { ...context, baseAddress, role: 'landlord' });
            }}
          />
        )}
        L_UnitInput={({ history, context }) => (
          <StepOwnerBuildingInput
            baseAddress={context.baseAddress}
            defaultValue={context.detail}
            onBack={history.back}
            onNext={({ detail }) => {
              history.push('L_HouseholdCount', { ...context, detail, role: 'landlord' });
            }}
          />
        )}
        L_HouseholdCount={({ history, context }) => (
          <StepOwnerHouseholdCount
            defaultCount={context.totalHouseholds}
            onBack={history.back}
            onNext={totalHouseholds => {
              history.push('L_OwnerDocUpload', { ...context, totalHouseholds });
            }}
          />
        )}
        L_OwnerDocUpload={({ history, context }) => (
          <StepOwnerDeedUpload
            defaultFileName={context.deedFileName}
            onBack={history.back}
            submitting={loading?.submittingOwner}
            onSubmitOwner={async file => {
              const res = await onSubmitOwner?.({
                address: context.baseAddress.roadAddr,
                detailAddress: context.detail, // 건물명
                count: context.totalHouseholds, // 가구 수
                file,
              });
              if (res?.success) {
                history.push('L_Welcome', { ...context });
                return;
              }
              openToast(res?.message || '등록 처리에 실패했어요.');
            }}
          />
        )}
        L_Welcome={() => <StepOwnerWelcome />}
      />

      <Toast
        show={toast.open}
        onClose={closeToast}
        message={toast.message}
        icon={toast.icon}
        duration={1200}
      />
    </>
  );
}

/* ============================================================================
 * 스타일
 * ========================================================================== */
const PageWrap = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const ContentWrap = styled.div`
  padding: 16px 16px 0 16px;
`;

const ContentWrapCentered = styled(ContentWrap)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: calc(100dvh - 120px);
  text-align: center;
`;

const StepTitle = styled.div`
  ${typo('h2')};
  color: ${color('grayscale.800')};
  white-space: pre-line;
  margin: 30px 0 40px 28px;
`;

const Desc = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.800')};
`;

const Label = styled.div`
  ${typo('caption2')};
  color: ${color('grayscale.500')};
`;

const CardTitle = styled.div`
  ${typo('h3')};
  color: ${color('grayscale.900')};
`;

const CardDesc = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.600')};
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
  margin-top: 12px;
`;

const AddressCard = styled.div`
  width: 100%;
  text-align: left;
  cursor: pointer;
  padding-bottom: 12px;
  margin-bottom: 12px;
  border-bottom: 1px solid ${color('grayscale.200')};
`;

const SelectedBox = styled.div`
  display: flex;
  box-sizing: border-box;
  width: 100%;
  padding: 14px;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 10px;
  border-radius: 10px;
  border: 1px solid #efefef;
  background: #fafafb;
  margin-bottom: 30px;
`;

const Addr = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.800')};
`;

const Caption1Addr = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.800')};
`;

const JibunAddr = styled.div`
  ${typo('caption2')};
  color: ${color('grayscale.600')};
`;

const Jibun = styled.div`
  display: flex;
  width: 38px;
  height: 22px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 4px;
  border: 0.5px solid #a8a8a8;
  ${typo('caption2')};
  color: ${color('grayscale.500')};
`;

const InfoKey = styled.div`
  ${typo('h3')};
  color: ${color('grayscale.800')};
`;

const SmallNotice = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.500')};
`;

const SmallNoticeGreen = styled.div`
  ${typo('caption1')};
  color: ${color('brand.primary')};
`;

const fadeUp = keyframes`
  from { transform: translateY(8px); opacity: 0; }
  to   { transform: translateY(0);   opacity: 1; }
`;

const popBounce = keyframes`
  0%   { transform: scale(0.6) rotate(-6deg); opacity: 0; }
  60%  { transform: scale(1.08) rotate(2deg);  opacity: 1; }
  80%  { transform: scale(0.98) rotate(-1deg); }
  100% { transform: scale(1) rotate(0deg); }
`;

const SubmitIcon = styled.img`
  width: 90px;
  animation: ${popBounce} 560ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
  will-change: transform, opacity;
`;

const SuccessTitle = styled.div`
  ${typo('h2')};
  color: ${color('grayscale.800')};
  animation: ${fadeUp} 360ms ease 80ms both;
  margin-bottom: 6px;
`;

const SuccessSub = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.800')};
  text-align: center;
  animation: ${fadeUp} 360ms ease 120ms both;
`;

const FadeInWrap = styled.div`
  animation: ${fadeUp} 700ms ease both;
  animation-delay: 800ms;
`;

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
