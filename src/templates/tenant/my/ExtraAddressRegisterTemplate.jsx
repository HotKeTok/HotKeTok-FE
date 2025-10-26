// src/templates/tenant/my/ExtraAddressRegisterTemplate.jsx
import React, { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useFunnel } from '@use-funnel/react-router-dom';
import { useNavigate } from 'react-router-dom';
import Toast from '../../../components/common/Toast';

import TopBar from '../../../components/common/TopBar';
import { Row, Column, Spacer } from '../../../styles/flex';
import { color, typo } from '../../../styles/tokens';
import TextField from '../../../components/common/TextField';
import Button from '../../../components/common/Button';
import ButtonSmall from '../../../components/common/ButtonSmall';

import iconCheck from '../../../assets/repair/request-repair/icon_big-check.png';
import iconHouse from '../../../assets/my/address-admin/icon-house.svg';
import iconCompany from '../../../assets/my/address-admin/icon-building.svg';
import iconEtc from '../../../assets/my/address-admin/icon-location.svg';

const PLACE_TYPES = [
  { key: 'HOME', label: '우리집', icon: iconHouse },
  { key: 'WORK', label: '회사', icon: iconCompany },
  { key: 'ETC', label: '기타', icon: iconEtc },
];

// 원하는 비율로 자유롭게 수정 가능
const PROGRESS_RANGE = {
  AddressKeyword: [0, 50],
  UnitAndType: [0, 50],
  Review: [50, 100],
};

// 현재 스텝의 [start, end] 범위 반환
function getProgressRange(step) {
  const [start, end] = PROGRESS_RANGE[step] ?? [0, 100];
  return { start, end };
}

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

/* =========================================================
 * STEP 1: 주소 키워드 검색/선택
 * ======================================================= */
