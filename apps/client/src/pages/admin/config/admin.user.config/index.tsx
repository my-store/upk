import {
  adminConfigSetUserInsertAutoActivate,
  setUserListMaxSearchDisplay,
  type UserConfigInterface,
  setUserListMaxLoadMore,
  setUserListMaxDisplay,
  setUserListShortByNew,
  setUserListDisplay,
  setUserListReady,
} from '../../../../libs/redux/reducers/admin/admin.config.slice';
import AdminUserInsertAutoActivateConfig from './admin.config.user.insert.autoActivate';
import AdminUserMaxSearchDisplayConfig from './admin.config.user.maxSearchDisplay';
import AdminUserShortByNewConfig from './admin.config.user.shortByNew';
import AdminUserMaxDisplayConfig from './admin.config.user.maxDisplay';
import AdminUserLoadMoreConfig from './admin.config.user.loadMore';
import AdminUserDisplayConfig from './admin.config.user.display';
import type { RootState } from '../../../../libs/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { createAdminConfig, getAdminConfig } from '../';
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

    // List > display
    const { display } = userConfig.list;
    dispatch(setUserListDisplay(display));
    // List > maxDisplay
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

    // Set ready state
    dispatch(setUserListReady(true));
  }

  useEffect(() => {
    applyConfig();
  }, []);

  // Make sure everythings ready
  if (!state.list.ready) return null;

  return (
    <div className="Admin-User-Config">
      <AdminUserDisplayConfig />
      <AdminUserMaxDisplayConfig />
      <AdminUserLoadMoreConfig />
      <AdminUserMaxSearchDisplayConfig />
      <AdminUserShortByNewConfig />
      <AdminUserInsertAutoActivateConfig />
    </div>
  );
}
