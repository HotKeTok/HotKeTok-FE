import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// STOMP 클라이언트 인스턴스를 저장할 변수
let stompClient = null;

// STOMP 클라이언트 생성 및 연결 함수
export const connectWebSocket = accessToken => {
  if (stompClient && stompClient.active) {
    console.log('이미 웹소켓에 연결되어 있습니다.');
    return;
  }

  // Client 객체 생성
  stompClient = new Client({
    // SockJS를 사용한 WebSocket 연결 주소
    webSocketFactory: () => new SockJS(`ws://${import.meta.env.VITE_API_BASE_URL}/ws-stomp`),

    // 연결 헤더에 인증 토큰 추가
    connectHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },

    // 디버그 메시지 콘솔 출력
    debug: str => {
      console.log(new Date(), str);
    },

    // 10초마다 재연결 시도
    reconnectDelay: 10000,

    // 연결 성공 시 콜백
    onConnect: frame => {
      console.log('STOMP 연결 성공:', frame);
      // 연결 성공 후 필요한 초기 구독 로직을 여기에 추가할 수 있습니다.
      // 예: 전체 알림 채널 구독
      // stompClient.subscribe('/sub/user/notifications', (message) => { ... });
    },

    // 연결 오류 시 콜백
    onStompError: frame => {
      console.error('STOMP 오류:', frame.headers['message']);
      console.error('오류 상세:', frame.body);
    },
  });

  // 클라이언트 활성화 (연결 시작)
  stompClient.activate();
};

// 웹소켓 연결 끊기
export const disconnectWebSocket = () => {
  if (stompClient) {
    stompClient.deactivate();
    stompClient = null;
    console.log('웹소켓 연결이 끊어졌습니다.');
  }
};

// 특정 채널 구독
// 특정 채널 구독 (수정된 버전)
// callback: 메시지를 수신했을 때 실행될 함수
export const subscribeToChannel = (roomId, callback) => {
  const channel = `/sub/chat/room/${roomId}`;

  if (stompClient && stompClient.active) {
    console.log(`구독 시작: ${channel}`);
    return stompClient.subscribe(channel, message => {
      // 수신된 메시지 body는 JSON 문자열이므로 파싱해서 사용
      const parsedMessage = JSON.parse(message.body);
      callback(parsedMessage);
    });
  } else {
    console.error('STOMP 클라이언트가 연결되지 않았습니다.');
    return null;
  }
};

// 메시지 발신 (발행)
// payload: 서버로 보낼 메시지 데이터 객체
export const publishMessage = (destination, payload) => {
  if (stompClient && stompClient.active) {
    stompClient.publish({
      destination: destination,
      body: JSON.stringify(payload), // 객체를 JSON 문자열로 변환하여 전송
    });
  } else {
    console.error('STOMP 클라이언트가 연결되지 않았습니다.');
  }
};

// stompClient 인스턴스를 직접 사용해야 할 경우를 위해 export
export const getStompClient = () => stompClient;
