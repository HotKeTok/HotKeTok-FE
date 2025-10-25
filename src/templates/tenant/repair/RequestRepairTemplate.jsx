import React, { useMemo, useState } from 'react';
import { useFunnel } from '@use-funnel/react-router-dom';
import { useNavigate } from 'react-router-dom';

import {
  StepPayer,
  StepForm,
  StepReview,
  StepDone,
  getNext7Days,
} from '../../../components/repair/request-repair';

export default function RequestRepairTemplate({
  onSubmitRequest,
  onImageFilesSelected,
  currentAddress,
}) {
  const navigate = useNavigate();
  const days = useMemo(() => getNext7Days(), []);
  const [draft, setDraft] = useState({
    payer: null,
    useAI: true,
    typeKey: null,
    dateKey: days[0]?.key || null,
    time: null,
    images: [],
    desc: '',
  });

  const Funnel = useFunnel({
    id: 'request-repair',
    initial: { step: 'Payer', context: {} },
    routes: s => `/request-repair/${s}`,
  });

  return (
    <Funnel.Render
      Payer={({ history }) => (
        <StepPayer
          draft={draft}
          setDraft={setDraft}
          onBack={history.back}
          onNext={() => history.push('Form', { ...draft })}
        />
      )}
      Form={({ history }) => (
        <StepForm
          draft={draft}
          setDraft={setDraft}
          days={days}
          onBack={history.back}
          onNext={() => history.push('Review', { ...draft })}
          onImageFilesSelected={onImageFilesSelected}
        />
      )}
      Review={({ history, context }) => (
        <StepReview
          context={context}
          onBack={history.back}
          onEdit={() => history.replace('Form', context)}
          onSubmit={() => history.push('Done')}
          currentAddress={currentAddress}
          onSubmitRequest={onSubmitRequest}
        />
      )}
      Done={({ history }) => <StepDone onHome={() => navigate('/')} onBack={history.back} />}
    />
  );
}
