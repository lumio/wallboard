import styled from 'styled-components';

export const ScreenBuildWrapperStyled = styled.div`
  display: flex;
  flex: auto;
  justify-content: stretch;
  align-items: flex-start;
  flex-wrap: wrap;
  width: 100%;
  padding: 2em;

  &.loading {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 100%;
    height: 100vh;
    color: #555;
  }

  & > .SVGInline {
    height: 0;
    overflow: hidden;
  }
`;
