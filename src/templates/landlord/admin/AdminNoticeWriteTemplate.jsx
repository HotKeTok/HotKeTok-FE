import TopBar from '../../../components/common/TopBar';
import { PageWithoutBottomBar } from '../../../styles/layout';
import styled from 'styled-components';
import { color, typo } from '../../../styles/tokens';
import CheckbtnFilled from '../../../assets/common/icon-check-filled.svg?react';
import CheckbtnNotFilled from '../../../assets/common/icon-check-not-filled.svg?react';
import Button from '../../../components/common/Button';
import ConfirmModal from '../../../components/common/ConfirmModal';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Admin Notice Write/Edit Template
 * @param {boolean} isEdit - 수정 모드 여부
 * @param {object} initialData - 수정 시 초기 데이터 { title, content, isFix }
 * @param {function} onSubmit - 작성/수정 완료 시 호출될 함수
 */
export default function AdminNoticeWriteTemplate({
  isEdit = false,
  initialData = { noticeId: null, title: '', content: '', isFix: false },
  onSubmit,
}) {
  const navigate = useNavigate();
  const [modal, setModal] = useState(false); // 확인 모달 상태 관리
  const [title, setTitle] = useState(''); // 제목
  const [content, setContent] = useState(''); // 내용
  const [isFix, setisFix] = useState(false); // 버튼 활성화의 기준

  useEffect(() => {
    if (isEdit) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setisFix(initialData.isFix);
    }
  }, [isEdit, initialData]);

  const isFormValid = title.trim() !== '' && content.trim() !== ''; // 공백 제거
  const isFormDirty = isEdit
    ? title !== initialData.title || content !== initialData.content || isFix !== initialData.isFix
    : title !== '' || content !== '' || isFix; // 버튼 활성화의 기준 (작성/수정에 따라 다름)

  const handleBackClick = () => {
    if (isFormDirty) {
      // 작성/수정된 값이 있을 때에만 모달
      setModal(true);
    } else {
      navigate(-1);
    }
  };

  const handleConfirmNavigateBack = () => {
    setModal(false);
    navigate(-1);
  };

  const handleSubmit = () => {
    if (isFormValid) {
      onSubmit({
        // 수정된 값만 전송
        ...(isEdit && { noticeId: parseInt(initialData.noticeId) }),
        ...(title !== initialData.title && { title }),
        ...(content !== initialData.content && { content }),
        ...(isFix !== initialData.isFix && { isFix }),
      });
    }
  };

  return (
    <PageWithoutBottomBar style={{ height: '100%' }}>
      <TopBar title={isEdit ? '공지 수정' : '공지 작성'} onBack={handleBackClick} />
      <Container>
        <Form>
          <Field>
            <FieldTitle>제목</FieldTitle>
            <Input
              placeholder="제목을 작성해주세요."
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={50}
            />
          </Field>
          <Field>
            <FieldTitle>내용</FieldTitle>
            <TextareaWrapper>
              <Textarea
                placeholder="내용을 작성해주세요."
                value={content}
                onChange={e => setContent(e.target.value)}
                maxLength={300}
              />
              <CharCounter>{content.length}/300</CharCounter>
            </TextareaWrapper>
          </Field>
          <CheckboxWrapper onClick={() => setisFix(!isFix)}>
            {isFix ? <CheckbtnFilled /> : <CheckbtnNotFilled />}
            <CheckboxLabel>
              <p>고정글로 게시</p>
              <span>공지가 상단에 고정돼요.</span>
            </CheckboxLabel>
          </CheckboxWrapper>
        </Form>
        <ButtonWrapper>
          <Button
            active={isFormDirty}
            text={`공지 ${isEdit ? '수정' : '작성'}하기`}
            onClick={handleSubmit}
          />
        </ButtonWrapper>
      </Container>
      <ConfirmModal
        isOpen={modal}
        title={`공지 ${isEdit ? '수정' : '작성'}을 그만두시겠어요?`}
        description="작성한 내용은 저장되지 않아요."
        onClose={() => setModal(false)}
        onConfirm={handleConfirmNavigateBack}
        cancelText="아니오"
        confirmText="그만두기"
      />
    </PageWithoutBottomBar>
  );
}

const Container = styled.div`
  width: 100%;
  height: calc(100% - var(--top-bar-h));
  padding: 0px 24px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FieldTitle = styled.div`
  color: ${color('grayscale.600')};
  ${typo('h3')};
`;

const Input = styled.input`
  width: 100%;
  padding: 13px 15px;
  background-color: ${color('grayscale.100')};
  border: 1px solid ${color('grayscale.300')};
  border-radius: 6px;
  ${typo('body1')};
  color: ${color('grayscale.800')};
  box-sizing: border-box;

  &::placeholder {
    color: ${color('grayscale.400')};
  }

  &:focus {
    outline: none;
    border-color: ${color('brand.primary')};
  }
`;

const TextareaWrapper = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Textarea = styled.textarea`
  width: 100%;
  height: 330px;
  padding: 13px 15px;

  background-color: ${color('grayscale.100')};
  border: 1px solid ${color('grayscale.300')};
  border-radius: 6px;

  resize: none;
  ${typo('body1')};
  color: ${color('grayscale.800')};
  box-sizing: border-box;

  &::placeholder {
    color: ${color('grayscale.400')};
  }

  &:focus {
    outline: none;
    border-color: ${color('brand.primary')};
  }
`;

const CharCounter = styled.div`
  align-content: flex-end;
  align-self: flex-end;

  ${typo('body2')};
  color: ${color('grayscale.400')};
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
`;

const CheckboxLabel = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;

  p {
    margin: 0;
    ${typo('h3')};
    color: ${color('grayscale.700')};
  }
  span {
    ${typo('body2')};
    color: ${color('grayscale.600')};
  }
`;

const ButtonWrapper = styled.div`
  width: 100%;
  padding-bottom: 16px;
`;
