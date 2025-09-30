// src/pages/InitProcess.jsx
// ============================================================================
// 🔹 InitProcess: 회원 등록/인증 퍼널(입주민/집주인 분기)
//  - 아래 PROGRESS_RANGE 값만 바꾸면 0~25~50~70~100 같은 불균등 진행률을 쉽게 조정 가능합니다.
// ============================================================================

import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useFunnel } from '@use-funnel/react-router-dom';

import TopBar from '../../components/common/TopBar';
import { color, typo } from '../../styles/tokens';
import { Row, Column, Spacer } from '../../styles/flex';
import TextField from '../../components/common/TextField';
import Button from '../../components/common/Button';
import ButtonSmall from '../../components/common/ButtonSmall';
import ModeItem from '../../components/common/ModeItem';
import { useNavigate } from 'react-router-dom';

import iconCheck from '../../assets/repair/request-repair/icon_big-check.png';
import iconFolder from '../../assets/common/icon-folder.svg';

/* ============================================================================
 * 스텝별 커스텀 진행률 매핑
 *   - 원하는 비율로 자유롭게 수정
 *   - 예시: 0 → 25 → 50 → 70 → (중간 단계가 더 있으면 85) → 100
 * ========================================================================== */
// ✅ 스텝별 [start, end] (%)
const PROGRESS_RANGE = {
  Role: [0, 33],
  AddressKeyword: [33, 66],
  UnitInput: [33, 66],
  Review: [66, 100],

  L_AddressKeyword: [33, 66],
  L_UnitInput: [33, 66],
  L_HouseholdCount: [33, 66],
  L_OwnerDocUpload: [66, 100],
};

// ✅ 현재 스텝의 구간 반환
function getProgressRange(step) {
  const [start, end] = PROGRESS_RANGE[step] ?? [0, 100];
  return { start, end };
}

/* ============================================================================
 * 0) 모의 주소 검색 (실서비스에서는 API로 대체)
 * ========================================================================== */
function mockSearchAddresses(keyword) {
  const seed = (keyword || '').trim();
  if (!seed) return [];
  return [
    {
      id: '1',
      sido: '서울특별시',
      sigungu: '강남구',
      road: `${seed} 112길 46`,
      building: '(삼OO 더샵 오브제 나무A동)',
      jibun: '역삼동 102-1',
    },
    {
      id: '2',
      sido: '서울특별시',
      sigungu: '강남구',
      road: `${seed} 101로 12`,
      building: '(역삼 자이 101동)',
      jibun: '역삼동 10-21',
    },
    {
      id: '3',
      sido: '서울특별시',
      sigungu: '강남구',
      road: `${seed} 45길 23`,
      building: '(역삼 래미안 203동)',
      jibun: '역삼동 23-5',
    },
  ];
}

/* ============================================================================
 * 1) 공통: 진행바 컴포넌트
 * ========================================================================== */
function ProgressBar({ value = 0, start, end }) {
  // 호환성: start/end가 없으면 기존처럼 value만 사용
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
 * 2) STEP 컴포넌트
 * ========================================================================== */

/* 2-1) 모드 선택 */
function StepRole({ onNext }) {
  const [selectedRole, setSelectedRole] = useState(null); // 'tenant' | 'landlord' | null

  return (
    <PageWrap>
      <TopBar title="회원 등록" />
      <ProgressBar {...getProgressRange('Role')} />
      <StepTitle>{'핫케톡 이용모드를\n선택해 주세요'}</StepTitle>

      <Column $gap={10} style={{ padding: '0px 20px' }}>
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

/* 2-2) 입주민 A: 주소 키워드 입력 + 검색/선택 */
function StepAddressKeyword({ defaultKeyword, onPick, onBack, titleText }) {
  const [keyword, setKeyword] = useState(defaultKeyword ?? '');
  const [results, setResults] = useState([]);
  const [showExamples, setShowExamples] = useState(true);

  const handleSearch = () => {
    const list = mockSearchAddresses(keyword);
    setResults(list);
    setShowExamples(false);
  };

  return (
    <PageWrap>
      <TopBar title="회원 등록" onBack={onBack} />
      <ProgressBar {...getProgressRange('AddressKeyword')} />
      <StepTitle>{titleText || '내 거주지의 \n주소를 등록해주세요'}</StepTitle>
      <div style={{ padding: '0px 27px' }}>
        <Column $gap={2} style={{ marginBottom: '30px' }}>
          <Label>주소 검색</Label>
          <Row $gap={6}>
            <TextField
              placeholder="예) 판교역로 235, 도산대로 33"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
            />
            <ButtonSmall text="검색" width="30%" active={!!keyword.trim()} onClick={handleSearch} />
          </Row>
        </Column>

        {showExamples && (
          <Column $gap={10} style={{ marginTop: '30px' }}>
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
              <AddressCard key={a.id} onClick={() => onPick(a)}>
                <Column $gap={10}>
                  <Addr>
                    {a.sido} {a.sigungu} {a.road} <br />
                    {a.building ? `${a.building}` : null}
                  </Addr>
                  <Row $gap={8} $align="center">
                    <Jibun>지번</Jibun>
                    <JibunAddr>{a.jibun ? `${a.jibun}` : null}</JibunAddr>
                  </Row>
                </Column>
              </AddressCard>
            ))}
          </ListWrap>
        )}

        {!showExamples && results.length === 0 && (
          <div style={{ marginTop: 16, color: '#767676', fontSize: 14 }}>
            검색 결과가 없습니다. 키워드를 다시 입력해주세요.
          </div>
        )}
      </div>
    </PageWrap>
  );
}

