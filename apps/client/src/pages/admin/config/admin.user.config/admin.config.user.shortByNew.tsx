import { setUserListShortByNew } from '../../../../libs/redux/reducers/admin/admin.config.slice';
import type { RootState } from '../../../../libs/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserConfig } from '.';
import { getAdminConfig } from '..';

export default function AdminUserShortByNewConfig() {
  const state = useSelector((state: RootState) => state.admin_config.user);
  const dispatch = useDispatch();

  return (
    <div className="Admin-User-Config-Data">
      <p className="Admin-User-Config-Data-Label">
        Tampilkan Dari Data Terbaru
      </p>
      <input
        type="checkbox"
        // defaultChecked={state.list.shortByNew}
        checked={state.list.shortByNew}
        onChange={({ target: { checked } }) => {
          dispatch(setUserListShortByNew(checked));

          // User > list > shortByNew | Update localstorage
          const userConfig: any = getAdminConfig('user');
          updateUserConfig({
            list: {
              ...userConfig.list,
              shortByNew: checked,
            },
          });
        }}
      />
    </div>
  );
}
