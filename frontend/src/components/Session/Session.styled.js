import styled from 'styled-components';
import { colors } from '../../App.styled';
import sheetMusic from '../../assets/sheet-music-example.png'

export const SessionWrapper = styled.div`
    width: 100vw;
    height: 100vh;
    background: ${colors.light_bg};
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const ColumnWrapper = styled.div`
    width: 30%;
    height: 70%;
    background: ${colors.light_bg};
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    top: 12%;
    left: 60%;

    &:before {
        position: absolute;
        left: -700px;
        top: 0px;
        color: #888888;
        content: " ";
        display: block;
        background-size: cover;
        background-repeat: no-repeat;
    }

    &:nth-child(2):before {
        background-image: url(${sheetMusic});
        width: 500px;
        height: 550px;
        top: 15px;
    }
`;

export const InfoWrapper = styled.div`
    border-radius: 25px;
    background: ${colors.med_bg};
    width: 100%;
    height: 40%;
    margin-bottom: 3%;
`;

export const ParticipantsWrapper = styled.div`
    border-radius: 25px;
    background: ${colors.med_bg};
    width: 100%;
    height: 30%;
    margin-bottom: 3%;
`;

export const LeaveContainer = styled.div`
    position: absolute;
    left: 85%;
    width: 14%;
`;

export const RedCircle = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 10px;
    background: red;
    margin-right: 5%;
`;

export const RecordWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
`;

export const Counter = styled.div`
    margin-right: 5%;
    color: ${colors.dark_txt};
`;

<div style={{ position: 'absolute', top: 150, left: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}></div>