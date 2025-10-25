import React from 'react';
import TopBar from '../../../components/common/TopBar';
import ModeItem from '../../../components/common/ModeItem';
import Button from '../../../components/common/Button';
import { Row, Column, Spacer } from '../../../styles/flex';
import meIcon from '../../../assets/repair/request-repair/icon-me.svg';
import landlordIcon from '../../../assets/repair/request-repair/icon-landlord.svg';
import { StepWrap, SectionTitle, Tip, IconWrapper, BoldText, SubBullets } from './styles';

export default function StepPayer({ draft, setDraft, onNext, onBack }) {
  return (
    <StepWrap>
      <TopBar title="수리요청서 작성" onBack={onBack} style={{ marginBottom: '10px' }} />
      <div style={{ height: '20px' }} />
      <Column $gap={8} style={{ marginBottom: '24px', padding: '0px 24px' }}>
        <SectionTitle>수리 비용은 누가 부담하나요?</SectionTitle>
        <Tip>세부 기준은 선택 후 확인할 수 있어요</Tip>
        <Tip>
          헷갈린다면, 수리 요청 전 집주인과 먼저 상의해 주세요.
          <br />
          명확한 합의를 통해 원활한 수리 진행이 가능합니다.
        </Tip>
      </Column>

      <Column $gap={10} style={{ padding: '0px 20px' }}>
        <ModeItem
          selected={draft.payer === 'me'}
          onClick={() => setDraft(p => ({ ...p, payer: 'me' }))}
          height="100%"
          padding="18px 24px"
        >
          <Row $gap={12}>
            <IconWrapper src={meIcon} alt="본인부담아이콘" />
            <Column>
              <BoldText>제가 부담할게요.</BoldText>
              {draft.payer === 'me' && (
                <SubBullets>
                  <li>본인 부주의로 인한 파손 (예: 창문 깨짐, 문 고장)</li>
                  <li>입주 후 설치한 개인 가전·가구 관련 수리</li>
                </SubBullets>
              )}
            </Column>
          </Row>
        </ModeItem>

        <ModeItem
          selected={draft.payer === 'landlord'}
          onClick={() => setDraft(p => ({ ...p, payer: 'landlord' }))}
          height="100%"
          padding="18px 24px"
        >
          <Row $gap={12}>
            <IconWrapper src={landlordIcon} alt="집주인부담아이콘" />
            <Column>
              <BoldText>집주인이 부담할 예정이에요.</BoldText>
              {draft.payer === 'landlord' && (
                <SubBullets>
                  <li>수도, 전기, 보일러, 배관 등 건물의 기본 설비 문제</li>
                  <li>자연 마모나 노후화로 인한 고장</li>
                </SubBullets>
              )}
            </Column>
          </Row>
        </ModeItem>
      </Column>

      <Spacer />
      <div style={{ padding: '40px 24px' }}>
        <Button text="다음" active={!!draft.payer} onClick={onNext} />
      </div>
    </StepWrap>
  );
}
