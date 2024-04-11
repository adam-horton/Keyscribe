import styled from 'styled-components';
import { colors } from '../../App.styled';

export const WelcomeWrapper = styled.div`
    width: 100vw;
    height: 100vh;
    background: ${colors.light_bg};
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const UserWrapper = styled.div`
    width: 40%;
    height: 25%;
    position: absolute;
    top: 12%;
`;