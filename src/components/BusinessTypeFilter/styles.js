import styled, { css } from 'styled-components'

export const TypeContainer = styled.div`
  display: flex;
  width: 100%;
  overflow-x: auto;
  justify-content: center;
  div.category {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
  }

`

export const ImageContainer = styled.div`
  width: 150px;
    img{
      border-radius: 50%;
      width: 100%;
      border: 1px solid transparent;
      padding: 4px 2px 0px 2px;
    }
     ${({ active }) => active && css`
      img {
        border-color: red;
      }
  `}
`
