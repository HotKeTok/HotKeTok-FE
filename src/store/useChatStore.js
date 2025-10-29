import { getChatroomDetail, getChatroomList } from '../api/chatting-service';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { create } from 'zustand';
import { getAccessToken } from '../utils/auth';

// 채팅 및 웹소켓 전역 관리
const useChatStore = create((set, get) => ({
  // STOMP 클라이언트 인스턴스
  stompClient: null, // stompClient 인스턴스를 스토어에서 직접 관리
  isConnected: false, // 웹소켓 연결 상태 (true여야만 채팅방 구독 및 메시지 전송 가능)

  // 채팅 관련 상태
  chatRooms: [], // 채팅방 목록
  currentRoomId: null, // 현재 들어와 있는 채팅방 ID
  messages: [], // 현재 채팅방의 메시지 목록
  participants: [], // 현재 채팅방의 참가자 목록
  subscription: null, // 현재 채팅방 구독 객체 (unsubscribe를 위해)

  // 초기 웹소켓 연결
  connect: () => {
    if (get().isConnected || get().stompClient) {
      console.log('이미 웹소켓에 연결되어 있거나 연결 시도 중입니다.');
      return;
    }

    // if (import.meta.env.DEV && window.stompClient) {
    //   console.warn('HMR: 기존 STOMP 클라이언트를 재사용합니다.');
    //   set({ stompClient: window.stompClient, isConnected: window.stompClient.connected });
    //   return;
    // }

    const url = import.meta.env.VITE_BASE_URL;

    const client = new Client({
      webSocketFactory: () => new SockJS(`${url}/ws-stomp`),

      // 최신 토큰을 주입
      beforeConnect: () => {
        const accessToken = getAccessToken(); // 항상 최신 토큰을 가져옴
        if (!accessToken) {
          console.error('STOMP: 액세스 토큰이 없습니다. 연결을 시도하지 않습니다.');
        }
        // client 인스턴스에 직접 헤더 설정
        client.connectHeaders = {
          Authorization: `Bearer ${accessToken}`,
        };
      },

      debug: str => console.log(new Date(), str),
      reconnectDelay: 10000,

      onConnect: () => {
        console.log('✅ STOMP 연결 성공!');
        set({ isConnected: true });
      },
      onStompError: frame => {
        console.error('❌ STOMP 오류:', frame.headers['message']);
      },
    });

    client.activate();
    set({ stompClient: client });

    if (import.meta.env.DEV) {
      window.stompClient = client;
    }
  },

  // 웹소켓 연결 해제
  disconnect: () => {
    const client = get().stompClient;
    if (client) {
      client.deactivate();
      console.log('STOMP 연결이 해제되었습니다.');

      if (import.meta.env.DEV === 'development') {
        window.stompClient = null;
      }
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

  fetchChatRooms: async () => {
    const token = getAccessToken();
    if (!token) return;

    const { success, data } = await getChatroomList(token);
    const sortedData = data.sort((a, b) => {
      return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
    });
    if (success) {
      set({ chatRooms: sortedData });
    }
  },

  enterChatRoom: async roomId => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      console.error('채팅방 입장: 토큰이 없습니다.');
      return null;
    }

    const client = get().stompClient;
    if (!client || !get().isConnected) {
      console.error('STOMP 클라이언트가 연결되지 않았습니다.');
      return null;
    }

    get().subscription?.unsubscribe();
    set({ currentRoomId: roomId, messages: [] });

    // 채팅방 상세 정보 및 메시지 불러오기
    const { success, data } = await getChatroomDetail(accessToken, roomId);
    if (success) {
      set({ messages: data.messages, participants: data.participants });
    } else return null;

    console.log(`[Flow] STOMP 구독 시작 (주소: /topic/chat/room/${roomId})`); // 구독 시도 로그
    const newSubscription = client.subscribe(`/topic/chat/room/${roomId}`, message => {
      const newMessage = JSON.parse(message.body);

      set(state => ({ messages: [...state.messages, newMessage] }));
    });
    set({ subscription: newSubscription });

    return data;
  },

  // 채팅방 나가기 (상태 초기화)
  leaveChatRoom: () => {
    get().subscription?.unsubscribe();
    set({ currentRoomId: null, messages: [], subscription: null });
  },

  // 메시지 보내기
  sendMessage: (roomId, senderId, content) => {
    const client = get().stompClient;
    if (client && get().isConnected) {
      client.publish({
        destination: '/pub/chat/message',
        body: JSON.stringify({
          roomId,
          senderId,
          content,
        }),
      });
    } else {
      console.error('STOMP 클라이언트가 연결되지 않아 메시지를 보낼 수 없습니다.');
    }
  },
}));

export default useChatStore;
