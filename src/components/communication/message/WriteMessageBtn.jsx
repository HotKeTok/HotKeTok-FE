import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { color, typo } from "../../../styles/tokens";

export default function WriteMessageBtn() {
    const navigation = useNavigate();

    const onClick = () => {
        // 쪽지 작성 페이지로 이동
        navigation('/message/write');
    }

  return (
    <Button onClick={onClick} variant="primary" fullWidth>
      쪽지 쓰기
    </Button>
  );
}

const Button = styled.div`
    curqsor: pointer;

    position: absolute;
    right: 30%;
    bottom: 30px;

    display: flex;
    width: 120px;
    height: 54px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    flex-shrink: 0;

    border-radius: 50px;
    ${typo('button1')};
    color: #fff;
    background-color: ${color('brand.primary')};
`