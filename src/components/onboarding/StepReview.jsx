import React, { useEffect, useState } from 'react';
import TopBar from '../common/TopBar';
import Button from '../common/Button';
import { Column, Row, Spacer } from '../../styles/flex';
import { useNavigate } from 'react-router-dom';
import { getProgressRange } from './progress';
import ProgressBar from './ProgressBar';
import iconCheck from '../../assets/repair/request-repair/icon_big-check.png';
import {
  PageWrap,
  StepTitle,
  InfoKey,
  Caption1Addr,
  Jibun,
  JibunAddr,
  SmallNotice,
  SmallNoticeGreen,
  ContentWrapCentered,
  SubmitIcon,
  SuccessTitle,
  SuccessSub,
  FadeInWrap,
} from './InitProcessStyles';

export default function StepReview({ baseAddress, floor, ho, requesting, onRequestTenant }) {
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
