import styled from 'styled-components';
import { colors } from '../../App.styled';

export const WelcomeWrapper = styled.div`
    width: 100vw;
    height: 100vh;
    background: ${colors.light_bg};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

export const UserWrapper = styled.div`
    width: 40%;
    height: 25%;
    position: absolute;
    top: 12%;
`;

export const ButtonWrapper = styled.div`
    width: 50%;
    height: 20%;
    background: ${colors.light_bg};
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;