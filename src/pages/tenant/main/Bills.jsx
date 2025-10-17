import BillsTemplate from '../../../templates/tenant/main/BillsTemplate';
import { useEffect, useState } from 'react';

export default function Bills() {
  const [activeTab, setActiveTab] = useState('공과금'); // '공과금' | '공동 관리비'

  useEffect(() => {
    const fetchCommonBills = async () => {
      try {
        if (activeTab === '공동 관리비') {
          // const response =
        }
      } catch (err) {
        console.error(err);
      }
    };
  }, [activeTab]);

  return <BillsTemplate activeTab={activeTab} setActiveTab={setActiveTab} />;
}