/* 2-2) 입주민 B: 층/호 입력 */
function StepUnitInput({ baseAddress, defaultUnit, onNext }) {
  const [floor, setFloor] = useState(defaultUnit?.floor != null ? String(defaultUnit.floor) : '');
  const [ho, setHo] = useState(defaultUnit?.ho != null ? String(defaultUnit.ho) : '');

  const floorNum = Number(floor);
  const hoNum = Number(ho);
  const isValidFloor = Number.isInteger(floorNum) && floorNum >= -5 && floorNum <= 200; // 지하층 고려
  const isValidHo = Number.isInteger(hoNum) && hoNum > 0 && hoNum <= 9999;
  const canSubmit = isValidFloor && isValidHo;

  const onlyDigits = v => v.replace(/[^\d-]/g, ''); // 지하층(-) 허용

  return (
    <PageWrap>
      <TopBar title="회원 등록" />
      <ProgressBar {...getProgressRange('UnitInput')} />
      <StepTitle>{'내 거주지의 \n주소를 등록해주세요'}</StepTitle>

      <div style={{ padding: '0px 24px' }}>
        <SelectedBox>
          <Addr>
            {baseAddress.sido} {baseAddress.sigungu} {baseAddress.road}
            <br />
            {baseAddress.building ? <span>{baseAddress.building}</span> : null}
          </Addr>
          <Row $gap={8} $align="center">
            <Jibun>지번</Jibun>
            <JibunAddr>{baseAddress.jibun ? ` ${baseAddress.jibun}` : null}</JibunAddr>
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
            onNext?.({
              floor: floorNum,
              ho: hoNum,
            });
          }}
        />
      </div>
    </PageWrap>
  );
}

/* 2-2) 입주민 C: 최종 확인/요청 → 완료 */
function StepReview({ baseAddress, floor, ho, detail }) {
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
        {/* 요청 전에는 70% (PROGRESS_MAP.Review) */}
        <ProgressBar {...getProgressRange('Review')} />
        <StepTitle>{'입주민 인증을 진행할게요'} </StepTitle>

        <div style={{ padding: '0px 28px' }}>
          <Column
            $gap={10}
            style={{
              borderBottom: '1px solid #EFEFEF',
              paddingBottom: '20px',
              marginBottom: '20px',
            }}
          >
            <InfoKey>정확한 주소가 맞나요?</InfoKey>

            <Caption1Addr>
              {baseAddress.sido} {baseAddress.sigungu} {baseAddress.road}
              <br />
              {baseAddress.building ? <span>{baseAddress.building}</span> : null}
              <br />
              {floor != null && ho ? `${floor}층 ${ho}호` : null}
              {detail ? ` ${detail}` : null}
            </Caption1Addr>

            <Row $gap={8} $align="center">
              <Jibun>지번</Jibun>
              <JibunAddr>{baseAddress.jibun ? ` ${baseAddress.jibun}` : null}</JibunAddr>
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
          <Button text="요청하기" active onClick={() => setRequested(true)} />
        </div>
      </PageWrap>
    );
  }

  // 요청 후 완료 화면 (진행바 없음 — 기존 UI 유지)
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

