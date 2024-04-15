import styled from 'styled-components';
import { colors } from '../../App.styled';

export const SettingsWrapper = styled.div`
    width: 100vw;
    height: 100vh;
    background: ${colors.light_bg};
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const ListWrapper = styled.div`
    border-radius: 25px;
    background: ${colors.med_bg};
    width: 18%;
    height: 50%;
    margin-left: 1%;
    margin-right: 1%;
    padding: 1%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top = 2%
`;

export const BoardNameWrapper = styled.div`
    border-radius: 25px;
    background: ${props => props.selected ? colors.light_bg : colors.med_bg};
    width: 70%;
    height: 8%;
    margin: 3% 1%;
    padding-top: 2%;

    &:hover {
        background: ${colors.light_bg};
    }
`;

export const FilesButton = styled.button`
    outline: none;
    border: none;
    cursor: pointer;
    display: block;
    padding: 0.5rem 1rem;
    text-align: center;
    background-color: ${({bg}) => bg};
    color: ${({txt}) => txt};
    border-radius: 25px;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    font-size: 10px;
    margin-right: 1%;
    margin-left: 1%;
    margin-top: ${({top}) => top};
    
    &:not(:disabled):hover {
        background-color: ${({hbg}) => hbg};
        scale: 101%;
    }

    &:disabled:hover {
        cursor: not-allowed;
    }
`;