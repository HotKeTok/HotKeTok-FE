// 공통 성공 판별
export function isOk(d) {
  return d?.success === true || d?.status === 200 || d?.code === 'COMMON200';
}
