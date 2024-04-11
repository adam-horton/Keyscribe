import styled from 'styled-components';

export const colors = {
    dark_bg: '#5f758e',
    dark_hover: '#8da7c4',
    dark_txt: '#0E0F19',
    
    light_bg: '#e4f0ef',
    light_hover: '#97c2bf',
    light_txt: '#f1eded',
    
    med_bg: '#B8DBD9',
    grey_txt: '#4A4A4A'
};

export const NavBar = styled.div`
    width: 100%;
    height: 10%;
    background: ${colors.dark_bg};
    position: absolute;
    top: 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const Button = styled.button`
    outline: none;
    border: none;
    cursor: pointer;
    display: block;
    padding: 0.9rem 2.5rem;
    text-align: center;
    background-color: ${({bg}) => bg};
    color: ${({txt}) => txt};
    border-radius: 25px;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    font-size: 17px;
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

export const NavHeaderText = styled.h1`
    font-family: 'Marck Script', sans-serif;
    color: ${colors.light_txt};
    text-align: center;
    margin-bottom: 20px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
`;

export const Input = styled.input`
    font-family: inherit;
    width: 100%;
    outline: none;
    background-color: ${colors.light_txt};
    border-radius: 4px;
    border: none;
    display: block;
    padding: 0.9rem 0.7rem;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    font-size: 17px;
    color: ${colors.grey_txt};
    text-indent: ${({indent}) => indent};
`;

export const FormField = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    position: relative;
`;

export const Card = styled.div`
    margin: 0px;
    position: fixed;
    top: 50%;
    left: 50%;
    height: ${({h}) => h};
    width: ${({w}) => w};
    transform: translate(-50%, -50%);
    z-index: 1;
    background-color: ${({bg}) => bg};
    display: block;
    padding: 0.5%;
    padding-left: 2%;
    padding-right: 2%;
    border-radius: 10px;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    justify-content: center;
`;

export const CardButtonWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10%;
    padding: 1%;
`;