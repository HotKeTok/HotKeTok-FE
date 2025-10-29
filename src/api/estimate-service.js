// src/api/estimate-service.js
import client from './client';

/** 견적서 목록 조회
 * GET /estimate-service/list?requestFormId=ID
 * Auth: Bearer 토큰
 */
export async function apiGetEstimateList(accessToken, requestFormId) {
  try {
    const { data } = await client.get('/estimate-service/list', {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { requestFormId },
    });

    const success = data?.success === true || data?.status === 200 || data?.code === 'COMMON200';

    return {
      success,
      data: data?.data ?? [],
      message: data?.message ?? '',
    };
  } catch (e) {
    console.error('[apiGetEstimateList] Error:', e);
    return { success: false, data: [], message: e?.response?.data?.message || e.message };
  }
}

/** 견적서 선택(매칭)
 * POST /estimate-service/matching
 * body: { estimateId }
 * Auth: Bearer 토큰
 */
export async function apiSelectEstimate(accessToken, estimateId) {
  try {
    const { data } = await client.post('/estimate-service/matching', null, {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { estimateId },
    });

    const success = data?.success === true || data?.status === 200 || data?.code === 'COMMON200';

    return {
      success,
      data: data?.data ?? null,
      message: data?.message ?? '',
    };
  } catch (e) {
    console.error('[apiSelectEstimate] Error:', e);
    return { success: false, data: null, message: e?.response?.data?.message || e.message };
  }
}

// 선택한 견적서
export async function apiGetEstimateInfo(accessToken, estimateId) {
  try {
    const { data } = await client.get('/estimate-service/info', {
      headers: { Authorization: `Bearer ${accessToken}` },
      params: { estimateId },
    });
    const success = data?.isSuccess === true || data?.status === 200 || data?.code === 'COMMON200';
    return {
      success,
      data: data?.data ?? null,
      message: data?.message ?? '',
    };
  } catch (e) {
    console.error('[apiGetEstimateInfo] Error:', e);
    return { success: false, data: null, message: e?.response?.data?.message || e.message };
  }
}

//http://localhost:5173/repair-progress?id=4
