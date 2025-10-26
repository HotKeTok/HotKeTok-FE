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
    const { data } = await client.post(
      '/estimate-service/matching',
      { estimateId },
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

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
