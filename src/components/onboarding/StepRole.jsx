import React, { useState } from 'react';
import TopBar from '../common/TopBar';
import Button from '../common/Button';
import ModeItem from '../common/ModeItem';
import { Column, Spacer } from '../../styles/flex';
import { getProgressRange } from './progress';
import ProgressBar from './ProgressBar';
import { PageWrap, StepTitle, CardTitle, CardDesc } from './InitProcessStyles';
import { useNavigate } from 'react-router-dom';

export default function StepRole({ onNext }) {
  const [selectedRole, setSelectedRole] = useState(null); // 'tenant' | 'landlord'

  const nav = useNavigate();

  const goSignIn = () => {
    nav('/sign-in');
  };

  return (
    <PageWrap>
      <TopBar title="회원 등록" onBack={goSignIn} />
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
      <div style={{ padding: '30px 24px', position: 'sticky', bottom: '0' }}>
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
