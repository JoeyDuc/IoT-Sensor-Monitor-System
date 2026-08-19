import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import AppRoutes from './routes/AppRoutes';
import './styles/global.css';

const antdTheme = {
  token: {
    colorPrimary: '#7c3aed',
    colorLink: '#7c3aed',
    borderRadius: 10,
    fontFamily: "'Inter', -apple-system, sans-serif",
  },
};

export default function App() {
  return (
    <BrowserRouter>
      <ConfigProvider theme={antdTheme}>
        <AppRoutes />
      </ConfigProvider>
    </BrowserRouter>
  );
}
