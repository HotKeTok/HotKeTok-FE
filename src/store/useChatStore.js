import { getChatroomDetail, getChatroomList } from '../api/chatting-service';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { create } from 'zustand';

// 채팅 및 웹소켓 전역 관리
const useChatStore = create((set, get) => ({
  // STOMP 클라이언트 인스턴스
  stompClient: null, // stompClient 인스턴스를 스토어에서 직접 관리
  isConnected: false, // 웹소켓 연결 상태

  // 채팅 관련 상태
  chatRooms: [], // 채팅방 목록
  currentRoomId: null, // 현재 들어와 있는 채팅방 ID
  messages: [], // 현재 채팅방의 메시지 목록
  subscription: null, // 현재 채팅방 구독 객체 (unsubscribe를 위해)

  // 초기 웹소켓 연결
  connect: accessToken => {
    // 이미 연결되어 있거나 client 객체가 있다면 중복 실행 방지
    if (get().isConnected || get().stompClient) {
      console.log('이미 웹소켓에 연결되어 있거나 연결 시도 중입니다.');
      return;
    }

    const client = new Client({
      // SockJS를 사용하면 앞에 ws:// 대신 http:// 또는 https:// 사용 가능
      webSocketFactory: () =>
        new SockJS(`${import.meta.env.VITE_BASE_URL}/ws-stomp`, null, {
          withCredentials: true,
        }),
      //   brokerURL: `ws://${import.meta.env.VITE_BASE_URL}/ws-stomp`,
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
      debug: str => console.log(new Date(), str),
      reconnectDelay: 10000,
      onConnect: () => {
        console.log('STOMP 연결 성공!');
        set({ isConnected: true });
      },
      onStompError: frame => {
        console.error('STOMP 오류:', frame.headers['message']);
      },
    });

    client.activate();
    set({ stompClient: client }); // 생성된 클라이언트 인스턴스를 상태에 저장
  },

  // 웹소켓 연결 해제
  disconnect: () => {
    const client = get().stompClient;
    if (client) {
      client.deactivate();
      console.log('STOMP 연결이 해제되었습니다.');
      // 모든 관련 상태를 초기화
      set({
        stompClient: null,
        isConnected: false,
        subscription: null,
        currentRoomId: null,
        messages: [],
      });
    }
  },

  // 채팅방 목록 가져오기
  fetchChatRooms: async accessToken => {
    const { success, data } = await getChatroomList(accessToken);
    if (success) {
      set({ chatRooms: data });
    }
  },

  // 특정 채팅방 입장
  enterChatRoom: async (accessToken, roomId) => {
    const client = get().stompClient;
    if (!client || !get().isConnected) {
      console.error('STOMP 클라이언트가 연결되지 않았습니다.');
      return;
    }

    get().subscription?.unsubscribe(); // 이전 구독 해제
    set({ currentRoomId: roomId, messages: [] });

    const { success, data } = await getChatroomDetail(accessToken, roomId);
    if (success) {
      set({ messages: data });
    }

    // 스토어에 저장된 client를 직접 사용
    const newSubscription = client.subscribe(`/sub/chat/room/${roomId}`, message => {
      const newMessage = JSON.parse(message.body);
      set(state => ({ messages: [...state.messages, newMessage] }));
    });
    set({ subscription: newSubscription });
  },

  // 채팅방 나가기 (상태 초기화)
  leaveChatRoom: () => {
    get().subscription?.unsubscribe();
    set({ currentRoomId: null, messages: [], subscription: null });
  },

  // 메시지 보내기
  sendMessage: payload => {
    const client = get().stompClient;
    if (client && get().isConnected) {
      // 스토어에 저장된 client를 직접 사용
      client.publish({
        destination: '/pub/chat/message',
        body: JSON.stringify(payload),
      });
    } else {
      console.error('STOMP 클라이언트가 연결되지 않아 메시지를 보낼 수 없습니다.');
    }
  },
}));

export default useChatStore;
