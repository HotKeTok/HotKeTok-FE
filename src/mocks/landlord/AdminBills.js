export const EXAMPLE_BILLS_DATA = {
  year: 2024,
  month: 9,
  summary: {
    balance: 457000,
    income: 910000,
    expense: 453000,
  },
  transactions: [
    // 각각이 BillItem type
    {
      id: 1,
      title: 'KT12341234',
      date: '2024.9.11',
      amount: 352310,
      type: 'expense', // 출금
    },
    {
      id: 2,
      title: '504호',
      date: '2024.9.11',
      amount: 130000,
      type: 'income', // 입금
    },
    {
      id: 3,
      title: '503호',
      date: '2024.9.11',
      amount: 130000,
      type: 'income', // 입금
    },
    {
      id: 4,
      title: '502호',
      date: '2024.9.11',
      amount: 130000,
      type: 'income', // 입금
    },
    {
      id: 5,
      title: '501호',
      date: '2024.9.11',
      amount: 130000,
      type: 'income', // 입금
    },
    {
      id: 6,
      title: '승강기유지비',
      date: '2024.9.11',
      amount: 130000,
      type: 'expense', // 출금
    },
    {
      id: 7,
      title: '전기공사',
      date: '2024.9.11',
      amount: 77000,
      type: 'expense', // 출금
    },
    {
      id: 8,
      title: '제초작업',
      date: '2024.9.11',
      amount: 150000,
      type: 'expense', // 출금
    },
    {
      id: 9,
      title: '201호',
      date: '2024.9.10',
      amount: 130000,
      type: 'income', // 입금
    },
    {
      id: 10,
      title: '302호',
      date: '2024.9.10',
      amount: 130000,
      type: 'income', // 입금
    },
  ],
};
