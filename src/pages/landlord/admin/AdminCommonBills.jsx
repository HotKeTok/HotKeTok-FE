import AdminCommonBillsTemplate from '../../../templates/landlord/admin/AdminCommonBillsTemplate';
import { useEffect, useState } from 'react';
import { EXAMPLE_BILLS_DATA } from '../../../mocks/landlord/AdminBills';

export default function AdminCommonBills() {
  const [billsList, setBillsList] = useState(EXAMPLE_BILLS_DATA);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  // TODO: 년/월에 맞는 공동 관리비 내역 불러오기
  const fetchBillsData = async (year, month) => {
    // API 호출 로직 구현
    // const response = await fetch(`/api/bills?year=${year}&month=${month}`);
    // const data = await response.json();
    // setBillsList(data);
  };

  useEffect(() => {
    fetchBillsData(year, month);
  }, [year, month]);

  return (
    <AdminCommonBillsTemplate
      billsList={billsList}
      year={year}
      month={month}
      setYear={setYear}
      setMonth={setMonth}
    />
  );
}
