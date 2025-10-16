import React, { useEffect, useState } from 'react';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';
import iconCheck from '../../assets/repair/request-repair/icon_big-check.png';
import {
  PageWrap,
  ContentWrapCentered,
  SubmitIcon,
  SuccessTitle,
  SuccessSub,
  FadeInWrap,
} from './InitProcessStyles';

export default function StepLandlordWelcome() {
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
