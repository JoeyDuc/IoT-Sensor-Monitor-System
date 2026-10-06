import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import AppRoutes from './routes/AppRoutes';

dayjs.locale('vi');

export default function App() {
  return (
    <BrowserRouter>
      <ConfigProvider locale={viVN}>
        <AppRoutes />
      </ConfigProvider>
    </BrowserRouter>
  );
}
