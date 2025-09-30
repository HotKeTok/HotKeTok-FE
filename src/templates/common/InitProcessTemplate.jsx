// src/pages/InitProcess.jsx
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

/* =========================================================
 * 모의 주소 검색 (실서비스에서는 API로 교체)
 * ======================================================= */
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

function ProgressBar({ value = 0 }) {
  return (
    <div>
      <ProgressTrack>
        <ProgressFill $value={value} />
      </ProgressTrack>
    </div>
  );
}

/* =========================================================
 * STEP 컴포넌트들 (UI 그대로 유지)
 * ======================================================= */

// STEP 1: 모드 선택
function StepRole({ onNext }) {
  const [selectedRole, setSelectedRole] = useState(null); // 'tenant' | 'landlord' | null

  return (
    <PageWrap>
      <TopBar title="회원 등록" />
      <ProgressBar value={33} />
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
            // ✅ 모드에 따라 다음 스텝 분기
            if (selectedRole === 'tenant') onNext({ step: 'AddressKeyword', role: 'tenant' });
            else onNext({ step: 'L_AddressKeyword', role: 'landlord' });
          }}
        />
      </div>
    </PageWrap>
  );
}

// STEP 2: 주소 키워드 입력 + 검색/선택
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
      <ProgressBar value={66} />
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

// STEP 3: 동/호/상세 입력
function StepUnitInput({ baseAddress, defaultUnit, onNext }) {
  const [detail, setDetail] = useState(defaultUnit?.detail ?? '');
  const canSubmit = !!detail.trim();

  return (
    <PageWrap>
      <TopBar title="회원 등록" />
      <ProgressBar value={66} />
      <StepTitle>{'내 거주지의 \n주소를 등록해주세요'} </StepTitle>
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
            placeholder="예) 101동 101호"
            value={detail}
            onChange={e => setDetail(e.target.value)}
          />
          <Label style={{ color: '#3C66FF' }}>* 상세주소를 반드시 확인해 주세요.</Label>
        </Column>
      </div>
      <Spacer />
      <div style={{ padding: '30px 24px' }}>
        <Button
          text="등록하기"
          active={canSubmit}
          onClick={() => {
            if (!canSubmit) return;
            onNext?.({ detail: detail.trim() });
          }}
        />
      </div>
    </PageWrap>
  );
}

