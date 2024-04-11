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
    justify-content: center;
    align-items: center;
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