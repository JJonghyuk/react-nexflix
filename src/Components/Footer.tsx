import styled from "styled-components";

const FooterWrapper = styled.footer`
  font-size: 14px;
  background-color: #000;
  color: #fff;
  padding-bottom: 20px;
  text-align: center;
`;

function Footer() {
  return (
    <>
      <FooterWrapper>
        <p>COPYRIGHT Park JongHyuk. ALL RIGHTS RESERVED.</p>
      </FooterWrapper>
    </>
  );
}

export default Footer;
