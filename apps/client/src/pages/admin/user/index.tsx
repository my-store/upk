import { adminUserListSetListData } from '../../../libs/redux/reducers/admin/admin.user.list.slice';
import { getLoginCredentials, refreshToken } from '../../../libs/credentials';
import type { RootState } from '../../../libs/redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { JSONGet } from '../../../libs/requests';
import { useEffect } from 'react';

export default function AdminUserList() {
  const state = useSelector((state: RootState) => state.admin_user_list);
  const dispatch = useDispatch();

  async function load() {
    const { access_token, data } = getLoginCredentials();

    const req = await JSONGet('/api/user', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    // Token expired
    if (req.message) {
      // Refresh login token
      await refreshToken(data.tlp);

      // Re-call this function
      return load();
    }

    dispatch(adminUserListSetListData(req));
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="Admin-User-List">
      <h1>Admin / User List</h1>

      <div className="Admin-User-List-Body">
        {state.data.map((d, dx) => (
          <div
            key={d.id + dx.toString()}
            className="Admin-User-List-Item-Container"
          >
            <div className="Admin-User-List-Item">
              <p className="Admin-Name">{d.nama}</p>
              <p className="Admin-Phone">{d.tlp}</p>
            </div>
          </div>
        ))}

        {/* Still Empty */}
        {state.data.length < 1 && (
          <p className="Admin-User-List-Empty">Kosong</p>
        )}
      </div>
    </div>
  );
}
