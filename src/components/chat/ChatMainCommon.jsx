import { useState, useEffect } from 'react';
import { getChatroomList, postNewChatroom, deleteChatroom } from '../../api/chatting-service';
import { useAuthStore } from '../../store/useAuthStore';
import ConfirmModal from '../../components/common/ConfirmModal';
import ChatTemplate from '../../templates/common/chat/ChatTemplate';

// 공통 채팅 목록 페이지
export default function ChatMainCommon() {
  const { accessToken, role, userId } = useAuthStore();
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteChatroomModal, setDeleteChatroomModal] = useState(null);
  const [toast, setToast] = useState({ open: false, message: '' });

  const openToast = message => setToast({ open: true, message });
  const closeToast = () => setToast({ open: false, message: '' });

  // 임시 (데모) 채팅방 생성 함수
  const postDemoChatroom = async () => {
    if (!accessToken) return;
    const payload = {
      participantUserIds: [16, 15],
      roomType: 'GENERAL',
    };
    const response = await postNewChatroom(accessToken, payload);
    if (response) openToast('채팅방이 생성되었어요.');
  };

  useEffect(() => {
    const fetchRooms = async () => {
      if (!accessToken) return;

      try {
        setLoading(true);
        const { success, data } = await getChatroomList(accessToken);

        if (success) {
          let processedData = data; // 원본 데이터

          if (role === 'tenant') {
            // 입주민일 경우: VENDOR(집주인) 채팅방을 상단으로 정렬
            processedData = [...data].sort((a, b) => {
              const isALandlord = a.participants.some(p => p.senderType === 'VENDOR');
              const isBLandlord = b.participants.some(p => p.senderType === 'VENDOR');
              if (isALandlord) return -1; // a가 집주인이면 위로
              if (isBLandlord) return 1; // b가 집주인이면 위로
              return 0;
            });
          }

          processedData = processedData.map(room => ({
            ...room,
            participants: room.participants.map(p => ({
              ...p,
              isMe: p.userId === userId, // 'isMe' 속성 추가
            })),
          }));

          setChatRooms(processedData);
        }
      } catch (err) {
        console.error('채팅방 목록 조회 중 오류 발생:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
    // postDemoChatroom(); // 임시: 데모 채팅방 생성
  }, [accessToken, userId, role]);

  const handleOpenDeleteModal = (roomId, roomName) => {
    setDeleteChatroomModal({ id: roomId, name: roomName });
  };

  const handleCloseDeleteModal = () => {
    setDeleteChatroomModal(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteChatroomModal) return;

    try {
      if (!accessToken) return;

      const success = await deleteChatroom(accessToken, deleteChatroomModal.id);

      if (success.success) {
        setChatRooms(prevRooms => prevRooms.filter(room => room.roomId !== deleteChatroomModal.id));
        openToast('채팅방이 삭제되었어요.');
      } else {
        openToast('채팅방 삭제에 실패했어요.');
      }
    } catch (err) {
      console.error('채팅방 삭제 중 오류 발생:', err);
      openToast('채팅방 삭제 중 오류가 발생했습니다.');
    } finally {
      handleCloseDeleteModal();
    }
  };

  if (loading)
    return (
      <div
        style={{
          flex: 1,
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <span className="loader">채팅 내용을 불러오고 있습니다...</span>
      </div>
    );

  return (
    <>
      <ChatTemplate
        chatRooms={chatRooms}
        onDelete={handleOpenDeleteModal}
        toast={toast}
        closeToast={closeToast}
      />
      <ConfirmModal
        isOpen={!!deleteChatroomModal}
        title={`${deleteChatroomModal?.name}`}
        description="채팅방을 삭제하시겠어요?"
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        confirmText="삭제하기"
      />
    </>
  );
}
