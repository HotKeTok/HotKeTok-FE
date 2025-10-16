// ✅ UI/라우팅 전담 템플릿 (로직/통신은 pages/common/InitProcess.jsx)
import React, { useState } from 'react';
import { useFunnel } from '@use-funnel/react-router-dom';
import Toast from '../../components/common/Toast';

// 분리된 스텝 컴포넌트
import StepRole from '../../components/onboarding/StepRole';
import StepAddressKeyword from '../../components/onboarding/StepAddressKeyword';
import StepUnitInput from '../../components/onboarding/StepUnitInput';
import StepReview from '../../components/onboarding/StepReview';
import StepLandlordBuildingInput from '../../components/onboarding/StepLandlordBuildingInput';
import StepLandlordHouseholdCount from '../../components/onboarding/StepLandlordHouseholdCount';
import StepLandlordDeedUpload from '../../components/onboarding/StepLandlordDeedUpload';
import StepLandlordWelcome from '../../components/onboarding/StepLandlordWelcome';

// 간단 토스트 훅(템플릿 한정)
function useToast() {
  const [toast, setToast] = useState({ open: false, message: '', icon: 'warning' });
  const open = (message, icon = 'warning') => setToast({ open: true, message, icon });
  const close = () => setToast({ open: false, message: '', icon: 'warning' });
  return { toast, open, close };
}

export default function InitProcessTemplate({
  loading,
  onSearchAddress,
  onSubmitTenant,
  onSubmitLandlord,
}) {
  const { toast, open: openToast, close: closeToast } = useToast();

  const Funnel = useFunnel({
    id: 'init-process',
    initial: { step: 'Role', context: {} },
    steps: {},
    routes: step => `/init/${step}`,
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
          <StepLandlordBuildingInput
            baseAddress={context.baseAddress}
            defaultValue={context.detail}
            onBack={history.back}
            onNext={({ detail }) => {
              history.push('L_HouseholdCount', { ...context, detail, role: 'landlord' });
            }}
          />
        )}
        L_HouseholdCount={({ history, context }) => (
          <StepLandlordHouseholdCount
            defaultCount={context.totalHouseholds}
            onBack={history.back}
            onNext={totalHouseholds => {
              history.push('L_LandlordDocUpload', { ...context, totalHouseholds });
            }}
          />
        )}
        L_LandlordDocUpload={({ history, context }) => (
          <StepLandlordDeedUpload
            defaultFileName={context.deedFileName}
            onBack={history.back}
            submitting={loading?.submittingLandlord}
            onSubmitLandlord={async file => {
              const res = await onSubmitLandlord?.({
                address: context.baseAddress.roadAddr,
                detailAddress: context.detail,
                count: context.totalHouseholds,
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
        L_Welcome={() => <StepLandlordWelcome />}
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
