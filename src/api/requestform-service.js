// src/api/requestform-service.js
import client from './client';

// POST : 요청서 작성
export async function apiCreateRequestFormMultipart(accessToken, payload, imageFiles = []) {
  const fd = new FormData();

  // ✅ data 파트는 반드시 application/json 으로!
  fd.append('data', new Blob([JSON.stringify(payload)], { type: 'application/json' }));

  // ✅ images 파트는 파일마다 반복 append
  imageFiles.forEach(file => fd.append('images', file));

  // 디버깅용: 실제 들어가는 값 확인
  // for (const [k, v] of fd.entries()) console.log(k, v instanceof File ? v.name : v);

  const { data } = await client.post('/requestform-service/create', fd, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      // ❗ 중요: Content-Type 직접 지정하지 말 것 (axios가 boundary 포함해 자동 설정)
      'Content-Type': undefined,
    },
    // (선택) axios가 data 변형하지 않게
    transformRequest: x => x,
  });

  const success = data?.success === true || data?.status === 200 || data?.code === 'COMMON200';
  return {
    success,
    status: data?.status ?? 200,
    data: data?.data ?? null,
    message: data?.message ?? '',
    raw: data,
  };
}

// GET: 진행 중인 요청서 조회
export async function apiGetInProgressRepairs(accessToken) {
  try {
    const { data } = await client.get('/requestform-service/in-progress', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const success = data?.success === true || data?.status === 200 || data?.code === 'COMMON200';

    return {
      success,
      data: data?.data ?? null,
      message: data?.message ?? '',
    };
  } catch (e) {
    console.error('[apiGetInProgressRepairs] Error:', e);
    return { success: false, message: e?.response?.data?.message || e.message };
  }
}

// POST: 요청서 AI 작성
export async function apiGenerateRepairText(accessToken, images = []) {
  if (!images || images.length === 0) {
    return { success: false, message: '이미지 파일이 없습니다.' };
  }

  const fd = new FormData();
  images.forEach(file => fd.append('images', file)); // ✅ 여러 장

  try {
    const { data } = await client.post('/requestform-service/gpt-service', fd, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // ❗ 중요: undefined로 둬야 axios가 boundary 포함해 자동 지정
        'Content-Type': undefined,
      },
      transformRequest: x => x, // axios가 FormData를 건드리지 않게
    });

    const success = data?.success === true || data?.status === 200 || data?.code === 'COMMON200';

    return { success, data: data?.data ?? null, message: data?.message ?? '' };
  } catch (e) {
    console.error('[apiGenerateRepairText] Error:', e);
    return { success: false, message: e?.response?.data?.message || e.message };
  }
}
