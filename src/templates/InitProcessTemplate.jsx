// src/pages/InitProcess.jsx
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useFunnel } from '@use-funnel/react-router-dom';

import TopBar from '../components/common/TopBar';
import { color, typo } from '../styles/tokens';
import { Row, Column, Spacer } from '../styles/flex';
import TextField from '../components/common/TextField';
import Button from '../components/common/Button';
import ButtonSmall from '../components/common/ButtonSmall';
import ModeItem from '../components/common/ModeItem';
import { useNavigate } from 'react-router-dom';

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

/* =========================================================
 * 스텝 컴포넌트들
 * ======================================================= */

// STEP 1: 모드 선택
function StepRole({ onNext }) {
  // 선택된 모드 상태 ('tenant' | 'landlord' | null)
  const [selectedRole, setSelectedRole] = useState(null);

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
          active={!!selectedRole} // 하나라도 선택되면 active=true
          onClick={() => {
            if (selectedRole) {
              onNext(selectedRole); // 버튼 누를 때만 다음 단계로 이동
            }
          }}
        />
      </div>
    </PageWrap>
  );
}

// STEP 2: 주소 키워드 입력
function StepAddressKeyword({ defaultKeyword, onPick }) {
  const [keyword, setKeyword] = useState(defaultKeyword ?? '');

  // 추가 상태
  const [results, setResults] = useState([]);
  const [showExamples, setShowExamples] = useState(true);

  const handleSearch = () => {
    const list = mockSearchAddresses(keyword);
    setResults(list);
    setShowExamples(false);
  };

  return (
    <PageWrap>
      <TopBar title="회원 등록" onBack={() => window.history.back()} />
      <ProgressBar value={66} />
      <StepTitle>{'내 거주지의 \n주소를 등록해주세요'} </StepTitle>
      <div style={{ padding: '0px 27px' }}>
        <Column $gap={2} style={{ marginBottom: '30px' }}>
          <Label>주소 검색</Label>
          <Row $gap={6}>
            <TextField
              placeholder="예) 판교역로 235, 도산대로 33"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <ButtonSmall text="검색" width="30%" active={!!keyword.trim()} onClick={handleSearch} />
          </Row>
        </Column>

        {/* 🔹 검색 전: 예시 문구 노출 */}
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

        {/* 🔹 검색 후: 결과 리스트 노출 (입력 아래) */}
        {!showExamples && results.length > 0 && (
          <ListWrap style={{ marginTop: 16 }}>
            {results.map((a) => (
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

        {/* 검색 후 결과 없을 때 메시지 */}
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
            onChange={(e) => setDetail(e.target.value)}
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
            // 필요 시 dong/ho도 넘길 수 있음. 현재는 detail만 사용.
            onNext?.({ detail: detail.trim() });
          }}
        />
      </div>
    </PageWrap>
  );
}

// STEP 4: 최종 확인 (요청 버튼)
function StepReview({ baseAddress, dong, ho, detail }) {
  const [requested, setRequested] = useState(false);
  const [showDoneBtn, setShowDoneBtn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!requested) return;
    const t = setTimeout(() => setShowDoneBtn(true), 800); // 0.8초 후 버튼 등장
    return () => clearTimeout(t);
  }, [requested]);

  // 요청 전: 확인 화면 + [요청하기]
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

  // 요청 후: 중앙 가이드 + [완료하기] (지연 노출)
  return (
    <PageWrap>
      <ContentWrapCentered>
        <PlaceholderSquare />
        <InfoKey>인증이 요청되었어요!</InfoKey>
        <Desc>인증이 완료되면 알림을 보내드릴게요!</Desc>
      </ContentWrapCentered>

      <div style={{ padding: '30px 24px' }}>
        <FadeInWrap $show={showDoneBtn}>
          <Button text="완료하기" active={showDoneBtn} onClick={() => navigate('/')} />
        </FadeInWrap>
      </div>
    </PageWrap>
  );
}

// 메인 함수
export default function InitProcessTemplate() {
  const funnel = useFunnel({
    id: 'init-process',
    initial: { step: 'Role', context: {} },
  });

  switch (funnel.step) {
    case 'Role':
      return <StepRole onNext={(role) => funnel.history.push('AddressKeyword', { role })} />;

    case 'AddressKeyword':
      return (
        <StepAddressKeyword
          defaultKeyword={funnel.context.addressKeyword}
          onPick={(baseAddress) =>
            funnel.history.push('UnitInput', {
              role: funnel.context.role,
              baseAddress,
            })
          }
        />
      );
    case 'AddressPick':
      return (
        <StepAddressPick
          keyword={funnel.context.addressKeyword}
          onPick={(baseAddress) =>
            funnel.history.push('UnitInput', {
              role: funnel.context.role,
              baseAddress,
            })
          }
        />
      );

    case 'UnitInput':
      return (
        <StepUnitInput
          baseAddress={funnel.context.baseAddress}
          defaultUnit={{
            dong: funnel.context.dong,
            ho: funnel.context.ho,
            detail: funnel.context.detail,
          }}
          onNext={({ dong, ho, detail }) =>
            funnel.history.push('Review', {
              role: funnel.context.role,
              baseAddress: funnel.context.baseAddress,
              dong,
              ho,
              detail,
            })
          }
        />
      );

    case 'Review':
      return (
        <StepReview
          baseAddress={funnel.context.baseAddress}
          dong={funnel.context.dong}
          ho={funnel.context.ho}
          detail={funnel.context.detail}
        />
      );

    default:
      return null;
  }
}

// 스타일
const PageWrap = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
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

const BottomBarWrap = styled.div`
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px 20px 16px;
  background: ${color('grayscale.0')};
  border-top: 1px solid ${color('grayscale.200')};
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

const FadeInWrap = styled.div`
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  transform: translateY(${({ $show }) => ($show ? '0px' : '6px')});
  transition: opacity 240ms ease, transform 240ms ease;
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

function ProgressBar({ value = 0 }) {
  return (
    <div>
      <ProgressTrack>
        <ProgressFill $value={value} />
      </ProgressTrack>
    </div>
  );
}
