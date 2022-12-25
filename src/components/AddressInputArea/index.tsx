import styled from 'styled-components'

const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.input};
  border: 1px solid ${({ theme }) => theme.colors.inputSecondary};
  padding: 10px 16px;
  border-radius: 16px;
  height: 64px;
`

const Textarea = styled.textarea`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.input};
  color: ${({ theme }) => theme.colors.text};
  padding: 0;
  border: none;
  outline: none;
  font-size: 16px;
  line-height: 20px;
  resize: none;
  &::-webkit-scrollbar {
    display: none;
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.backgroundDisabled};
    box-shadow: none;
    color: ${({ theme }) => theme.colors.textDisabled};
    cursor: not-allowed;
  }
`

const AddressInputArea = ({ disabled, onChange }) => {
  return (
    <Wrapper>
      <Textarea spellCheck="false" rows={2} disabled={disabled} onChange={onChange} />
    </Wrapper>
  )
}

export default AddressInputArea
