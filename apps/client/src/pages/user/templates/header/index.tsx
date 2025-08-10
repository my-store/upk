import './styles/user.templates.header.styles.main.scss';
import type { CSSProperties } from 'react';

interface FooterProps {
  globalStyle: any;
}

export default function Header(props: FooterProps) {
  const { globalStyle } = props;

  // Navbar config
  const { navbarHeight } = globalStyle;

  // Colors
  const { primaryColor, secondaryColor } = globalStyle;

  const globalButtonStyle: CSSProperties = {
    backgroundColor: secondaryColor,
  };

  return (
    <header
      style={{
        backgroundColor: primaryColor,
        height: navbarHeight,
      }}
    >
      <h1>Permata Kasir</h1>
      <div className="links">
        <button style={globalButtonStyle}>Youtube</button>
        <button style={globalButtonStyle}>Facebook</button>
        <button style={globalButtonStyle}>WhatsApp</button>
        <button style={globalButtonStyle}>Instagram</button>
      </div>
    </header>
  );
}
