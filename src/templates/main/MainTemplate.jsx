import PageHeader from "../../components/common/PageHeader";
import styled from "styled-components";
import SelectHome from "../../components/main/index/SelectHome";
import AddressBox from "../../components/main/index/AddressBox";

export default function MainTemplate() {
  return (
    <Container>
      <PageHeader leftComponent={<SelectHome homeTitle="우리집" />}/>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;

  padding: 0 13px;
`
