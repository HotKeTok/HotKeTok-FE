// 검정 배경
import Tag_Sleeping from '../../../../assets/communication/message/tag/Tag_Sleeping_black.svg?react';
import Tag_Quiet from '../../../../assets/communication/message/tag/Tag_Quiet_black.svg?react';
import Tag_Noise from '../../../../assets/communication/message/tag/Tag_Noise_black.svg?react';
import Tag_Compliment from '../../../../assets/communication/message/tag/Tag_Compliment_black.svg?react';

// active
import Tag_Sleeping_active from '../../../../assets/communication/message/tag/Tag_Sleeping_active.svg?react';
import Tag_Quiet_active from '../../../../assets/communication/message/tag/Tag_Quiet_active.svg?react';
import Tag_Noise_active from '../../../../assets/communication/message/tag/Tag_Noise_active.svg?react';
import Tag_Compliment_active from '../../../../assets/communication/message/tag/Tag_Compliment_active.svg?react';

// disactive
import Tag_Sleeping_disactive from '../../../../assets/communication/message/tag/Tag_Sleeping_disactive.svg?react';
import Tag_Quiet_disactive from '../../../../assets/communication/message/tag/Tag_Quiet_disactive.svg?react';
import Tag_Noise_disactive from '../../../../assets/communication/message/tag/Tag_Noise_disactive.svg?react';
import Tag_Compliment_disactive from '../../../../assets/communication/message/tag/Tag_Compliment_disactive.svg?react';

export const TAG_ICONS = {
  Tag_Sleeping: Tag_Sleeping,
  Tag_Quiet: Tag_Quiet,
  Tag_Noise: Tag_Noise,
  Tag_Compliment: Tag_Compliment,
};

// 태그 데이터 배열
export const TAG_DATA = [
  {
    id: 'compliment',
    label: '칭찬',
    icon: Tag_Compliment_disactive,
    activeIcon: Tag_Compliment_active,
  },
  {
    id: 'sleeping',
    label: '수면',
    icon: Tag_Sleeping_disactive,
    activeIcon: Tag_Sleeping_active,
  },
  {
    id: 'quiet',
    label: '조용히',
    icon: Tag_Quiet_disactive,
    activeIcon: Tag_Quiet_active,
  },
  {
    id: 'noise',
    label: '소음',
    icon: Tag_Noise_disactive,
    activeIcon: Tag_Noise_active,
  },
];
