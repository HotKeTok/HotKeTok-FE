import MegaphoneIcon from '../../assets/landlord/main/icon-megaphone.svg?react';
import AuthIcon from '../../assets/landlord/main/icon-auth.svg?react';
import BillsIcon from '../../assets/landlord/main/icon-clipboard.svg?react';
import TenantsIcon from '../../assets/landlord/main/icon-tenants.svg?react';

export const DASHBOARD_ITEMS = {
  bills: {
    key: 1,
    text: '공동관리비 기록',
    image: BillsIcon,
    description: null,
    route: '/admin/common-bills/write',
    background: '#E6F1FD',
  },
  notice: {
    key: 2,
    text: '공지사항 작성',
    image: MegaphoneIcon,
    description: null,
    route: '/notice/write',
    background: '#EDEEFC',
  },
  auth: {
    key: 3,
    text: '입주민 인증',
    image: AuthIcon,
    description: true,
    route: '/admin/auth',
    backgroundColor: 'transparent',
    background: 'linear-gradient(125deg, #37E887 0%, #54C8C8 100%)',
  },
  tenantsInfo: {
    key: 4,
    text: '입주민 목록',
    image: TenantsIcon,
    description: null,
    route: '/admin/tenants',
    background: '#FBFBE6',
  },
  repair: {
    key: 5,
    text: '공동관리비 현황',
    image: BillsIcon,
    description: null,
    route: '/admin/common-bills',
    background: 'rgba(1, 210, 129, 0.10)',
  },
};

export const MAIN_DASHBOARD_ITEMS = [1, 2, 3, 4];
export const ADMIN_DASHBOARD_ITEMS = [5];