function StepAddressKeyword({ defaultKeyword, onPick, onBack, onSearch }) {
  const [keyword, setKeyword] = useState(defaultKeyword ?? '');
  const [results, setResults] = useState([]);
  const [showExamples, setShowExamples] = useState(true);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleSearch = async () => {
    const q = (keyword || '').trim();
    if (!q) return;
    setLoading(true);
    setErr('');
    try {
      const list = await onSearch(q); // ✅ 실제 API
      setResults(Array.isArray(list) ? list : []);
      setShowExamples(false);
    } catch (e) {
      setErr(e?.message || '주소 검색 중 오류가 발생했습니다.');
      setResults([]);
      setShowExamples(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrap>
      <TopBar title="주소 등록" onBack={onBack} />
      <ProgressBar {...getProgressRange('AddressKeyword')} />
      <StepTitle>{'추가할 주소를\n등록해주세요.'}</StepTitle>

      <div style={{ padding: '0 27px' }}>
        <Column $gap={2} style={{ marginBottom: '30px' }}>
          <Label>주소 검색</Label>
          <Row $gap={6}>
            <TextField
              placeholder="예) 판교역로 235, 도산대로 33"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSearch();
              }}
            />
            <ButtonSmall
              text={loading ? '검색중' : '검색'}
              width="30%"
              active={!!keyword.trim()}
              onClick={handleSearch}
            />
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
            {results.map((a, idx) => (
              <AddressCard
                key={`${a.sido}-${a.sigungu}-${a.road}-${idx}`}
                onClick={() => onPick(a)}
              >
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

        {!showExamples && !loading && results.length === 0 && (
          <div style={{ marginTop: 16, color: '#767676', fontSize: 14 }}>
            검색 결과가 없습니다. 키워드를 다시 입력해주세요.
          </div>
        )}
      </div>
    </PageWrap>
  );
}

/* =========================================================
 * STEP 2: 층/호 입력 + 주소 분류 선택
 * ======================================================= */
function StepUnitAndType({
  baseAddress,
  defaultDetail, // 호환 유지
  defaultType,
  onNext,
  onBack,
  hasHomeAlready,
}) {
  const [floor, setFloor] = useState(
    typeof defaultDetail?.floor === 'number' ? String(defaultDetail.floor) : ''
  );
  const [ho, setHo] = useState(
    typeof defaultDetail?.ho === 'number' ? String(defaultDetail.ho) : ''
  );

  const [placeType, setPlaceType] = useState(defaultType ?? null);
  const [customPlaceName, setCustomPlaceName] = useState('');
  const [askReplace, setAskReplace] = useState(false);

  const floorNum = Number(floor);
  const hoNum = Number(ho);
  const isValidFloor = Number.isInteger(floorNum) && floorNum >= -5 && floorNum <= 200;
  const isValidHo = Number.isInteger(hoNum) && hoNum > 0 && hoNum <= 9999;
  const canSubmit = isValidFloor && isValidHo && !!placeType;

  const onlyDigits = v => v.replace(/[^\d-]/g, '');

  useEffect(() => {
    if (placeType === 'HOME' && hasHomeAlready) {
      setAskReplace(true);
    }
  }, [placeType, hasHomeAlready]);

  const submit = (replaceHome = false) => {
    if (!canSubmit) return;
    onNext({
      floor: floorNum,
      ho: hoNum,
      placeType,
      replaceHome,
      customPlaceName: placeType === 'ETC' ? customPlaceName.trim() : '',
    });
  };

  return (
    <PageWrap>
      <TopBar title="주소 등록" onBack={onBack} />
      <ProgressBar {...getProgressRange('UnitAndType')} />
      <StepTitle>{'층/호수를 입력하고\n이 주소의 용도를 선택해주세요.'}</StepTitle>

      <div style={{ padding: '0 24px' }}>
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

        <Row $gap={24} style={{ marginBottom: 28 }}>
          <Column style={{ flex: 1 }}>
            <Label>층수</Label>
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
            {!isValidFloor && floor && (
              <SmallNotice style={{ color: '#FF5A5A', marginTop: 6 }}>
                -5 ~ 200 사이의 정수를 입력해 주세요.
              </SmallNotice>
            )}
          </Column>

          <Column style={{ flex: 1 }}>
            <Label>호수</Label>
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
            {!isValidHo && ho && (
              <SmallNotice style={{ color: '#FF5A5A', marginTop: 6 }}>
                1 ~ 9999 사이의 정수를 입력해 주세요.
              </SmallNotice>
            )}
          </Column>
        </Row>

        <Column $gap={6}>
          <SecTitle>주소 분류</SecTitle>
          <Row style={{ gap: 10 }}>
            {PLACE_TYPES.map(p => (
              <Segment
                key={p.key}
                $active={placeType === p.key}
                onClick={() => setPlaceType(p.key)}
              >
                <SegIcon src={p.icon} alt="" />
                <SegLabel>{p.label}</SegLabel>
              </Segment>
            ))}
          </Row>
        </Column>

        {placeType === 'ETC' && (
          <div style={{ marginTop: 20 }}>
            <SecTitle>주소 별칭</SecTitle>
            <EtcInput
              placeholder="어떤 장소인가요?"
              value={customPlaceName}
              onChange={e => setCustomPlaceName(e.target.value)}
              maxLength={15}
            />
          </div>
        )}
      </div>

      <Spacer />
      <div style={{ padding: '30px 24px' }}>
        <Button text="다음" active={canSubmit} onClick={() => submit(false)} />
      </div>

      {askReplace && (
        <Dim>
          <Dialog>
            <DialogTitle>‘우리집’을 변경하시겠어요?</DialogTitle>
            <DialogDesc>이미 설정된 ‘우리집’ 주소가 있습니다.</DialogDesc>
            <Row $gap={8}>
              <DialogButton onClick={() => setAskReplace(false)}>아니요</DialogButton>
              <DialogPrimary
                onClick={() => {
                  setAskReplace(false);
                  submit(true);
                }}
              >
                변경하기
              </DialogPrimary>
            </Row>
          </Dialog>
        </Dim>
      )}
    </PageWrap>
  );
}

/* =========================================================
 * STEP 3: 최종 확인/요청 → 완료
 * ======================================================= */
function StepReview({ baseAddress, floor, ho, placeType, replaceHome, customPlaceName, onSubmit }) {
  const [requested, setRequested] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');
  const [showDoneBtn, setShowDoneBtn] = useState(false);
  const navigate = useNavigate();
  const [toast, setToast] = useState({ show: false, message: '', icon: null });

  useEffect(() => {
    if (!requested) return;
    const t = setTimeout(() => setShowDoneBtn(true), 800);
    return () => clearTimeout(t);
  }, [requested]);

  const handleRequest = async () => {
    setSubmitting(true);
    setErr('');
    try {
      await onSubmit({ baseAddress, floor, ho, placeType, replaceHome, customPlaceName });
      setRequested(true);
    } catch (e) {
      const code = e?.code || '';
      const msg = e?.message || '요청 중 오류가 발생했습니다.';
      if (code === 'HOUSE_NOT_FOUND' || msg.includes('주택을 찾을 수 없습니다')) {
        setToast({ show: true, message: '주택을 찾을 수 없습니다.', icon: 'warning' });
      }
      setErr(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const finishAndBack = () => {
    // 주소관리로 복귀 (리스트는 재조회)
    navigate('/address-admin', { replace: true });
  };

  if (!requested) {
    return (
      <PageWrap>
        <TopBar title="주소 등록" onBack={() => window.history.back()} />
        <ProgressBar {...getProgressRange('Review')} />
        <StepTitle>{'입주민 인증을 진행할게요'}</StepTitle>

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
              {floor != null && ho != null ? `${floor}층 ${ho}호` : null}
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
          <Button text={submitting ? '요청 중...' : '요청하기'} active onClick={handleRequest} />
        </div>
        <Toast
          message={toast.message}
          icon={toast.icon} // 'warning' 전달 시 경고 아이콘
          show={toast.show}
          duration={1500}
          onClose={() => setToast(t => ({ ...t, show: false }))}
        />
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
        <FadeInWrap>
          <Button text="완료하기" active={showDoneBtn} onClick={finishAndBack} />
        </FadeInWrap>
      </div>
      <Toast
        message={toast.message}
        icon={toast.icon} // 'warning' 전달 시 경고 아이콘
        show={toast.show}
        duration={1500}
        onClose={() => setToast(t => ({ ...t, show: false }))}
      />
    </PageWrap>
  );
}

/* =========================================================
 * 메인: Funnel.Render
 * ======================================================= */
// ✅ onSearch, onSubmit을 외부(페이지)로부터 주입
export default function ExtraAddressRegisterTemplate({
  hasHomeAlready = false,
  onSearch,
  onSubmit,
}) {
  const Funnel = useFunnel({
    id: 'address-add',
    initial: { step: 'AddressKeyword', context: {} },
    steps: {},
    routes: step => `/address/add/${step}`,
  });

  return (
    <Funnel.Render
      AddressKeyword={({ history, context }) => (
        <StepAddressKeyword
          defaultKeyword={context.keyword}
          onBack={() => history.exit('/address-admin')}
          onPick={baseAddress => history.push('UnitAndType', { ...context, baseAddress })}
          onSearch={onSearch}
        />
      )}
      UnitAndType={({ history, context }) => (
        <StepUnitAndType
          baseAddress={context.baseAddress}
          defaultDetail={{ floor: context.floor, ho: context.ho }}
          defaultType={context.placeType}
          hasHomeAlready={hasHomeAlready}
          onBack={history.back}
          onNext={({ floor, ho, placeType, replaceHome, customPlaceName }) =>
            history.push('Review', {
              ...context,
              floor,
              ho,
              placeType,
              replaceHome,
              customPlaceName,
            })
          }
        />
      )}
      Review={({ context }) => (
        <StepReview
          baseAddress={context.baseAddress}
          floor={context.floor}
          ho={context.ho}
          placeType={context.placeType}
          replaceHome={context.replaceHome}
          customPlaceName={context.customPlaceName}
          onSubmit={onSubmit}
        />
      )}
    />
  );
}

/* ============================= 스타일 (변경 없음) ============================= */
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
  ${typo('h3')};
  color: ${color('grayscale.800')};
  animation: ${fadeUp} 360ms ease 80ms both;
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
const SecTitle = styled.div`
  ${typo('body2')}
  color: ${color('grayscale.700')};
`;
const Segment = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 110px;
  height: 80px;
  border-radius: 10px;
  padding: auto;
  border: 1px solid ${color('grayscale.300')};
  background: #fff;
  gap: 10px;
  cursor: pointer;

  ${p =>
    p.$active &&
    css`
      background: ${color('brand.primary')};
      border-color: ${color('brand.500')};
      & ${SegLabel} {
        color: #fff;
      }
      & ${SegIcon} {
        filter: brightness(0) invert(1);
      }
    `}
`;
const SegIcon = styled.img`
  width: 17px;
  height: 17px;
`;
const SegLabel = styled.div`
  ${typo('body2')}
  color: ${color('grayscale.800')};
  white-space: nowrap;
`;
const EtcInput = styled.input`
  margin-top: 4px;
  width: 100%;
  padding: 13px 15px;
  border: 1px solid ${color('grayscale.200')};
  border-radius: 6px;
  ${typo('body2')}
  color: ${color('grayscale.800')};
  outline: none;
  background: ${color('grayscale.100')};
  &::placeholder {
    color: ${color('grayscale.400')};
  }
`;
const Dim = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;
const Dialog = styled.div`
  width: 320px;
  padding: 20px;
  border-radius: 12px;
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const DialogTitle = styled.div`
  ${typo('h4')};
  color: ${color('grayscale.900')};
`;
const DialogDesc = styled.div`
  ${typo('body2')};
  color: ${color('grayscale.700')};
`;
const DialogButton = styled.button`
  flex: 1;
  height: 44px;
  border-radius: 10px;
  border: 1px solid ${color('grayscale.300')};
  background: #fff;
  ${typo('button2')};
  color: ${color('grayscale.700')};
`;
const DialogPrimary = styled.button`
  flex: 1;
  height: 44px;
  border-radius: 10px;
  border: none;
  background: ${color('brand.primary')};
  ${typo('button2')};
  color: #fff;
`;
