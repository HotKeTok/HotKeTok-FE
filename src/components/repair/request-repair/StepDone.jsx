import React from 'react';
import Button from '../../../components/common/Button';
import { Column, Spacer } from '../../../styles/flex';
import iconSubmit from '../../../assets/repair/request-repair/icon_request-submit.png';
import { StepWrap, SubmitIcon, SuccessTitle, SuccessSub, FadeInWrap } from './styles';

export default function StepDone({ onHome }) {
  return (
    <StepWrap>
      <Spacer />
      <Column $center={true} $gap={20}>
        <SubmitIcon src={iconSubmit} />
        <SuccessTitle>수리 요청서를 제출했어요!</SuccessTitle>
        <SuccessSub>
          작성한 요청서를 바탕으로
          <br />
          견적서를 받으면 알림을 보내드릴게요.
        </SuccessSub>
      </Column>
      <Spacer />
      <div style={{ padding: '40px 24px' }}>
        <FadeInWrap>
          <Button text="홈으로 돌아가기" active onClick={onHome} />
        </FadeInWrap>
      </div>
    </StepWrap>
  );
}
