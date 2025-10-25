// src/pages/tenant/repair/RequestRepair.jsx
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RequestRepairTemplate from '../../../templates/tenant/repair/RequestRepairTemplate';

import { getAccessToken } from '../../../utils/auth';
import { fetchCurrentAddress } from '../../../api/user-service';
import { apiCreateRequestFormMultipart } from '../../../api/requestform-service';

// 오전/오후 → 24시간
function toIsoDateTime(dateKey, timeLabel) {
  if (!dateKey || !timeLabel) return null;
  const isAM = timeLabel.startsWith('오전');
  const [hhmm] = timeLabel.replace('오전', '').replace('오후', '').trim().split(' ');
  let [h, m] = hhmm.split(':').map(Number);
  if (isAM) {
    if (h === 12) h = 0;
  } else {
    if (h !== 12) h += 12;
  }
  const d = new Date(`${dateKey}T00:00:00`);
  d.setHours(h);
  d.setMinutes(m || 0);
  d.setSeconds(0);
  const yyyy = d.getFullYear();
  const MM = String(d.getMonth() + 1).padStart(2, '0');
  const DD = String(d.getDate()).padStart(2, '0');
  const HH = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}-${MM}-${DD}T${HH}:${mm}:00`;
}

const CATEGORY_MAP = {
  appliance: '가전',
  door_window: '문_창문',
  water_boiler: '수도_보일러',
  electric: '전기_조명',
  etc: '기타',
};
const PAYER_MAP = { me: 'RESIDENT', landlord: 'PROPRIETORSHIP' };

export default function RequestRepair() {
  const navigate = useNavigate();
  const accessToken = useMemo(() => getAccessToken(), []);

  const [loading, setLoading] = useState(false);
  const [addr, setAddr] = useState({ address: '', number: '' });
  const [imageFiles, setImageFiles] = useState([]); // ✅ 실제 업로드용 파일 배열

  // 현재 주소/동호수 로드
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetchCurrentAddress(accessToken);
        const a = res?.data?.data ?? res?.data;
        if (mounted)
          setAddr({
            address: a?.currentAddress ?? '',
            number: a?.currentNumber ?? '',
          });
      } catch (e) {
        console.error(e);
        if (mounted) setAddr({ address: '', number: '' });
      }
    })();
    return () => {
      mounted = false;
    };
  }, [accessToken]);

  const handleImageFilesSelected = useCallback(files => {
    // files: 이번에 추가로 선택된 File[] (누적 필요)
    setImageFiles(prev => {
      const remain = Math.max(0, 8 - prev.length);
      const toAdd = files.slice(0, remain);
      return [...prev, ...toAdd];
    });
  }, []);

  // draft → API payload
  const buildPayload = useCallback(
    draft => ({
      payType: PAYER_MAP[draft?.payer] ?? 'RESIDENT',
      category: CATEGORY_MAP[draft?.typeKey] ?? '기타',
      description: (draft?.desc || '').trim(),
      requestSchedule: toIsoDateTime(draft?.dateKey, draft?.time),
      address: addr.address,
      number: addr.number,
    }),
    [addr.address, addr.number]
  );

  // 제출
  const handleSubmitRequest = useCallback(
    async draft => {
      if (!addr.address || !addr.number) {
        alert('현재 주소 정보가 없습니다. 마이페이지에서 주소를 먼저 설정해주세요.');
        return { ok: false };
      }
      const payload = buildPayload(draft);
      if (!payload.requestSchedule) {
        alert('날짜/시간을 선택해주세요.');
        return { ok: false };
      }
      if (!payload.description) {
        alert('증상 설명을 입력해주세요.');
        return { ok: false };
      }

      try {
        setLoading(true);
        const res = await apiCreateRequestFormMultipart(accessToken, payload, imageFiles);
        if (!res.success) {
          alert(res.message || '요청 생성에 실패했어요.');
          return { ok: false };
        }
        return { ok: true, requestFormId: res?.data?.requestFormId };
      } catch (e) {
        console.error(e);
        alert('요청 생성 중 오류가 발생했어요.');
        return { ok: false };
      } finally {
        setLoading(false);
      }
    },
    [accessToken, addr.address, addr.number, buildPayload, imageFiles, navigate]
  );

  return (
    <div>
      <RequestRepairTemplate
        // ✅ 페이지 측 연동 콜백/데이터만 주입 (UI 변경 없음)
        onSubmitRequest={handleSubmitRequest}
        onImageFilesSelected={handleImageFilesSelected}
        loading={loading}
        currentAddress={addr}
      />
    </div>
  );
}
