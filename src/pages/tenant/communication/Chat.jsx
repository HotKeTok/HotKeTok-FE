import ChatTemplate from '../../../templates/common/chat/ChatTemplate';
import { useState, useEffect } from 'react';
import { getChatroomList } from '../../../api/chatting-service';
import { useAuthStore } from '../../../store/useAuthStore';
import { postNewChatroom, deleteChatroom } from '../../../api/chatting-service';
import ConfirmModal from '../../../components/common/ConfirmModal';
import Toast from '../../../components/common/Toast';

// 입주민 채팅 메인 페이지
export default function Chat() {
  const { accessToken, role } = useAuthStore();
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true); // todo: 초기값을 true로 설정

  const [deleteChatroomModal, setDeleteChatroomModal] = useState(null); // 선택된 채팅방 정보를 저장, 모달 안 띄우면 null
  const [toast, setToast] = useState({ open: false, message: '' });

  const openToast = message => setToast({ open: true, message });
  const closeToast = () => setToast({ open: false, message: '' });

  // 임시 (데모) 채팅방 생성 함수
  const postDemoChatroom = async () => {
    if (!accessToken) return;

    const payload = {
      participantUserIds: [13, 15, 38],
      roomType: 'GENERAL',
    };
    await postNewChatroom(accessToken, payload);
    openToast('채팅방이 생성되었어요.');
  };

  const fetchDeleteChatroom = async roomId => {
    try {
      if (!accessToken) return;

      const success = await deleteChatroom(accessToken, roomId);
      if (success) openToast('채팅방이 삭제되었어요.');
      else openToast('채팅방 삭제에 실패했어요.');
    } catch (err) {
      console.error('채팅방 삭제 중 오류 발생:', err);
    }
  };

  useEffect(() => {
    const fetchRooms = async () => {
      if (!accessToken) return;

      setLoading(true);
      const { success, data } = await getChatroomList(accessToken);

      if (success) {
        // 집주인(landlord)과의 채팅을 가장 위로 올린다.
        const sortedData = [...data].sort((a, b) => {
          const isALandlord = a.participants.some(p => p.senderType === 'VENDOR');
          const isBLandlord = b.participants.some(p => p.senderType === 'VENDOR');
          if (isALandlord) return -1; // a가 집주인이면 위로
          if (isBLandlord) return 1; // b가 집주인이면 위로
          return 0;
        });

        // 내가 보낸 메시지인지 확인하기 위해 'isMe' 속성 추가
        const processedData = sortedData.map(room => ({
          ...room,
          participants: room.participants.map(p => ({
            ...p,
            // isMe: p.userId === user.id,
            isMe: true, // todo(이후 삭제)
          })),
        }));

        setChatRooms(processedData);
      }
      setLoading(false);
    };

    fetchRooms();
    // postDemoChatroom();
  }, [accessToken]);

  const handleOpenDeleteModal = (roomId, roomName) => {
    setDeleteChatroomModal({ id: roomId, name: roomName });
  };

  const handleCloseDeleteModal = () => {
    setDeleteChatroomModal(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteChatroomModal) return;

    setChatRooms(prevRooms => prevRooms.filter(room => room.roomId !== deleteChatroomModal.id));

    fetchDeleteChatroom(deleteChatroomModal.id);
    handleCloseDeleteModal(); // 처리가 끝나면 모달을 닫는다.
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
      <ChatTemplate chatRooms={chatRooms} onDelete={handleOpenDeleteModal} />
      <ConfirmModal
        isOpen={!!deleteChatroomModal}
        title={`${deleteChatroomModal?.name}`}
        description="채팅방을 삭제하시겠어요?"
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        confirmText="삭제하기"
      />
      <Toast show={toast.open} onClose={closeToast} message={toast.message} duration={1000} />
    </>
  );
}
