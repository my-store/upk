import {
  adminConfigSetUserInsertAutoActivate,
  setUserListMaxSearchDisplay,
  type UserConfigInterface,
  setUserListMaxLoadMore,
  setUserListMaxDisplay,
  setUserListShortByNew,
} from '../../../libs/redux/reducers/admin/admin.config.slice';
import type { RootState } from '../../../libs/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { createAdminConfig, getAdminConfig } from '.';
import './styles/admin.config.user.styles.main.scss';
import { useEffect } from 'react';

export function updateUserConfig(newConfig: any) {
  const oldConfig: any = getAdminConfig();
  createAdminConfig({
    ...oldConfig,
    user: {
      ...oldConfig.user,
      ...newConfig,
    },
  });
}

export default function AdminUserConfig() {
  const state = useSelector((state: RootState) => state.admin_config.user);
  const dispatch = useDispatch();

  function applyConfig() {
    const userConfig: UserConfigInterface = getAdminConfig('user');

    // List
    const { maxDisplay } = userConfig.list;
    dispatch(setUserListMaxDisplay(maxDisplay));
    // List > maxLoadMore
    const { maxLoadMore } = userConfig.list;
    dispatch(setUserListMaxLoadMore(maxLoadMore));
    // List > maxSearchDisplay
    const { maxSearchDisplay } = userConfig.list;
    dispatch(setUserListMaxSearchDisplay(maxSearchDisplay));
    // List > shortByNew
    const { shortByNew } = userConfig.list;
    dispatch(setUserListShortByNew(shortByNew));

    // Insert
    const { autoActivate } = userConfig.insert;
    dispatch(adminConfigSetUserInsertAutoActivate(autoActivate));
  }

  useEffect(() => {
    applyConfig();
  }, []);

  return (
    <div className="Admin-User-Config">
      <p className="Admin-User-Config-Title">User</p>
      {/* List */}
      <div className="Admin-User-Config-Data">
        <p className="Admin-User-Config-Data-Label">Tampilkan</p>
        <input
          type="number"
          // value={state.list.maxDisplay}
          defaultValue={state.list.maxDisplay}
          onChange={({ target }) => {
            dispatch(setUserListMaxDisplay(target.value));

            // User > list > maxDisplay | Update localstorage
            const userConfig: any = getAdminConfig('user');
            updateUserConfig({
              list: {
                ...userConfig.list,
                maxDisplay: parseInt(target.value),
              },
            });
          }}
        />
      </div>
      {/* List > loadMore */}
      <div className="Admin-User-Config-Data">
        <p className="Admin-User-Config-Data-Label">Tampilkan Selanjutnya</p>
        <input
          type="number"
          // value={state.list.maxLoadMore}
          defaultValue={state.list.maxLoadMore}
          onChange={({ target }) => {
            dispatch(setUserListMaxLoadMore(target.value));

            // User > list > maxLoadMore | Update localstorage
            const userConfig: any = getAdminConfig('user');
            updateUserConfig({
              list: {
                ...userConfig.list,
                maxLoadMore: parseInt(target.value),
              },
            });
          }}
        />
      </div>
      {/* List > maxSearchDisplay */}
      <div className="Admin-User-Config-Data">
        <p className="Admin-User-Config-Data-Label">
          Tampilkan Hasil Pencarian
        </p>
        <input
          type="number"
          // value={state.list.maxSearchDisplay}
          defaultValue={state.list.maxSearchDisplay}
          onChange={({ target }) => {
            dispatch(setUserListMaxSearchDisplay(target.value));

            // User > list > maxSearchDisplay | Update localstorage
            const userConfig: any = getAdminConfig('user');
            updateUserConfig({
              list: {
                ...userConfig.list,
                maxSearchDisplay: parseInt(target.value),
              },
            });
          }}
        />
      </div>

      {/* List > shortByNew */}
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

      {/* Input > autoActivate */}
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

      {/* Sample Config */}
    </div>
  );
}
