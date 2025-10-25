import { useState, useEffect } from 'react';
import { getAddressList as apiGetAddressList } from '../api/house-service';
import { fetchCurrentAddress, changeCurrentAddress } from '../api/user-service';
import { useAuthStore } from '../store/useAuthStore';

// 사용자의 주소 리스트를 조회하고,
// 현재 주소를 수정할 수 있는 훅
export default function useUserAddress() {
  const accessToken = useAuthStore(state => state.accessToken);
  const [loading, setLoading] = useState(false);
  const [addressList, setAddressList] = useState([]);
  const [currentAddress, setCurrentAddress] = useState(null);

  const loadAddressList = async () => {
    try {
      const response = await apiGetAddressList();
      if (response.success) {
        const filteredAddress = response.data.filter(item => item.state !== 'NONE');
        setAddressList(filteredAddress);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const loadCurrentAddress = async () => {
    try {
      const { data } = await fetchCurrentAddress();
      if (data.success) {
        setCurrentAddress(data.data.currentAddress);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateAddress = async (newAddress, newNumber) => {
    const response = await changeCurrentAddress(accessToken, {
      currentAddress: newAddress,
      currentNumber: newNumber || '',
    });
    if (response.success) {
      setCurrentAddress(newAddress);
    }
    return response.success;
  };

  useEffect(() => {
    let mounted = true;
    const loadAll = async () => {
      setLoading(true);
      try {
        // 병렬로 요청 실행, 둘 다 완료되어야 다음으로 진행
        await Promise.all([loadAddressList(), loadCurrentAddress()]);
      } catch (error) {
        console.error(error);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    loadAll();
    return () => {
      mounted = false;
    };
  }, []);

  return {
    loading,
    addressList,
    currentAddress,
    updateAddress,
  };
}
