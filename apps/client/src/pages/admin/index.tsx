import { rootRemoveLoading } from '../../libs/redux/reducers/root.slice';
import type { RootState } from '../../libs/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import AdminInsert from './insert';
import './admin.styles.main.scss';
import { useEffect } from 'react';

function AdminHome() {
  return <h1>Homepage for Admin</h1>;
}

function AdminGlobalTemplates({ children, socketConnect }: any) {
  const rootState = useSelector((state: RootState) => state.root);
  const dispatch = useDispatch();

  function socketListener() {}

  async function load() {
    socketListener();

    // Remove loading animation after 3 second
    setTimeout(() => dispatch(rootRemoveLoading()), 3000);
  }

  useEffect(() => {
    // Connect to socket server, before any tasks
    socketConnect(load);
  }, []);

  // Invisible if still loading
  if (rootState.isLoading) return null;

  return children;
}

const AdminRoutes = [
  {
    path: '/admin',
    element: (props: any) => (
      <AdminGlobalTemplates {...props}>
        <AdminHome />
      </AdminGlobalTemplates>
    ),
  },
  {
    path: '/admin/insert',
    element: (props: any) => (
      <AdminGlobalTemplates {...props}>
        <AdminInsert />
      </AdminGlobalTemplates>
    ),
  },
];

export default AdminRoutes;