// STEP 4: 최종 확인/요청 → 완료
function StepReview({ baseAddress, dong, ho, detail }) {
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
        <ProgressBar value={100} />
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
              {dong && ho ? `${dong}동 ${ho}호` : null}
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

// --------- 집주인 플로우 ------
// 가구수 입력
function StepOwnerHouseholdCount({ defaultCount = '', onNext, onBack }) {
  const [count, setCount] = useState(String(defaultCount ?? ''));
  const n = Number(count);
  const isValid = Number.isInteger(n) && n > 0 && n < 10000; // 예시 유효성

  return (
    <PageWrap>
      <TopBar title="회원 등록" onBack={onBack} />
      <ProgressBar value={75} />
      <StepTitle>{'이 건물에는\n총 몇 가구가 있나요?'}</StepTitle>

      <div style={{ padding: '0px 24px' }}>
        <Label>가구 수</Label>
        <TextField
          placeholder="예) 1"
          inputMode="numeric"
          value={count}
          onChange={e => {
            // 숫자만 허용
            const v = e.target.value.replace(/[^\d]/g, '');
            setCount(v);
          }}
          suffix="가구"
        />
      </div>

      <Spacer />
      <div style={{ padding: '30px 24px' }}>
        <Button text="다음" active={isValid} onClick={() => isValid && onNext(n)} />
      </div>
    </PageWrap>
  );
}

// 등기부등본입력

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
      <ProgressBar value={90} />
      <StepTitle>{'집주인 인증을 위해\n등기부등본을 업로드해주세요.'}</StepTitle>

      <div style={{ padding: '0px 24px' }}>
        <UploadBox onClick={() => document.getElementById(inputId).click()}>
          <div style={{ textAlign: 'center' }}>
            <UploadTitle>파일 선택하기</UploadTitle>
            <UploadSub>{fileName || 'PDF 또는 이미지 파일 업로드'}</UploadSub>
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
          <SmallNotice>* 등기부등본은 PDF나 이미지로 등록할 수 있어요.</SmallNotice>
          <SmallNotice>* 제출된 자료는 인증 외 다른 용도로 사용되지 않아요.</SmallNotice>
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

/* =========================================================
 * 메인: 공식 문서 패턴으로 변경 (Funnel.Render)
 * ======================================================= */
export default function InitProcess() {
  const Funnel = useFunnel({
    id: 'init-process',
    initial: { step: 'Role', context: {} },
    steps: {},
    routes: step => `/init/${step}`,
  });

  return (
    <Funnel.Render
      /* STEP 1: 모드 선택 */
      Role={({ history }) => (
        <StepRole
          onNext={({ step, role }) => {
            // role을 context에 저장하고, 입주민/집주인 분기된 첫 스텝으로 이동
            history.push(step, { role });
          }}
        />
      )}
      // ================= 입주민 플로우 ================
      AddressKeyword={({ history, context }) => (
        <StepAddressKeyword
          titleText={'내 거주지의 \n주소를 등록해주세요'} // 기본값이라면 생략 가능
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
            dong: context.dong,
            ho: context.ho,
            detail: context.detail,
          }}
          onNext={({ dong, ho, detail }) => {
            history.push('Review', {
              ...context,
              dong,
              ho,
              detail,
              role: 'tenant',
            });
          }}
        />
      )}
      Review={({ context }) => (
        <StepReview
          baseAddress={context.baseAddress}
          dong={context.dong}
          ho={context.ho}
          detail={context.detail}
        />
      )}
      // ================= 집주인 플로우 ================
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
        <StepUnitInput
          baseAddress={context.baseAddress}
          defaultUnit={{ detail: context.detail }}
          onNext={({ detail }) => {
            // ✅ 다음 스텝을 "가구 수 입력"으로 분기
            history.push('L_HouseholdCount', { ...context, detail, role: 'landlord' });
          }}
        />
      )}
      // ✅ 새로 추가되는 스텝 1: 가구 수 입력
      L_HouseholdCount={({ history, context }) => (
        <StepOwnerHouseholdCount
          defaultCount={context.totalHouseholds}
          onBack={history.back}
          onNext={totalHouseholds => {
            history.push('L_OwnerDocUpload', { ...context, totalHouseholds });
          }}
        />
      )}
      // ✅ 새로 추가되는 스텝 2: 등기부등본 업로드
      L_OwnerDocUpload={({ history, context }) => (
        <StepOwnerDeedUpload
          defaultFileName={context.deedFileName}
          onBack={history.back}
          onNext={({ deedFileName }) => {
            // 최종 확인(공용 Review 쓰거나, 필요하면 전용으로 교체)
            history.push('L_Review', {
              ...context,
              deedFileName,
              // deedFile은 실제 업로드 API로 전송하는게 보통이라 컨텍스트에는 파일명만 유지
            });
          }}
        />
      )}
      L_Review={({ context }) => (
        <StepReview
          baseAddress={context.baseAddress}
          detail={context.detail}
          // 집주인 플로우라면 ProgressBar/문구 등을 바꾸고 싶으면 별도 컴포넌트로 분리해도 됨
        />
      )}
    />
  );
}

/* =========================================================
 * 스타일 (기존 그대로)
 * ======================================================= */
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

// 애니메이션
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
  animation: ${popBounce} 560ms cubic-bezier(0.2, 0.8, 0.2, 1) both; /* mount 시 1회 재생 */
  will-change: transform, opacity;
`;

const SuccessTitle = styled.div`
  ${typo('h3')};
  color: ${color('grayscale.800')};
  animation: ${popBounce} 560ms cubic-bezier(0.2, 0.8, 0.2, 1) both; /* mount 시 1회 재생 */
  will-change: transform, opacity;
  animation: ${fadeUp} 360ms ease 80ms both;
`;
const SuccessSub = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.800')};
  text-align: center;
  animation: ${fadeUp} 360ms ease 120ms both;
`;

const FadeInWrap = styled.div`
  animation: ${fadeUp} 700ms ease both; /* 나타나는 속도 */
  animation-delay: 800ms; /* 아이콘/텍스트 뜬 후 '조금 있다가' */
`;

/* 진행바 */
const ProgressTrack = styled.div`
  height: 2px;
  width: 100%;
  background: ${color('grayscale.200')};
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${({ $value }) => `${Math.min(100, Math.max(0, $value))}%`};
  background: ${color('brand.primary')};
  transition: width 220ms ease;
`;

/* --- 추가 스타일 --- */
const UploadBox = styled.div`
  width: 100%;
  height: 160px;
  border: 1px dashed ${color('grayscale.300')};
  border-radius: 12px;
  background: #fafafb;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const UploadTitle = styled.div`
  ${typo('body2')};
  margin-bottom: 8px;
`;

const UploadSub = styled.div`
  ${typo('caption1')};
  color: ${color('grayscale.500')};
`;
