import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/common/Toast';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toastConfig, setToastConfig] = useState({
    message: '',
    show: false,
    icon: 'check', // 'check' (기본값) | 'warning'
    height: 'low', // 'low' (기본값) | 'high'
    duration: 2000, // 기본 2초
  });

  /**
   * 토스트를 띄우는 함수
   * @param {string} message - 표시할 메시지
   * @param {object} [options] - 토스트 옵션
   * @param {'check'|'warning'} [options.icon] - 아이콘 타입
   * @param {'low'|'high'} [options.height] - 토스트 높이
   * @param {number} [options.duration] - 토스트 지속 시간 (ms)
   */
  const showToast = useCallback((message, options = {}) => {
    setToastConfig({
      message: message,
      show: true,
      icon: options.icon || 'check',
      height: options.height || 'low',
      duration: options.duration || 2000,
    });
  }, []);

  // 4. Toast.jsx의 onClose prop에 연결할 함수
  //    애니메이션이 끝나면 show 상태를 false로 변경합니다.
  const handleClose = useCallback(() => {
    setToastConfig(current => ({ ...current, show: false }));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      <Toast
        message={toastConfig.message}
        show={toastConfig.show}
        icon={toastConfig.icon}
        height={toastConfig.height}
        duration={toastConfig.duration}
        onClose={handleClose}
      />
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  // context의 값은 { showToast } 객체입니다.
  return context.showToast;
}
