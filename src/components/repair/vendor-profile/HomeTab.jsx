// src/components/repair/vendor-profile/HomeTab.jsx
import React from 'react';
import { Row, Column } from '../../../styles/flex';
import { TabBody, Card, CardTitle, CardBody, Icon, IconInfo } from './Styles';

import iconClock from '../../../assets/repair/icon-clock.svg';
import iconPhone from '../../../assets/repair/icon-phone.svg';
import iconBookmark from '../../../assets/repair/icon-bookmark.svg';
import iconAddress from '../../../assets/repair/icon-address.svg';

export default function HomeTab({ vendor }) {
  return (
    <TabBody>
      <Card>
        <CardTitle>소개</CardTitle>
        <CardBody>{vendor.intro}</CardBody>
      </Card>
      <div style={{ padding: '22px 4px' }}>
        <Column $gap={12}>
          {vendor.contact.hours ? (
            <Row $gap={10}>
              <Icon src={iconClock} />

              <IconInfo> {vendor.contact.hours} </IconInfo>
            </Row>
          ) : null}
          {vendor.contact.phone ? (
            <Row $gap={10}>
              <Icon src={iconPhone} />
              <IconInfo>{vendor.contact.phone}</IconInfo>
            </Row>
          ) : null}
          <Row $gap={10}>
            <Icon src={iconBookmark} />
            <IconInfo>{vendor.categories.join('/')}</IconInfo>
          </Row>
          <Row $gap={10}>
            <Icon src={iconAddress} />
            <IconInfo>{vendor.contact.address}</IconInfo>
          </Row>
        </Column>
      </div>
    </TabBody>
  );
}
