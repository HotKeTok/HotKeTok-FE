import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import TopBar from '../../components/common/TopBar';
import RepairProgressTemplate from '../../templates/tenant/repair/RepairProgressTemplate';
import { getProgressInitialProps } from '../../mocks';

export default function RepairProgress() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const id = params.get('id');
  const init = id ? getProgressInitialProps(id) : null;

  if (!init) {
    return (
      <>
        <TopBar title="수리 상세" />
        <div style={{ padding: 24 }}>
          존재하지 않는 수리 내역입니다.
          <div style={{ height: 12 }} />
          <button onClick={() => navigate(-1)}>뒤로가기</button>
        </div>
      </>
    );
  }

  return <RepairProgressTemplate {...init} />;
}
