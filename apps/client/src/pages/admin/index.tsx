import { adminListSetListData } from '../../libs/redux/reducers/admin/admin.list.slice';
import { getLoginCredentials, refreshToken } from '../../libs/credentials';
import { rootRemoveLoading } from '../../libs/redux/reducers/root.slice';
import type { RootState } from '../../libs/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import AdminSidebar from './templates/sidebar';
import { JSONGet } from '../../libs/requests';
import AdminNavbar from './templates/navbar';
import AdminUserInsert from './user/insert';
import AdminUserList from './user';
import AdminInsert from './insert';
import './admin.styles.main.scss';
import { useEffect } from 'react';

export interface AdminGlobalStyleInterface {
  navbarHeight: number;
  sidebarWidth: number;
  primaryColor: string;
  secondaryColor: string;
}

const globalStyle: AdminGlobalStyleInterface = {
  navbarHeight: 35,
  sidebarWidth: 220,
  primaryColor: 'rgb(50, 101, 167)',
  secondaryColor: 'rgb(33, 76, 131)',
};

function AdminHome() {
  return <h1>Homepage for Admin</h1>;
}

function AdminList() {
  const state = useSelector((state: RootState) => state.admin_list);
  const dispatch = useDispatch();

  async function load() {
    const { access_token, data } = getLoginCredentials();

    const req = await JSONGet('/api/admin', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    // Token expired
    if (req.message) {
      // Refresh login token
      await refreshToken(data.tlp);

      // Re-call this function
      return load();
    }

    dispatch(adminListSetListData(req));
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="Admin-List">
      <h1>Admin List</h1>

      <div className="Admin-List-Body">
        {state.data.map((d, dx) => (
          <div key={d.id + dx.toString()} className="Admin-List-Item-Container">
            <div className="Admin-List-Item">
              <p className="Admin-Name">{d.nama}</p>
              <p className="Admin-Phone">{d.tlp}</p>
            </div>
          </div>
        ))}

        {/* Still Empty */}
        {state.data.length < 1 && <p className="Admin-List-Empty">Kosong</p>}
      </div>
    </div>
  );
}

function AdminGlobalTemplates({ children, socketConnect }: any) {
  const rootState = useSelector((state: RootState) => state.root);
  const dispatch = useDispatch();

  function socketListener() {}

  // When the page is loaded or refreshed
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

  return (
    <div
      className="Admin"
      style={{
        paddingTop: globalStyle.navbarHeight,
        paddingLeft: globalStyle.sidebarWidth,
      }}
    >
      <AdminNavbar globalStyle={globalStyle} />
      <AdminSidebar globalStyle={globalStyle} />
      {children}
    </div>
  );
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
    path: '/admin/admin',
    element: (props: any) => (
      <AdminGlobalTemplates {...props}>
        <AdminList />
      </AdminGlobalTemplates>
    ),
  },
  {
    path: '/admin/admin/insert',
    element: (props: any) => (
      <AdminGlobalTemplates {...props}>
        <AdminInsert />
      </AdminGlobalTemplates>
    ),
  },
  {
    path: '/admin/user',
    element: (props: any) => (
      <AdminGlobalTemplates {...props}>
        <AdminUserList />
      </AdminGlobalTemplates>
    ),
  },
  {
    path: '/admin/user/insert',
    element: (props: any) => (
      <AdminGlobalTemplates {...props}>
        <AdminUserInsert />
      </AdminGlobalTemplates>
    ),
  },
];

export default AdminRoutes;
