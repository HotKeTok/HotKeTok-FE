import HomeTemplate from "../templates/HomeTemplate";

export default function Home() {
    // template, page 분리 예시

    // state 관리, useEffect 등의 훅 사용

    // 데이터 패칭 (API 호출)
  const featureData = [
    {
      label: "title1",
      description: "description",
    },
    {
      label: "title2",
      description: "description",
    },
  ];

  // core logic(api, update state, ...)
  const handleAction = () => {
    alert("click");
  };

    return (
       <HomeTemplate featureData={featureData} onAction={handleAction} />
    );
}
