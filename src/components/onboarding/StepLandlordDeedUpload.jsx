import React, { useState } from 'react';
import TopBar from '../common/TopBar';
import Button from '../common/Button';
import { Column, Spacer } from '../../styles/flex';
import { getProgressRange } from './progress';
import ProgressBar from './ProgressBar';
import iconFolder from '../../assets/common/icon-folder.svg';
import {
  PageWrap,
  StepTitle,
  UploadBox,
  UploadIcon,
  UploadTitle,
  SmallNotice,
} from './InitProcessStyles';

export default function StepLandlordDeedUpload({
  defaultFileName = '',
  onSubmitLandlord,
  submitting,
  onBack,
}) {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(defaultFileName || '');
  const inputId = 'deed-input';

  const handlePick = e => {
    const f = e.target.files?.[0];
    if (!f) return;
    const ok = f.type === 'application/pdf' || f.type.startsWith('image/');
    if (!ok) {
      alert('PDF 또는 이미지 파일만 업로드할 수 있어요.');
      e.target.value = '';
      return;
    }
    setFile(f);
    setFileName(f.name);
  };

  return (
    <PageWrap>
      <TopBar title="회원 등록" onBack={onBack} />
      <ProgressBar {...getProgressRange('L_LandlordDocUpload')} />
      <StepTitle>{'집주인 인증을 위해\n등기부등본을 업로드해주세요.'}</StepTitle>

      <div style={{ padding: '0 24px' }}>
        <UploadBox onClick={() => document.getElementById(inputId).click()}>
          <div style={{ textAlign: 'center' }}>
            <Column $gap={10} $align="center">
              <UploadIcon src={iconFolder} />
              <UploadTitle>{fileName || '파일 선택하기'}</UploadTitle>
            </Column>
          </div>
          <input
            id={inputId}
            type="file"
            accept="application/pdf,image/*"
            style={{ display: 'none' }}
            onChange={handlePick}
          />
        </UploadBox>

        <div style={{ marginTop: 10 }}>
          <SmallNotice style={{ color: '#3C66FF' }}>
            * 등기부등본은 PDF나 이미지로 등록할 수 있어요.
            <br />* 제출된 자료는 인증 외 다른 용도로 사용되지 않아요.
          </SmallNotice>
        </div>
      </div>

      <Spacer />
      <div style={{ padding: '30px 24px' }}>
        <Button
          text={submitting ? '제출 중...' : '등록 완료'}
          active={!!file && !submitting}
          onClick={() => onSubmitLandlord?.(file)}
          disabled={!file || submitting}
        />
      </div>
    </PageWrap>
  );
}
