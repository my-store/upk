import { adminConfigSetUserInsertAutoActivate } from '../../../../libs/redux/reducers/admin/admin.config.slice';
import type { RootState } from '../../../../libs/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserConfig } from '.';
import { getAdminConfig } from '..';

export default function AdminUserInsertAutoActivateConfig() {
  const state = useSelector((state: RootState) => state.admin_config.user);
  const dispatch = useDispatch();

  return (
    <div className="Admin-User-Config-Data">
      <p className="Admin-User-Config-Data-Label">
        Input Data / Aktivasi Otomatis
      </p>
      <input
        type="checkbox"
        // defaultChecked={state.insert.autoActivate}
        checked={state.insert.autoActivate}
        onChange={({ target: { checked } }) => {
          dispatch(adminConfigSetUserInsertAutoActivate(checked));

          // User > insert > autoActivate | Update localstorage
          const userConfig: any = getAdminConfig('user');
          updateUserConfig({
            insert: {
              ...userConfig.insert,
              autoActivate: checked,
            },
          });
        }}
      />
    </div>
  );
}