/* 2-3) 집주인 A: 건물명 입력 */
function StepOwnerBuildingInput({ baseAddress, defaultValue = '', onNext, onBack }) {
  const [buildingName, setBuildingName] = useState(defaultValue);
  const canSubmit = !!buildingName.trim();

  return (
    <PageWrap>
      <TopBar title="회원 등록" onBack={onBack} />
      <ProgressBar {...getProgressRange('L_UnitInput')} />
      <StepTitle>{'관리할 건물의\n주소를 등록해주세요'}</StepTitle>

      <div style={{ padding: '0px 24px' }}>
        <SelectedBox>
          <Addr>
            {baseAddress.sido} {baseAddress.sigungu} {baseAddress.road}
            <br />
            {baseAddress.building ? <span>{baseAddress.building}</span> : null}
          </Addr>
          <Row $gap={8} $align="center">
            <Jibun>지번</Jibun>
            <JibunAddr>{baseAddress.jibun ? ` ${baseAddress.jibun}` : null}</JibunAddr>
          </Row>
        </SelectedBox>

        <Column $gap={4}>
          <Label>상세 주소</Label>
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

/* 2-3) 집주인 B: 가구수 입력 */
function StepOwnerHouseholdCount({ defaultCount = '', onNext, onBack }) {
  const [count, setCount] = useState(String(defaultCount ?? ''));
  const n = Number(count);
  const isValid = Number.isInteger(n) && n > 0 && n < 10000;

  return (
    <PageWrap>
      <TopBar title="회원 등록" onBack={onBack} />
      <ProgressBar {...getProgressRange('L_HouseholdCount')} />
      <StepTitle>{'이 건물에는\n총 몇 가구가 있나요?'}</StepTitle>

      <div style={{ padding: '0px 24px' }}>
        <Column $gap={4}>
          <Label>가구 수</Label>
          <Row $gap={10} $align="center">
            <TextField
              placeholder="예) 1"
              inputMode="numeric"
              value={count}
              onChange={e => {
                const v = e.target.value.replace(/[^\d]/g, '');
                setCount(v);
              }}
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

/* 2-3) 집주인 C: 등기부등본 업로드 */
function StepOwnerDeedUpload({ defaultFileName = '', onNext, onBack }) {
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

      <div style={{ padding: '0px 24px' }}>
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
          text="다음"
          active={!!file || !!fileName}
          onClick={() => onNext({ deedFileName: fileName })}
        />
      </div>
    </PageWrap>
  );
}

/* 2-3) 집주인 D: 환영 화면 */
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
 * 3) 메인: InitProcess (변경 없음, 렌더 구조 그대로)
 * ========================================================================== */
export default function InitProcess() {
  const Funnel = useFunnel({
    id: 'init-process',
    initial: { step: 'Role', context: {} },
    steps: {},
    routes: step => `/init/${step}`,
  });

  return (
    <Funnel.Render
      Role={({ history }) => (
        <StepRole
          onNext={({ step, role }) => {
            history.push(step, { role });
          }}
        />
      )}
      /* ================= 입주민 플로우 ================ */
      AddressKeyword={({ history, context }) => (
        <StepAddressKeyword
          titleText={'내 거주지의 \n주소를 등록해주세요'}
          defaultKeyword={context.addressKeyword}
          onBack={history.back}
          onPick={baseAddress => {
            history.push('UnitInput', { ...context, baseAddress, role: 'tenant' });
          }}
        />
      )}
      UnitInput={({ history, context }) => (
        <StepUnitInput
          baseAddress={context.baseAddress}
          defaultUnit={{
            floor: context.floor,
            ho: context.ho,
          }}
          onNext={({ floor, ho }) => {
            history.push('Review', { ...context, floor, ho, role: 'tenant' });
          }}
        />
      )}
      Review={({ context }) => (
        <StepReview
          baseAddress={context.baseAddress}
          floor={context.floor}
          ho={context.ho}
          detail={context.detail}
        />
      )}
      /* ================= 집주인 플로우 ================ */
      L_AddressKeyword={({ history, context }) => (
        <StepAddressKeyword
          titleText={'관리할 건물의 \n주소를 등록해주세요'}
          defaultKeyword={context.addressKeyword}
          onBack={history.back}
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
          onNext={({ deedFileName }) => {
            history.push('L_Welcome', {
              ...context,
              deedFileName,
            });
          }}
        />
      )}
      L_Welcome={() => <StepOwnerWelcome />}
    />
  );
}

/* ============================================================================
 * 4) 스타일 (변경 없음)
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
  margin: 30px 0px 40px 28px;
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

const PlaceholderSquare = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 12px;
  background: ${color('grayscale.200')};
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
  animation: ${popBounce} 560ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
  will-change: transform, opacity;
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
  position: relative; /* ← 오프셋 배치를 위해 추가 */
  height: 2px;
  width: 100%;
  background: ${color('grayscale.200')};
`;

const ProgressFill = styled.div`
  position: absolute; /* ← 오프셋 배치 */
  top: 0;
  bottom: 0;
  left: ${({ $start = 0 }) => `${$start}%`}; /* 시작점 */
  width: ${({ $width = 0 }) => `${$width}%`}; /* 구간 길이 */
  background: ${color('brand.primary')};
  transition: left 220ms ease, width 220ms ease; /* 부드럽게 */
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
