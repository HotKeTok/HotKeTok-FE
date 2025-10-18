export function getFixedNoticeList(noticeList = [], fixedCount = 0, totalCount = 4) {
  const fixedNotices = noticeList.filter(notice => notice.isFix);
  const regularNotices = noticeList.filter(notice => !notice.isFix);

  fixedNotices.sort((a, b) => new Date(b.date) - new Date(a.date));
  regularNotices.sort((a, b) => new Date(b.date) - new Date(a.date));

  const fixedNoticesLimited = fixedCount > 0 ? fixedNotices.slice(0, fixedCount) : fixedNotices;

  const remainingCount = totalCount - fixedNoticesLimited.length;

  if (remainingCount <= 0) {
    return fixedNoticesLimited.slice(0, totalCount);
  }

  return [...fixedNoticesLimited, ...regularNotices].slice(0, totalCount);
}
