import { useState, useEffect } from 'react';
import { getAddressList as apiGetAddressList } from '../api/house-service';
import { changeCurrentAddress } from '../api/user-service';
import { useAuthStore } from '../store/useAuthStore';

// 사용자의 주소 리스트를 조회하고, 현재 주소를 수정할 수 있는 훅
// 집주인, 입주민 공용
export default function useUserAddress() {
  const accessToken = useAuthStore(state => state.accessToken);
  const [loading, setLoading] = useState(false);
  const [addressList, setAddressList] = useState([]);

  const loadAddressList = async () => {
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
  };

  const updateAddress = async (newAddress, newNumber) => {
    const { data } = await changeCurrentAddress(accessToken, {
      currentAddress: newAddress,
      currentNumber: newNumber || '',
    });
    return data.success;
  };

  useEffect(() => {
    loadAddressList();
  }, []);

  return {
    loading,
    addressList,
    updateAddress,
  };
}
