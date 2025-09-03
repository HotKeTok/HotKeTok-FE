import TextField from '../components/common/TextField';
import RepairBanner from '../components/Repair/RepairBanner';

export default function RepairTemplate() {
  return (
    <>
      <h1>뚝딱뚜깍</h1>
      <div style={{ padding: '15px' }}>
        <RepairBanner />
      </div>
      <TextField placeholder="입력하시요" state="error" />
    </>
  );
}
