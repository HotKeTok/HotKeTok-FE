// src/pages/repair/WriteReview.jsx
import React, { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import WriteReviewTemplate from '../../../templates/tenant/repair/WriteReviewTemplate';
import Toast from '../../../components/common/Toast';
import { apiCreateReview } from '../../../api/review-service';

// 템플릿에서 오는 types(Set 기반 key) → 서버 Enum 값 매핑 (밑줄 사용)
const CATEGORY_ENUM_BY_KEY = {
  appliance: '가전',
  door_window: '문_창문',
  water_boiler: '수도_보일러',
  electric: '전기_조명',
  etc: '기타',
};

// dataURL → Blob
function dataURLtoBlob(dataURL) {
  const [header, base64] = String(dataURL || '').split(',');
  const mimeMatch = /^data:(.*?);base64$/.exec(header || '');
  const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
  const binary = atob(base64 || '');
  const u8 = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) u8[i] = binary.charCodeAt(i);
  return new Blob([u8], { type: mime });
}

export default function WriteReview() {
  const navigate = useNavigate();
  const params = useParams();
  const [sp] = useSearchParams();

  // vendorId는 path(/write-review/:vendorId) 또는 query(?vendorId=) 모두 지원
  const vendorId = useMemo(() => {
    const fromParam = params?.vendorId ? Number(params.vendorId) : undefined;
    const fromQuery = sp.get('vendorId') ? Number(sp.get('vendorId')) : undefined;
    return fromParam ?? fromQuery ?? 0;
  }, [params, sp]);

  const vendorName = sp.get('vendorName') || '업체 후기 작성';

  const [toast, setToast] = useState({ open: false, message: '' });
  const openToast = msg => setToast({ open: true, message: msg });
  const closeToast = () => setToast({ open: false, message: '' });

  /**
   * 템플릿 onSubmit 훅
   * form: { rating:number, types:string[], text:string, photos:[{url, file?}] }
   *
   * 서버 요구사항(포스트맨 기준):
   *  - multipart/form-data
   *  - JSON 파트: "request"
   *  - 파일 파트: "images" (0~N개)
   */
  const handleSubmit = async ({ rating, types, text, photos }) => {
    try {
      const [firstKey] = Array.isArray(types) ? types : [];
      const construct_category = CATEGORY_ENUM_BY_KEY[firstKey] ?? '기타';

      const safePhotos = Array.isArray(photos) ? photos : [];

      // 파일 수집 (input file 또는 dataURL → Blob 변환)
      const fileItems = safePhotos
        .map((p, idx) => {
          if (p?.file instanceof File) {
            // 한글/특수문자 파일명 이슈 방지: 안전한 이름으로 교체
            const orig = p.file;
            const ext = (orig.type && orig.type.split('/')[1]) || 'jpg';
            const safeName = `review_${Date.now()}_${idx}.${ext}`;
            return new File([orig], safeName, { type: orig.type });
          }
          if (typeof p?.url === 'string' && p.url.startsWith('data:')) {
            const blob = dataURLtoBlob(p.url);
            const ext = (blob.type && blob.type.split('/')[1]) || 'jpg';
            const safeName = `review_${Date.now()}_${idx}.${ext}`;
            return new File([blob], safeName, { type: blob.type });
          }
          return null;
        })
        .filter(Boolean);

      // 포스트맨 예시처럼 request JSON 구성 (URL 배열은 넣지 않아도 됨)
      const requestJson = {
        vendorId,
        construct_category,
        rate: Number(rating) || 0,
        review: (text || '').trim(),
        // review_image: []  ← (보내지 않음; 서버가 파일 파트로 처리)
      };

      // FormData 구성
      const fd = new FormData();
      // JSON 파트: "request"
      fd.append('request', new Blob([JSON.stringify(requestJson)], { type: 'application/json' }));
      // 파일 파트: "images" (포스트맨 캡처와 동일한 키)
      fileItems.forEach(file => {
        fd.append('images', file, file.name);
      });

      const res = await apiCreateReview(fd);
      if (!res.success) {
        openToast(res.message || '리뷰 작성에 실패했습니다.');
        return;
      }

      openToast('리뷰가 작성되었습니다.');
      setTimeout(() => navigate(-1), 500);
    } catch (e) {
      openToast('네트워크 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <WriteReviewTemplate vendorName={vendorName} onSubmit={handleSubmit} />
      <Toast open={toast.open} message={toast.message} onClose={closeToast} />
    </>
  );
}
