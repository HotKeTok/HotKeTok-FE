import MegaphoneIcon from '../../assets/landlord/main/icon-megaphone.svg?react';
import AuthIcon from '../../assets/landlord/main/icon-auth.svg?react';
import BillsIcon from '../../assets/landlord/main/icon-clipboard.svg?react';
import RepairIcon from '../../assets/landlord/main/icon-drill.svg?react';

export const DASHBOARD_ITEMS = {
  notice: {
    text: '공지사항 작성',
    image: MegaphoneIcon,
    description: null,
    route: '/admin/notice/write',
    backgroundColor: 'rgba(60, 102, 255, 0.10)',
  },
  auth: {
    text: '입주민 인증',
    image: AuthIcon,
    description: null,
    route: '/admin/auth',
    backgroundColor: 'rgba(255, 63, 63, 0.10)',
  },
  bills: {
    text: '공동관리비 기록',
    image: BillsIcon,
    description: null,
    route: '/admin/common-bills',
    backgroundColor: 'rgba(1, 210, 129, 0.10)',
  },
  repair: {
    text: '진행 중인 뚝딱',
    image: RepairIcon,
    description: true,
    route: '/repair-progress',
    backgroundColor: 'rgba(253, 211, 3, 0.10)',
  },
};
