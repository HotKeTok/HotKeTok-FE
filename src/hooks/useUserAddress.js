import { useState, useEffect, useCallback } from 'react'; // 1. useCallback 추가
import { getAddressList as apiGetAddressList } from '../api/house-service';
import { changeCurrentAddress } from '../api/user-service';
import { useAuthStore } from '../store/useAuthStore';

export default function useUserAddress() {
  const accessToken = useAuthStore(state => state.accessToken);
  const [loading, setLoading] = useState(false);
  const [addressList, setAddressList] = useState([]);

  const loadAddressList = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiGetAddressList();
      if (response.success) {
        const filteredAddress = response.data.filter(item => item.state !== 'NONE');
        setAddressList(filteredAddress);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAddress = useCallback(
    async (newAddress, newNumber) => {
      const { data } = await changeCurrentAddress(accessToken, {
        currentAddress: newAddress,
        currentNumber: newNumber || '',
      });

      // 주소 변경 성공 시, 자동으로 목록을 다시 불러옴
      if (data.success) {
        await loadAddressList();
      }

      return data.success;
    },
    [accessToken, loadAddressList]
  );

  useEffect(() => {
    loadAddressList();
  }, [loadAddressList]);

  return {
    loading,
    addressList,
    updateAddress,
    refetchAddressList: loadAddressList,
  };
}
