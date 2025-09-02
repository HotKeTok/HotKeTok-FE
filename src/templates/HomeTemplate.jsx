import Button from "../components/common/Button";
import ButtonSmall from "../components/common/ButtonSmall";
import ButtonRound from "../components/common/ButtonRound";

export default function HomeTemplate({ featureData = [], onAction }) {
  return (
    <div style={{ padding: 24 }}>

      {/* 버튼 계열 - 최소 사용 예시 */}
      <section style={{ display: "grid", gap: 24, marginTop: 24 }}>
        {/* Button 기본/비활성/사이즈 */}
        <div>
          <h2 style={{ margin: "0 0 8px" }}>Button</h2>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Button text="이용 모드 선택하기" onClick={onAction} />
            <Button text="비활성" active={false} />
            <Button text="풀사이즈" onClick={onAction} fullSize />
            <Button text="240px" onClick={onAction} width={240} />
          </div>
        </div>

        {/* ButtonSmall 기본/비활성/width */}
        <div>
          <h2 style={{ margin: "0 0 8px" }}>ButtonSmall</h2>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <ButtonSmall text="기본" active onClick={onAction} />
            <ButtonSmall text="비활성" active={false} />
            <ButtonSmall text="full" width="full" active onClick={onAction} />
            <ButtonSmall text="160px" width={160} active onClick={onAction} />
          </div>
        </div>

        {/* ButtonRound 채움/비움/width */}
        <div>
          <h2 style={{ margin: "0 0 8px" }}>ButtonRound</h2>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <ButtonRound text="납부완료" width={'auto'} filled={false} />
            <ButtonRound text="납부하기" width={'auto'} filled onClick={onAction} />
          </div>
        </div>
      </section>
    </div>
  );
}
